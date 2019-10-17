package com.papel.ui.portfolio;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.ProgressBar;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.papel.Constants;
import com.papel.R;
import com.papel.data.TradingEquipment;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class PortfolioDetailActivity extends AppCompatActivity {

    private ArrayList<TradingEquipment> tradingEquipments = new ArrayList<>();
    private TradingEquipmentListViewAdapter tradingEquipmentListViewAdapter;
    private ArrayList<TradingEquipment> tradingEquipmentOptions = new ArrayList<>();
    private ArrayList<TradingEquipment> tempTradingEquipment = new ArrayList<>();

    private FloatingActionButton addTradingEquipment;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_portfolio_detail);

        final Intent intent = getIntent();
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
        addTradingEquipment = findViewById(R.id.add_trading_equipment);

        TradingEquipment tradingEquipment1 = new TradingEquipment("5da7d2596a8ed138c5e20b11","iShares J.P. Morgan USD Emerging Markets Bond ETF",113.02,"EMB");
        TradingEquipment tradingEquipment2 = new TradingEquipment("5da7d25a6a8ed138c5e20b13","Emclaire Financial Corp - Common Stock",30.77,"EMCF");
        tradingEquipments.add(tradingEquipment1);
        tradingEquipments.add(tradingEquipment2);

        tradingEquipmentListViewAdapter = new TradingEquipmentListViewAdapter(getApplicationContext(), tradingEquipments);
        tradingEquipmentListView.setAdapter(tradingEquipmentListViewAdapter);

        final Intent detailIntent = new Intent(this, TradingEquipmentDetailActivity.class);


        tradingEquipmentListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                TradingEquipment clicked = tradingEquipmentListViewAdapter.getItem(i);
                Log.d("Trading Equipement", "Trading equipment clicked: " + clicked.getName());
                detailIntent.putExtra("TradingEquipment",clicked);
                startActivity(detailIntent);
            }
        });

        addTradingEquipment.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                addTradingEquipment.setClickable(false);
                fetchTradingEquipments();
            }
        });

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

    private void showListDialog() {
        Context context = PortfolioDetailActivity.this;
        AlertDialog.Builder dialogBuilder = new AlertDialog.Builder(context);
        dialogBuilder.setTitle("Select trading equipments");

        // Add checkbox list
        //String[] items = {"item1","item2","item3","item4","item5","item6","item7","item8","item9","item10","item11","item12","item13","item14","item15","item16","item17"};
        String[] tradingEquipmentOptionsSymbols = new String[tradingEquipmentOptions.size()];
        for(int i = 0; i<tradingEquipmentOptions.size(); i++) {
            tradingEquipmentOptionsSymbols[i] = tradingEquipmentOptions.get(i).getSymbol();
        }

        boolean[] checked = new boolean[tradingEquipmentOptions.size()];
        tempTradingEquipment.addAll(tradingEquipments);
        for(int i = 0; i<tradingEquipmentOptions.size(); i++) {
            for (int j = 0; j<tradingEquipments.size(); j++) {
                if (tradingEquipmentOptions.get(i).getId().equals(tradingEquipments.get(j).getId())) {
                    checked[i] = true;
                }
            }
        }

        dialogBuilder.setMultiChoiceItems(tradingEquipmentOptionsSymbols, checked, new DialogInterface.OnMultiChoiceClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i, boolean b) {
                Log.d("Dialog","Multichoice i: " + i + " b: " + b);
                TradingEquipment selected = tradingEquipmentOptions.get(i);
                if (b) {
                    tempTradingEquipment.add(selected);
                } else {
                    for(int j = 0; j<tempTradingEquipment.size(); j++) {
                        TradingEquipment c = tempTradingEquipment.get(j);
                        Log.d("Dialog", "before remove temp " + c.getSymbol());
                    }
                    boolean r = tempTradingEquipment.remove(selected);
                    Log.d("Dialog","r: " + r);
                    for(int j = 0; j<tempTradingEquipment.size(); j++) {
                        TradingEquipment c = tempTradingEquipment.get(j);
                        Log.d("Dialog", "after remove temp " + c.getSymbol());
                    }
                }
            }
        });

        dialogBuilder.setPositiveButton("Ok", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                tradingEquipments.clear();
                tradingEquipments.addAll(tempTradingEquipment);
                tempTradingEquipment.clear();
                tradingEquipmentListViewAdapter.notifyDataSetChanged();
            }
        });

        dialogBuilder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                Log.d("Dialog","Negative button: " + i);
                tempTradingEquipment.clear();
            }
        });



        AlertDialog dialog = dialogBuilder.create();
        dialog.show();
    }

    private void fetchTradingEquipments() {
        final ProgressBar progressBar = PortfolioDetailActivity.this.findViewById(R.id.progressBar);
        progressBar.setVisibility(View.VISIBLE);

        RequestQueue requestQueue = Volley.newRequestQueue(PortfolioDetailActivity.this);
        String url = Constants.LOCALHOST + Constants.STOCK;
        StringRequest request = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONArray responseArray = new JSONArray(response);
                    for(int i = 0; i<responseArray.length(); i++) {
                        JSONObject object = responseArray.getJSONObject(i);
                        String id = object.getString("_id");
                        String stockName = object.getString("stockName");
                        double price = object.getDouble("price");
                        String symbol = object.getString("stockSymbol");
                        Log.d("Response","stockName: " + stockName);
                        tradingEquipmentOptions.add(new TradingEquipment(id,stockName,price,symbol));
                    }

                    progressBar.setVisibility(View.INVISIBLE);
                    showListDialog();
                    addTradingEquipment.setClickable(true);

                } catch (JSONException exp) {
                    exp.printStackTrace();
                }

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }
        });

        requestQueue.add(request);

    }
}
