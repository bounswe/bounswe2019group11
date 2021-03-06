package com.papel.data;

import android.os.Parcel;

import java.util.ArrayList;

public class Currency extends TradingEquipment {
    private String id;
    private String code;
    private String name;
    private double rate;
    private int predictionVoteCount=0;
    private int increaseCount=0;
    private int decreaseCount=0;
    private ArrayList<Comment> comments;
    private int userVote=0;

    public Currency(String id,String code, String name, double rate) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.rate = rate;
    }

    public Currency(String id, String code) {
        this.id = id;
        this.code = code;
    }


    public Currency(Parcel in, String id, String code) {
        super(in);
        this.id = id;
        this.code = code;
    }

    public Currency(Parcel in) {
        super(in);
        this.id = in.readString();
        this.code = in.readString();
        this.name = in.readString();
        this.rate = in.readDouble();
        this.predictionVoteCount = in.readInt();
        this.increaseCount = in.readInt();
        this.decreaseCount = in.readInt();
        this.comments = in.readArrayList(Comment.class.getClassLoader());
        this.userVote = in.readInt();
    }

    public Currency() {
        super();
    }

    public static final Creator<Currency> CREATOR = new Creator<Currency>() {
        @Override
        public Currency createFromParcel(Parcel in) {
            in.readInt();
            return new Currency(in);
        }

        @Override
        public Currency[] newArray(int size) {
            return new Currency[size];
        }
    };


    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel parcel, int i) {
        parcel.writeInt(TradingEquipment.CLASS_TYPE_CURRENCY);
        super.writeToParcel(parcel, i);
        parcel.writeString(this.id);
        parcel.writeString(this.code);
        parcel.writeString(this.name);
        parcel.writeDouble(this.rate);
        parcel.writeInt(this.predictionVoteCount);
        parcel.writeInt(this.increaseCount);
        parcel.writeInt(this.decreaseCount);
        parcel.writeList(this.comments);
        parcel.writeInt(this.userVote);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getRate() {
        return rate;
    }

    public void setRate(double rate) {
        this.rate = rate;
    }

    public ArrayList<Comment> getComments() {
        return comments;
    }

    public void setComments(ArrayList<Comment> comments) {
        this.comments = comments;
    }

    public int getPredictionVoteCount() {
        return predictionVoteCount;
    }

    public int getIncreaseCount() {
        return increaseCount;
    }

    public void setIncreaseCount(int increaseCount) {
        this.increaseCount = increaseCount;
        this.predictionVoteCount = this.decreaseCount + this.increaseCount;
    }

    public int getDecreaseCount() {
        return decreaseCount;
    }

    public void setDecreaseCount(int decreaseCount) {
        this.decreaseCount = decreaseCount;
        this.predictionVoteCount = this.decreaseCount + this.increaseCount;

    }

    public int getUserVote() {
        return userVote;
    }

    public void setUserVote(int userVote) {
        this.userVote = userVote;
    }
}
