package com.papel.ui.portfolio;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;
import android.widget.ListView;

import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.papel.R;
import com.papel.data.TradingEquipment;

import java.util.ArrayList;

public class PortfolioDetailActivity extends AppCompatActivity {

    private ArrayList<TradingEquipment> tradingEquipments = new ArrayList<>();
    private TradingEquipmentListViewAdapter tradingEquipmentListViewAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_portfolio_detail);

        Intent intent = getIntent();
        String portfolioName = intent.getStringExtra("PortfolioName");
        setTitle(portfolioName);

        try {
            // TODO Test HERE
            ActionBar actionBar = getSupportActionBar();
            actionBar.setHomeButtonEnabled(true);
            actionBar.setDisplayHomeAsUpEnabled(true);
        } catch (NullPointerException exp) {
            exp.printStackTrace();
        }

        ListView tradingEquipmentListView = findViewById(R.id.trading_equipment_list);
        FloatingActionButton addTradingEquipment = findViewById(R.id.add_trading_equipment);

        TradingEquipment tradingEquipment1 = new TradingEquipment("TE1");
        TradingEquipment tradingEquipment2 = new TradingEquipment("TE2");
        tradingEquipments.add(tradingEquipment1);
        tradingEquipments.add(tradingEquipment2);

        tradingEquipmentListViewAdapter = new TradingEquipmentListViewAdapter(getApplicationContext(), tradingEquipments);
        tradingEquipmentListView.setAdapter(tradingEquipmentListViewAdapter);

    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if(item.getItemId() == android.R.id.home) {
            //this.finish();
            onBackPressed();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
