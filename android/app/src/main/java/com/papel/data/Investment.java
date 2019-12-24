package com.papel.data;

public class Investment {

    private TradingEquipment equipment;
    private int amount;


    public Investment(TradingEquipment equipment, int amount) {
        this.equipment = equipment;
        this.amount = amount;
    }

    public TradingEquipment getEquipment() {
        return equipment;
    }

    public void setEquipment(TradingEquipment equipment) {
        this.equipment = equipment;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }
}
