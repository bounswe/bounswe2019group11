package com.papel.data;

import android.util.Log;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import static androidx.constraintlayout.widget.Constraints.TAG;

public class Comment {
    private String commentId;
    private String articleId;
    private String authorId;
    private String authorName;
    private String content;
    private String date;
    private boolean edited=false;
    private String lastEditDate;

    public Comment(String commentId, String articleId, String authorId, String authorName, String content, String date, boolean edited, String lastEditDate) {
        this.commentId = commentId;
        this.articleId = articleId;
        this.authorId = authorId;
        this.authorName = authorName;
        this.content = content;
        this.date = date;
        this.edited = edited;
        this.lastEditDate = lastEditDate;
    }

    public Comment(String commentId, String articleId, String authorId, String authorName, String content, String date) {
        this.commentId = commentId;
        this.articleId = articleId;
        this.authorId = authorId;
        this.content = content;
        this.date = date;
        this.authorName = authorName;
        try {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ", Locale.US);
            Date dateObj = formatter.parse(date.replaceAll("Z$", "+0000"));
            SimpleDateFormat formatter2 = new SimpleDateFormat("EEEE, MMM dd, yyyy HH:mm:ss a", Locale.US);
            this.date = formatter2.format(dateObj);
        } catch (Exception e) {
            Log.d(TAG, "Comment: Date cannot be formatted. Exception: %s", e);
        }
    }

    public String getArticleId() {
        return articleId;
    }

    public String getAuthorId() {
        return authorId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public String getDate() {
        return date;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isEdited() {
        return edited;
    }

    public void setEdited(boolean edited) {
        this.edited = edited;
    }

    public String getLastEditDate() {
        return lastEditDate;
    }

    public void setLastEditDate(String lastEditted) {
        this.lastEditDate = lastEditted;
        try {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ", Locale.US);
            Date dateObj = formatter.parse(lastEditDate.replaceAll("Z$", "+0000"));
            SimpleDateFormat formatter2 = new SimpleDateFormat("EEEE, MMM dd, yyyy HH:mm:ss a", Locale.US);
            this.lastEditDate = formatter2.format(dateObj);
        } catch (Exception e) {
            Log.d(TAG, "Comment: lastEditDate cannot be formatted. Exception: %s", e);
        }
    }
}