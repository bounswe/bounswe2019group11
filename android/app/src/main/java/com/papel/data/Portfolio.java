package com.papel.data;

import java.util.ArrayList;

public class Portfolio {
    private String name;
    private ArrayList<TradingEquipment> tradingEquipments;

    public Portfolio(String name) {
        this.name = name;
    }

    public Portfolio(String name, ArrayList<TradingEquipment> tradingEquipments) {
        this.name = name;
        this.tradingEquipments = tradingEquipments;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ArrayList<TradingEquipment> getTradingEquipments() {
        return tradingEquipments;
    }

    public void setTradingEquipments(ArrayList<TradingEquipment> tradingEquipments) {
        this.tradingEquipments = tradingEquipments;
    }
}
