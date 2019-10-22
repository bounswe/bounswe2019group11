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

    private static String author;

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

    public static Article parseArticle(JSONObject response, Context context) {
        Article article = null;
        try {
            String articleId = response.getString("_id");
            String articleTitle = response.getString("title");
            String articleBody = response.getString("body");
            String authorId = response.getString("authorId");
            getAuthorNameFromAuthorId(context, authorId);
            String date = response.getString("date");
            double rank = 5.0;
            if(response.has("rank")) {
                rank = response.getDouble("rank");
            }
            JSONArray comments = response.getJSONArray("comment");
            ArrayList<String> articleComments = new ArrayList<>();
            for(int i = 0; i < comments.length(); i++){
                articleComments.add(comments.getString(i));
            }
            article = new Article(articleId, articleTitle, articleBody,authorId, rank, date);
            article.setComments(articleComments);
            article.setAuthorName(author);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return article;
    }

    public static void getAuthorNameFromAuthorId(final Context context, String authorId) {
        RequestQueue requestQueue = Volley.newRequestQueue(context);
        String url = Constants.LOCALHOST + Constants.USER + authorId;
        StringRequest request = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject authorObj = new JSONObject(response);
                    author = authorObj.getString("name") + " " +  authorObj.getString("surname");
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("Author not found", "onErrorResponse: ");
                author=" ";
            }
        });

        requestQueue.add(request);
    }

}
