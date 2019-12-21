package com.papel.data;

import java.util.ArrayList;

public class Annotation {
    private String id;
    private String userID;
    private String createTime;
    private String value;
    private int start;
    private int end;
    private ArrayList<AnnotationBody> bodies;


    public Annotation(String id, String userID, String createTime, String value, int start, int end,ArrayList<AnnotationBody> bodies) {
        this.id = id;
        this.userID = userID;
        this.createTime = createTime;
        this.value = value;
        this.start = start;
        this.end = end;
        this.bodies = bodies;
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

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
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

    public ArrayList<AnnotationBody> getBodies() {
        return bodies;
    }

    public void setBodies(ArrayList<AnnotationBody> bodies) {
        this.bodies = bodies;
    }
}
