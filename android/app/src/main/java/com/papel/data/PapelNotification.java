package com.papel.data;

public class PapelNotification {
    private String id;
    private String notifType;
    private String follower_id;
    private String follower_name;
    private String follower_surname;

    private int tradingEqType;
    private String currencyCode;
    private String stockSymbol;
    private String stockId;
    private int direction;
    private double rate;
    private double currentRate;

    private String notifMessage;

    public PapelNotification(String notifMessage){
        this.notifMessage=notifMessage;
    }

    public PapelNotification(String id, String notifType, String follower_id, String follower_name, String follower_surname, String notifMessage) {
        this.id = id;
        this.notifType = notifType;
        this.follower_id = follower_id;
        this.follower_name = follower_name;
        this.follower_surname = follower_surname;
        this.notifMessage = notifMessage;
    }

    public PapelNotification(String id, String notifType, int tradingEqType, String currencyCode, String stockSymbol, String stockId, int direction, double rate, double currentRate, String notifMessage) {
        this.id = id;
        this.notifType = notifType;
        this.tradingEqType = tradingEqType;
        this.currencyCode = currencyCode;
        this.stockSymbol = stockSymbol;
        this.stockId = stockId;
        this.direction = direction;
        this.rate = rate;
        this.currentRate = currentRate;
        this.notifMessage = notifMessage;
    }

    public String getNotifType() {
        return notifType;
    }

    public String getId() {
        return id;
    }

    public String getNotifMessage() {
        return notifMessage;
    }

    public void setNotifMessage(String notifMessage) {
        this.notifMessage = notifMessage;
    }

    public String getFollower_id() {
        return follower_id;
    }

    public void setFollower_id(String follower_id) {
        this.follower_id = follower_id;
    }

    public String getFollower_name() {
        return follower_name;
    }

    public void setFollower_name(String follower_name) {
        this.follower_name = follower_name;
    }

    public String getFollower_surname() {
        return follower_surname;
    }

    public void setFollower_surname(String follower_surname) {
        this.follower_surname = follower_surname;
    }

    public int getTradingEqType() {
        return tradingEqType;
    }

    public void setTradingEqType(int tradingEqType) {
        this.tradingEqType = tradingEqType;
    }

    public String getCurrencyCode() {
        return currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    public String getStockSymbol() {
        return stockSymbol;
    }

    public void setStockSymbol(String stockSymbol) {
        this.stockSymbol = stockSymbol;
    }

    public String getStockId() {
        return stockId;
    }

    public void setStockId(String stockId) {
        this.stockId = stockId;
    }

    public int getDirection() {
        return direction;
    }

    public void setDirection(int direction) {
        this.direction = direction;
    }

    public double getRate() {
        return rate;
    }

    public void setRate(double rate) {
        this.rate = rate;
    }

    public double getCurrentRate() {
        return currentRate;
    }

    public void setCurrentRate(double currentRate) {
        this.currentRate = currentRate;
    }
}
