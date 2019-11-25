package com.papel.data;

import android.os.Parcel;
import android.os.Parcelable;

import androidx.annotation.Nullable;

public abstract class TradingEquipment implements Parcelable {

    public static final int CLASS_TYPE_STOCK = 1;
    public static final int CLASS_TYPE_CURRENCY = 2;

    public TradingEquipment() {

    }

    @Override
    public void writeToParcel(Parcel parcel, int i) {
        // Write in FIFO
    }

    public TradingEquipment(Parcel in) {

    }

    public static final Creator<TradingEquipment> CREATOR = new Creator<TradingEquipment>() {
        @Override
        public TradingEquipment createFromParcel(Parcel in) {
            return TradingEquipment.getConcreteClass(in);
        }

        @Override
        public TradingEquipment[] newArray(int size) {
            return new TradingEquipment[size];
        }
    };

    public static TradingEquipment getConcreteClass(Parcel source) {

        switch (source.readInt()) {
            case CLASS_TYPE_STOCK:
                return new Stock(source);
            case CLASS_TYPE_CURRENCY:
                return new Currency(source);
            default:
                return null;
        }
    }

        /*@Override
    public boolean equals(@Nullable Object obj) {
        if (obj instanceof TradingEquipment) {
            return this.id.equals(((TradingEquipment) obj).getId());
        }
        return false;
    } */
}
