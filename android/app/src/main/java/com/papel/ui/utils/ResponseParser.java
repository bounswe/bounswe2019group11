package com.papel.ui.utils;

import android.content.Context;
import android.util.Log;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.papel.Constants;
import com.papel.data.Article;
import com.papel.data.Comment;
import com.papel.data.Event;
import com.papel.data.Portfolio;
import com.papel.data.TradingEquipment;
import com.papel.data.User;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Array;
import java.util.ArrayList;

public class ResponseParser {

    public static Portfolio parsePortfolio(JSONObject response) {
        Portfolio portfolio = null;
        try {
            String portfolioId = response.getString("_id");
            String portfolioName = response.getString("name");
            JSONArray stocks = response.getJSONArray("stocks");
            ArrayList<TradingEquipment> tradingEquipments = new ArrayList<>();
            for (int j = 0; j < stocks.length(); j++) {
                JSONObject stockObject = stocks.getJSONObject(j);
                TradingEquipment tradingEquipment = parseTradingEquipment(stockObject);
                if(tradingEquipment != null) {
                    tradingEquipments.add(tradingEquipment);
                }
            }
            portfolio = new Portfolio(portfolioId,portfolioName,tradingEquipments);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return portfolio;
    }

    public static TradingEquipment parseTradingEquipment(JSONObject response) {
        TradingEquipment tradingEquipment = null;
        try {
            String stockId = response.getString("_id");
            String name = response.getString("name");
            String stockName = response.getString("stockName");
            String stockSymbol = response.getString("stockSymbol");
            double stockPrice = response.getDouble("price");
            tradingEquipment = new TradingEquipment(stockId,name,stockPrice,stockSymbol,stockName);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return tradingEquipment;
    }

    public static Event parseEvent(JSONObject response) {
        Event event = null;
        try {
            String eventTitle = response.getString("title");
            String eventBody = response.getString("body");
            String date = response.getString("date");
            String country = response.getString("country");
            double rank = response.getDouble("rank");
            JSONArray comments = response.getJSONArray("comment");
            ArrayList<String> eventComments = new ArrayList<>();
            for(int i = 0; i < comments.length(); i++){
                eventComments.add(comments.getString(i));
            }
            event = new Event(eventTitle, eventBody, eventComments, date, rank, country);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return event;
    }

    public static Comment parseComment(JSONObject response, String articleIdFromArticle) {
        Comment comment = null;
        try {
            String commentId = response.getString("_id");
            String authorId = response.getString("authorId");
            String articleId = articleIdFromArticle;
            if(response.has("articleId")){
                articleId = response.getString("articleId");
            }
            JSONArray author = response.getJSONArray("author");
            String authorName = author.getJSONObject(0).getString("name") + " " + author.getJSONObject(0).getString("surname");
            String body = response.getString("body");
            String date = response.getString("date");
            boolean edited = response.getBoolean("edited");
            String lastEditDate;
            if(edited){
                lastEditDate = response.getString("lastEditDate");
            }else{
                lastEditDate = date;
            }
            comment = new Comment(commentId, articleId, authorId, authorName, body, date, edited, lastEditDate);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return comment;
    }

    public static Article parseArticle(JSONObject response, Context context) {
        Article article = null;
        try {
            String articleId = response.getString("_id");
            String articleTitle = response.getString("title");
            String articleBody = response.getString("body");
            String authorId = response.getString("authorId");
            JSONObject author = response.getJSONObject("author");
            String authorName = author.getString("name") + " " + author.getString("surname");
            int voteCount = response.getInt("voteCount");
            String date = response.getString("date");
            article = new Article(articleId, articleTitle, articleBody,authorId, authorName, voteCount, date);
            if(response.has("comments")) {
                JSONArray comments = response.getJSONArray("comments");
                ArrayList<Comment> articleComments = new ArrayList<>();
                for (int i = 0; i < comments.length(); i++) {
                    Comment comment = parseComment(comments.getJSONObject(i), articleId);
                    articleComments.add(comment);
                }
                article.setComments(articleComments);
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
        return article;
    }

    public static User parseUser(JSONObject response) {
        User user = null;
        try {
            String token = response.getString("token");
            JSONObject userObject = response.getJSONObject("user");
            JSONObject location = userObject.getJSONObject("location");
            double latitude = location.getDouble("latitude");
            double longitude = location.getDouble("longitude");
            String role = userObject.getString("role");
            String id = userObject.getString("_id");
            String name = userObject.getString("name");
            String surname = userObject.getString("surname");
            String email = userObject.getString("email");
            String idNumber = userObject.getString("idNumber");
            String iban = userObject.getString("iban");

            user = new User(token, latitude, longitude, role, id, name, surname, email, idNumber, iban);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return user;
    }

}
