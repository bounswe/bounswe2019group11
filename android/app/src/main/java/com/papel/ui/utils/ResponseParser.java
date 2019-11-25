package com.papel.ui.utils;

import com.papel.data.Article;
import com.papel.data.Comment;
import com.papel.data.Currency;
import com.papel.data.Event;
import com.papel.data.Portfolio;
import com.papel.data.Stock;
import com.papel.data.TradingEquipment;
import com.papel.data.User;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

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
                Stock stock = parseStock(stockObject);
                if(stock != null) {
                    tradingEquipments.add(stock);
                }
            }
            portfolio = new Portfolio(portfolioId,portfolioName,tradingEquipments);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return portfolio;
    }

    public static Stock parseStock(JSONObject response) {
        Stock stock = null;
        try {
            String id = response.getString(("_id"));
            String stockId = response.getString("_id");
            String name = response.getString("name");
            //String stockName = response.getString("stockName");
            String stockSymbol = response.getString("stockSymbol");
            double stockPrice = response.getDouble("price");
            stock = new Stock(stockId,name,stockPrice,stockSymbol);
            if(response.has("comments")) {
                JSONArray comments = response.getJSONArray("comments");
                ArrayList<Comment> stockComments = new ArrayList<>();
                for (int i = 0; i < comments.length(); i++) {
                    Comment comment = parseComment(comments.getJSONObject(i), id);
                    stockComments.add(comment);
                }
                stock.setComments(stockComments);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return stock;
    }

    public static Currency parseCurrency(JSONObject response) {
        Currency currency = null;
        try {
            String code = response.getString("code");
            String name = response.getString("name");
            double rate = response.getDouble("rate");
            currency = new Currency(code,name,rate);
            if(response.has("comments")) {
                JSONArray comments = response.getJSONArray("comments");
                ArrayList<Comment> currencyComments = new ArrayList<>();
                for (int i = 0; i < comments.length(); i++) {
                    Comment comment = parseComment(comments.getJSONObject(i), code);
                    currencyComments.add(comment);
                }
                currency.setComments(currencyComments);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return currency;
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

    public static Comment parseComment(JSONObject response, String contextIdFromOuter) {
        Comment comment = null;
        try {
            String commentId = response.getString("_id");
            String authorId = response.getString("authorId");
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
            comment = new Comment(commentId, contextIdFromOuter, authorId, authorName, body, date, edited, lastEditDate);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return comment;
    }

    public static Article parseArticle(JSONObject response) {
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

            if(response.has("userVote")){
                article.setUserVote(response.getInt("userVote"));
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

    public static User parseFollowUser(JSONObject response) {
        User user = null;
        try {
            String id = response.getString("_id");
            String name = response.getString("name");
            String surname = response.getString("surname");
            String email = response.getString("email");
            user = new User(id,name,surname,email);
        }catch (JSONException e) {
            e.printStackTrace();
        }
        return user;
    }

}
