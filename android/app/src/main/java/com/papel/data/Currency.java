package com.papel.data;

import android.os.Parcel;

public class Currency extends TradingEquipment {
    private String code;
    private String name;
    private double rate;

    public Currency(String code, String name, double rate) {
        this.code = code;
        this.name = name;
        this.rate = rate;
    }

    public Currency(Parcel in) {
        super(in);
        this.code = in.readString();
        this.name = in.readString();
        this.rate = in.readDouble();
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
        parcel.writeString(this.code);
        parcel.writeString(this.name);
        parcel.writeDouble(this.rate);
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
}
