package com.papel.data;

public class User {
    private String name;
    private String mail;
    private String description;

    public User(String name, String mail, String description) {
        this.name = name;
        this.mail = mail;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
