package com.papel.data;

import android.os.Parcel;
import android.os.Parcelable;

public class GoogleUserAccount implements Parcelable {
    private double latitude;
    private double longitude;
    private String name;
    private String surname;
    private String email;
    private String googleUserId;

    public GoogleUserAccount(double latitude, double longitude, String name, String surname, String email, String googleUserId) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.googleUserId = googleUserId;
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel parcel, int i) {
        parcel.writeDouble(this.latitude);
        parcel.writeDouble(this.longitude);
        parcel.writeString(this.name);
        parcel.writeString(this.surname);
        parcel.writeString(this.email);
        parcel.writeString(this.googleUserId);
    }

    public static final Parcelable.Creator<GoogleUserAccount> CREATOR = new Parcelable.Creator<GoogleUserAccount>() {
        public GoogleUserAccount createFromParcel(Parcel in) {
            return new GoogleUserAccount(in);
        }

        public GoogleUserAccount[] newArray(int size) {
            return new GoogleUserAccount[size];
        }
    };

    private GoogleUserAccount(Parcel in) {
        this.latitude = in.readDouble();
        this.longitude = in.readDouble();
        this.name = in.readString();
        this.surname = in.readString();
        this.email = in.readString();
        this.googleUserId = in.readString();
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGoogleUserId() {
        return googleUserId;
    }

    public void setGoogleUserId(String googleUserId) {
        this.googleUserId = googleUserId;
    }
}
