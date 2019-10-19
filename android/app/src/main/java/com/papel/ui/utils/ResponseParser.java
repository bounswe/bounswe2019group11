package com.papel.ui.utils;

import android.util.Log;

import com.papel.data.Portfolio;
import com.papel.data.TradingEquipment;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class ResponseParser {

    public static Portfolio parsePortfolio(JSONObject response) {
        Portfolio portfolio = null;
        try {
            String portfolioId = response.getString("_id");
            String portfolioName = response.getString("name");
            JSONArray stocks = response.getJSONArray("stocks");
            ArrayList<TradingEquipment> tradingEquipments = new ArrayList<>();
            for (int j = 0; j < stocks.length(); j++) {
                JSONObject stockObject = stocks.getJSONObject(j);
                TradingEquipment tradingEquipment = parseTradingEquipment(stockObject);
                if(tradingEquipment != null) {
                    tradingEquipments.add(tradingEquipment);
                }
            }
            portfolio = new Portfolio(portfolioId,portfolioName,tradingEquipments);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return portfolio;
    }

    public static TradingEquipment parseTradingEquipment(JSONObject response) {
        TradingEquipment tradingEquipment = null;
        try {
            String stockId = response.getString("_id");
            String name = response.getString("name");
            String stockName = response.getString("stockName");
            String stockSymbol = response.getString("stockSymbol");
            double stockPrice = response.getDouble("price");
            tradingEquipment = new TradingEquipment(stockId,name,stockPrice,stockSymbol,stockName);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return tradingEquipment;
    }

}
