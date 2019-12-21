package com.papel.data;

import android.os.Parcel;
import android.os.Parcelable;

public class AnnotationBody implements Parcelable {
    private String type;
    private String value;
    private String purpose;
    private String format;
    private String createTime;
    private String userId;

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel parcel, int i) {
        parcel.writeString(this.type);
        parcel.writeString(this.value);
        parcel.writeString(this.purpose);
        parcel.writeString(this.format);
        parcel.writeString(this.createTime);
        parcel.writeString(this.userId);

    }
    public static final Parcelable.Creator<AnnotationBody> CREATOR = new Parcelable.Creator<AnnotationBody>() {
        public AnnotationBody createFromParcel(Parcel in) {
            return new AnnotationBody(in);
        }

        public AnnotationBody[] newArray(int size) {
            return new AnnotationBody[size];
        }
    };

    private AnnotationBody(Parcel in) {
        this.type = in.readString();
        this.value = in.readString();
        this.purpose = in.readString();
        this.format = in.readString();
        this.createTime = in.readString();
        this.userId = in.readString();
    }

    public AnnotationBody(String type, String value, String purpose, String format, String createTime, String userId) {
        this.type = type;
        this.value = value;
        this.purpose = purpose;
        this.format = format;
        this.createTime = createTime;
        this.userId = userId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
