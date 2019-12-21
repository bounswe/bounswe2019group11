package com.papel.data;

public class Investment {

    private String id;
    private TradingEquipment equipment;
    private double amount;


    public Investment(TradingEquipment equipment, double amount) {
        this.equipment = equipment;
        this.amount = amount;
    }

    public String getId() {
        return id;
    }

    public TradingEquipment getEquipment() {
        return equipment;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }
}
