package com.papel.data;

import android.os.Parcel;
import android.os.Parcelable;

import androidx.annotation.Nullable;

public class TradingEquipment implements Parcelable {
    private String id;
    private String name;
    private double price;
    private String symbol;

    public TradingEquipment() {

    }

    public TradingEquipment(String id, String name, double price, String symbol) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.symbol = symbol;
    }


    @Override
    public boolean equals(@Nullable Object obj) {
        if (obj instanceof TradingEquipment) {
            return this.id.equals(((TradingEquipment) obj).getId());
        }
        return false;
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
    }

    public static final Parcelable.Creator<TradingEquipment> CREATOR = new Parcelable.Creator<TradingEquipment>() {
        public TradingEquipment createFromParcel(Parcel in) {
            return new TradingEquipment(in);
        }

        public TradingEquipment[] newArray(int size) {
            return new TradingEquipment[size];
        }
    };

    private TradingEquipment(Parcel in) {
        this.id = in.readString();
        this.name = in.readString();
        this.price = in.readDouble();
        this.symbol = in.readString();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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
}
