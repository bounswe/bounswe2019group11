package com.papel.data;

import android.content.Context;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.papel.Constants;
import com.papel.ui.utils.DialogHelper;
import com.papel.ui.utils.ResponseParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

public class Article {
    private String id;
    private String title;
    private String body;
    private String authorId;
    private String authorName;
    private String date;
    private int voterNumber;
    private double rank;
    private ArrayList<String> comments = new ArrayList<>();

    public Article() {
    }

    public Article(String id, String title, String body, String authorId, double rank, String date) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.authorId = authorId;
        this.rank = rank;
        this.date = date;

        try {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ", Locale.US);
            Date dateObj = formatter.parse(date.replaceAll("Z$", "+0000"));
            SimpleDateFormat formatter2 = new SimpleDateFormat("EEEE, MMM dd, yyyy HH:mm:ss a", Locale.US);
            this.date = formatter2.format(dateObj);
        } catch (Exception e) {

        }


    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public int getVoterNumber() {
        return voterNumber;
    }

    public void setVoterNumber(int voterNumber) {
        this.voterNumber = voterNumber;
    }

    public double getRank() {
        return rank;
    }

    public void setRank(double rank) {
        this.rank = rank;
    }

    public ArrayList<String> getComments() {
        return comments;
    }

    public void setComments(ArrayList<String> comments) {
        this.comments = comments;
    }

}