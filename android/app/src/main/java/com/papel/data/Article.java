package com.papel.data;

import java.util.Date;

public class Article {
    private String title;
    private String content;
    private String author;
    private Date date;

    public Article(String title, String content, String author, Date date) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.date = date;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}