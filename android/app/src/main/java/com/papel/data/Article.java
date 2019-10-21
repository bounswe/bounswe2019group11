package com.papel.data;

import java.util.ArrayList;
import java.util.Date;

public class Article {
    private String id;
    private String title;
    private String body;
    private String authorId;
    private String authorName;
    private int voterNumber;
    private double rank;
    private ArrayList<String> comments = new ArrayList<>();

    public Article() {
    }

    public Article(String id, String title, String body, String authorId, double rank) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.authorId = authorId;
        this.rank = rank;
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