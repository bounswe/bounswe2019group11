package com.papel.data;

import android.os.Parcel;
import android.os.Parcelable;

public class Stock extends TradingEquipment implements Parcelable {
    private String id;
    private String name;
    private double price;
    private String symbol;
    private String stockName;

    public Stock(String id, String name, double price, String symbol, String stockName) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.symbol = symbol;
        this.stockName = stockName;
    }
    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel parcel, int i) {
        // Write in FIFO
        parcel.writeString(this.id);
        parcel.writeString(this.name);
        parcel.writeDouble(this.price);
        parcel.writeString(this.symbol);
        parcel.writeString(this.stockName);
    }

    public static final Parcelable.Creator<Stock> CREATOR = new Parcelable.Creator<Stock>() {
        public Stock createFromParcel(Parcel in) {
            return new Stock(in);
        }

        public Stock[] newArray(int size) {
            return new Stock[size];
        }
    };

    private Stock(Parcel in) {
        this.id = in.readString();
        this.name = in.readString();
        this.price = in.readDouble();
        this.symbol = in.readString();
        this.stockName = in.readString();
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

    public String getStockName() {
        return stockName;
    }

    public void setStockName(String stockName) {
        this.stockName = stockName;
    }
}

