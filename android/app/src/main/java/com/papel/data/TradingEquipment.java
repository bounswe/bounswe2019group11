package com.papel.data;

import androidx.annotation.Nullable;

public class TradingEquipment {
    private String id;
    private String name;
    private double price;
    private String symbol;

    public TradingEquipment() {

    }

    public TradingEquipment(String id, String name, double price, String symbol) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.symbol = symbol;
    }


    @Override
    public boolean equals(@Nullable Object obj) {
        if (obj instanceof TradingEquipment) {
            return this.id.equals(((TradingEquipment) obj).getId());
        }
        return false;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }
}
