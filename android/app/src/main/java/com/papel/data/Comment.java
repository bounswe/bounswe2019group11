package com.papel.data;

import android.os.Parcel;
import android.os.Parcelable;
import android.util.Log;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import static androidx.constraintlayout.widget.Constraints.TAG;

public class Comment implements Parcelable {
    private String commentId;
    private String contextId;
    private String authorId;
    private String authorName;
    private String content;
    private String date;
    private boolean edited=false;
    private String lastEditDate;

    public Comment(String commentId, String contextId, String authorId, String authorName, String content, String date, boolean edited, String lastEditDate) {
        this.commentId = commentId;
        this.contextId = contextId;
        this.authorId = authorId;
        this.authorName = authorName;
        this.content = content;
        this.date = date;
        this.edited = edited;
        this.lastEditDate = lastEditDate;
        try {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ", Locale.US);
            Date dateObj = formatter.parse(date.replaceAll("Z$", "+0000"));
            SimpleDateFormat formatter2 = new SimpleDateFormat("EEEE, MMM dd, yyyy HH:mm:ss a", Locale.US);
            this.date = formatter2.format(dateObj);
        } catch (Exception e) {
            Log.d(TAG, "Comment: Date cannot be formatted. Exception: %s", e);
        }
        try {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ", Locale.US);
            Date dateObj = formatter.parse(lastEditDate.replaceAll("Z$", "+0000"));
            SimpleDateFormat formatter2 = new SimpleDateFormat("EEEE, MMM dd, yyyy HH:mm:ss a", Locale.US);
            this.lastEditDate = formatter2.format(dateObj);
        } catch (Exception e) {
            Log.d(TAG, "Comment: lastEditDate cannot be formatted. Exception: %s", e);
        }
    }

    public Comment(String commentId, String contextId, String authorId, String authorName, String content, String date) {
        this.commentId = commentId;
        this.contextId = contextId;
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

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel parcel, int i) {
        parcel.writeString(this.commentId);
        parcel.writeString(this.contextId);
        parcel.writeString(this.authorId);
        parcel.writeString(this.authorName);
        parcel.writeString(this.content);
        parcel.writeString(this.date);
        parcel.writeByte((byte) (this.edited ? 1 : 0));
        parcel.writeString(this.lastEditDate);

    }

    public static final Parcelable.Creator<Comment> CREATOR = new Parcelable.Creator<Comment>() {
        public Comment createFromParcel(Parcel in) {
            return new Comment(in);
        }

        public Comment[] newArray(int size) {
            return new Comment[size];
        }
    };

    private Comment(Parcel in) {
        this.commentId = in.readString();
        this.contextId = in.readString();
        this.authorId = in.readString();
        this.authorName = in.readString();
        this.content = in.readString();
        this.date = in.readString();
        this.edited = in.readByte() != 0;
        this.lastEditDate = in.readString();
    }

    public String getCommentId() {
        return commentId;
    }

    public String getContextId() {
        return contextId;
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