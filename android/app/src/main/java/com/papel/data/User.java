package com.papel.data;

import android.os.Parcel;
import android.os.Parcelable;

public class User implements Parcelable {
    private String token;
    private double latitude;
    private double longitude;
    private String role;
    private String id;
    private String name;
    private String surname;
    private String email;
    private String idNumber;
    private String iban;
    private static User user;

    public static User getInstance() {
        return user;
    }

    public static void setInstance(User user1) {
        user = user1;
    }

    public User(String id,String name, String surname, String email) {
        this.token = "";
        this.latitude = 0;
        this.longitude = 0;
        this.role = "";
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.idNumber = "";
        this.iban = "";
    }

    public User(String token, double latitude, double longitude, String role, String id, String name, String surname, String email, String idNumber, String iban) {
        this.token = token;
        this.latitude = latitude;
        this.longitude = longitude;
        this.role = role;
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.idNumber = idNumber;
        this.iban = iban;
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel parcel, int i) {
        parcel.writeString(this.token);
        parcel.writeDouble(this.latitude);
        parcel.writeDouble(this.longitude);
        parcel.writeString(role);
        parcel.writeString(id);
        parcel.writeString(name);
        parcel.writeString(surname);
        parcel.writeString(email);
        parcel.writeString(idNumber);
        parcel.writeString(iban);
    }

    public static final Parcelable.Creator<User> CREATOR = new Parcelable.Creator<User>() {
        public User createFromParcel(Parcel in) {
            return new User(in);
        }

        public User[] newArray(int size) {
            return new User[size];
        }
    };

    private User(Parcel in) {
        this.token = in.readString();
        this.latitude = in.readDouble();
        this.longitude = in.readDouble();
        this.role = in.readString();
        this.id = in.readString();
        this.name = in.readString();
        this.surname = in.readString();
        this.email = in.readString();
        this.idNumber = in.readString();
        this.iban = in.readString();
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
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

    public String getIdNumber() {
        return idNumber;
    }

    public void setIdNumber(String idNumber) {
        this.idNumber = idNumber;
    }

    public String getIban() {
        return iban;
    }

    public void setIban(String iban) {
        this.iban = iban;
    }
}
