package com.papel.data;

import android.os.Parcel;
import android.os.Parcelable;

import androidx.annotation.Nullable;

public class TradingEquipment implements Parcelable {
    public TradingEquipment() {

    }
    
    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel parcel, int i) {

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
    }

}
