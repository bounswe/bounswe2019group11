package com.papel.data;

import android.os.Parcel;

import java.util.ArrayList;

public class Stock extends TradingEquipment {
    private String id;
    private String name;
    private double price;
    private String symbol;
    private ArrayList<Comment> comments;

    public Stock(String id, String name, double price, String symbol) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.symbol = symbol;
    }

    public Stock(Parcel in) {
        super(in);
        this.id = in.readString();
        this.name = in.readString();
        this.price = in.readDouble();
        this.symbol = in.readString();
    }

    public Stock() {
        super();
    }

    public static final Creator<Stock> CREATOR = new Creator<Stock>() {
        @Override
        public Stock createFromParcel(Parcel in) {
            in.readInt();
            return new Stock(in);
        }

        @Override
        public Stock[] newArray(int size) {
            return new Stock[size];
        }
    };


    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel parcel, int i) {
        parcel.writeInt(TradingEquipment.CLASS_TYPE_STOCK);
        super.writeToParcel(parcel, i);
        parcel.writeString(this.id);
        parcel.writeString(this.name);
        parcel.writeDouble(this.price);
        parcel.writeString(this.symbol);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public ArrayList<Comment> getComments() {
        return comments;
    }

    public void setComments(ArrayList<Comment> comments) {
        this.comments = comments;
    }
}

