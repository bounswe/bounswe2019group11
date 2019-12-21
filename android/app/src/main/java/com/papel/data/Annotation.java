package com.papel.data;

import java.util.ArrayList;

public class Annotation {
    private String id;
    private String userID;
    private String createTime;
    private int start;
    private int end;
    private ArrayList<AnnotationBody> body;


    public Annotation(String id, String userID, String createTime, int start, int end,ArrayList<AnnotationBody> body) {
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
