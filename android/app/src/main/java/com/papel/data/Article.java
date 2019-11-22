package com.papel.data;

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
    private ArrayList<Comment> comments;
    private int voteCount;
    private Date dateObj;

    public Article() {
    }

    public Article(String id, String title, String body, String authorId, String authorName, int voteCount, String date) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.authorId = authorId;
        this.authorName = authorName;
        this.voteCount = voteCount;
        this.date = date;

        try {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ", Locale.US);
            Date dateObj = formatter.parse(date.replaceAll("Z$", "+0000"));
            this.dateObj = dateObj;
            SimpleDateFormat formatter2 = new SimpleDateFormat("dd MMM yy • HH:mm a", Locale.US);
            this.date = formatter2.format(dateObj);
        } catch (Exception e) {

        }
    }

    public int getVoteCount() {
        return voteCount;
    }

    public ArrayList<Comment> getComments() {
        return comments;
    }

    public void setComments(ArrayList<Comment> comments) {
        this.comments = comments;
    }

    public String getDate() {
        return date;
    }

    public String getLongDate() {
        SimpleDateFormat formatter = new SimpleDateFormat("EEEE, MMMM dd, yyyy HH:mm:ss a", Locale.US);
        return  formatter.format(dateObj);
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getAuthorName() {
        return authorName;
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

}