package com.papel.data;

import android.os.Parcel;
import android.os.Parcelable;


public class Alert implements Parcelable {
    private String stockId;
    private String stockSymbol;
    private String currencyCode;
    private String id;
    private int type;
    private int direction;
    private double rate;

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel parcel, int i) {
        parcel.writeString(this.stockId);
        parcel.writeString(this.stockSymbol);
        parcel.writeString(this.currencyCode);
        parcel.writeString(this.id);
        parcel.writeInt(this.type);
        parcel.writeInt(this.direction);
        parcel.writeDouble(this.rate);
    }

    public static final Parcelable.Creator<Alert> CREATOR = new Parcelable.Creator<Alert>() {
        public Alert createFromParcel(Parcel in) {
            return new Alert(in);
        }

        public Alert[] newArray(int size) {
            return new Alert[size];
        }
    };

    private Alert(Parcel in) {
        this.stockId = in.readString();
        this.stockSymbol = in.readString();
        this.currencyCode = in.readString();
        this.id = in.readString();
        this.type = in.readInt();
        this.direction = in.readInt();
        this.rate = in.readDouble();
    }

    public Alert(String stockId, String stockSymbol,String currencyCode, String id, int type, int direction, double rate) {
        this.stockId = stockId;
        this.stockSymbol = stockSymbol;
        this.currencyCode = currencyCode;
        this.id = id;
        this.type = type;
        this.direction = direction;
        this.rate = rate;
    }

    public String getStockId() {
        return stockId;
    }

    public void setStockId(String stockId) {
        this.stockId = stockId;
    }

    public String getCurrencyCode() {
        return currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public int getDirection() {
        return direction;
    }

    public void setDirection(int direction) {
        this.direction = direction;
    }

    public double getRate() {
        return rate;
    }

    public void setRate(double rate) {
        this.rate = rate;
    }

    public String getStockSymbol() {
        return stockSymbol;
    }

    public void setStockSymbol(String stockSymbol) {
        this.stockSymbol = stockSymbol;
    }
}
