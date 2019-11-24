package com.papel.data;

import android.os.Parcel;
import android.os.Parcelable;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

public class Article implements Parcelable {
    private String id;
    private String title;
    private String body;
    private String authorId;
    private String authorName;
    private String date;
    private ArrayList<Comment> comments;
    private int voteCount;
    private Date dateObj;
    private int userVote=0;

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

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel parcel, int i) {
        parcel.writeString(this.id);
        parcel.writeString(this.title);
        parcel.writeString(this.body);
        parcel.writeString(this.authorId);
        parcel.writeString(this.authorName);
        parcel.writeString(this.date);
        parcel.writeInt(this.voteCount);
        parcel.writeList(this.comments);
    }

    public static final Parcelable.Creator<Article> CREATOR = new Parcelable.Creator<Article>() {
        public Article createFromParcel(Parcel in) {
            return new Article(in);
        }

        public Article[] newArray(int size) {
            return new Article[size];
        }
    };

    private Article(Parcel in) {
        this.id = in.readString();
        this.title = in.readString();
        this.body = in.readString();
        this.authorId = in.readString();
        this.authorName = in.readString();
        this.date = in.readString();
        this.voteCount = in.readInt();
        this.comments = in.readArrayList(null);
    }
    public int getUserVote() {
        return userVote;
    }

    public void setUserVote(int userVote) {
        this.userVote = userVote;
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
        SimpleDateFormat formatter = new SimpleDateFormat("dd MMMM yy • HH:mm a", Locale.US);
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