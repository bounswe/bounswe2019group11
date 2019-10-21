package com.papel.data;

import java.util.ArrayList;

public class Event {
    private String title;
    private String body;
    private ArrayList<String> comments;
    private String date;
    private double rank;
    private String country;

    public Event(String title, String body, ArrayList<String> comments, String date, double rank, String country) {
        this.title = title;
        this.body = body;
        this.comments = comments;
        this.date = date;
        this.rank = rank;
        this.country = country;
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

    public ArrayList<String> getComments() {
        return comments;
    }

    public void setComments(ArrayList<String> comments) {
        this.comments = comments;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public double getRank() {
        return rank;
    }

    public void setRank(double rank) {
        this.rank = rank;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}
