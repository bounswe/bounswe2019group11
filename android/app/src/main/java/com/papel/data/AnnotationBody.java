package com.papel.data;

public class AnnotationBody {
    private String type;
    private String value;
    private String purpose;
    private String format;
    private String createTime;
    private String userId;

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
