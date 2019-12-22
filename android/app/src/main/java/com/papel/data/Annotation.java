package com.papel.data;

import android.os.Parcel;
import android.os.Parcelable;

import java.util.ArrayList;

public class Annotation implements Parcelable {
    private String id;
    private String userID;
    private String createTime;
    private int start;
    private int end;
    private ArrayList<AnnotationBody> body;

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel parcel, int i) {
        parcel.writeString(this.id);
        parcel.writeString(this.userID);
        parcel.writeString(this.createTime);
        parcel.writeInt(this.start);
        parcel.writeInt(this.end);
        parcel.writeTypedList(this.body);
    }

    public static final Parcelable.Creator<Annotation> CREATOR = new Parcelable.Creator<Annotation>() {
        public Annotation createFromParcel(Parcel in) {
            return new Annotation(in);
        }

        public Annotation[] newArray(int size) {
            return new Annotation[size];
        }
    };

    private Annotation(Parcel in) {
        this.id = in.readString();
        this.userID = in.readString();
        this.createTime = in.readString();
        this.start = in.readInt();
        this.end = in.readInt();
        this.body = new ArrayList<>();
        in.readTypedList(this.body,AnnotationBody.CREATOR);
    }

    public Annotation(String id, String userID, String createTime, int start, int end, ArrayList<AnnotationBody> body) {
        this.id = id;
        this.userID = userID;
        this.createTime = createTime;
        this.start = start;
        this.end = end;
        this.body = body;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserID() {
        return userID;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public int getStart() {
        return start;
    }

    public void setStart(int start) {
        this.start = start;
    }

    public int getEnd() {
        return end;
    }

    public void setEnd(int end) {
        this.end = end;
    }

    public ArrayList<AnnotationBody> getBody() {
        return body;
    }

    public void setBodies(ArrayList<AnnotationBody> body) {
        this.body = body;
    }
}
