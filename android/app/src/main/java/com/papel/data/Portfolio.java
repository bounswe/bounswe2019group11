package com.papel.data;

import android.os.Parcel;
import android.os.Parcelable;

import java.util.ArrayList;

public class Portfolio implements Parcelable {
    private String id;
    private String name;
    private ArrayList<TradingEquipment> tradingEquipments;

    public Portfolio(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public Portfolio(String id, String name, ArrayList<TradingEquipment> tradingEquipments) {
        this.id = id;
        this.name = name;
        this.tradingEquipments = tradingEquipments;
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel parcel, int i) {
        parcel.writeString(this.id);
        parcel.writeString(this.name);
        parcel.writeTypedList(this.tradingEquipments);
    }

    public static final Parcelable.Creator<Portfolio> CREATOR = new Parcelable.Creator<Portfolio>() {
        public Portfolio createFromParcel(Parcel in) {
            return new Portfolio(in);
        }

        public Portfolio[] newArray(int size) {
            return new Portfolio[size];
        }
    };

    private Portfolio(Parcel in) {
        this.id = in.readString();
        this.name = in.readString();
        this.tradingEquipments = new ArrayList<>();
        in.readTypedList(this.tradingEquipments,TradingEquipment.CREATOR);
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

    public ArrayList<TradingEquipment> getTradingEquipments() {
        return tradingEquipments;
    }

    public void setTradingEquipments(ArrayList<TradingEquipment> tradingEquipments) {
        this.tradingEquipments = tradingEquipments;
    }

    public void addTradingEquipment(TradingEquipment tradingEquipment) {
        this.tradingEquipments.add(tradingEquipment);
    }
}
