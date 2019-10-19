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

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.HurlStack;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.papel.Constants;
import com.papel.R;
import com.papel.data.Portfolio;
import com.papel.data.TradingEquipment;
import com.papel.ui.utils.CustomHurlStack;
import com.papel.ui.utils.ResponseParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class PortfolioDetailActivity extends AppCompatActivity {

    private ArrayList<TradingEquipment> tradingEquipments = new ArrayList<>();
    private TradingEquipmentListViewAdapter tradingEquipmentListViewAdapter;
    private ArrayList<TradingEquipment> tradingEquipmentOptions = new ArrayList<>();
    private ArrayList<TradingEquipment> tempTradingEquipment = new ArrayList<>();

    private Portfolio portfolio;

    private FloatingActionButton addTradingEquipmentButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_portfolio_detail);

        final Intent intent = getIntent();
        portfolio = intent.getParcelableExtra("Portfolio");
        setTitle(portfolio.getName());

        try {
            // TODO Test HERE
            ActionBar actionBar = getSupportActionBar();
            actionBar.setHomeButtonEnabled(true);
            actionBar.setDisplayHomeAsUpEnabled(true);
        } catch (NullPointerException exp) {
            exp.printStackTrace();
        }

        ListView tradingEquipmentListView = findViewById(R.id.trading_equipment_list);
        addTradingEquipmentButton = findViewById(R.id.add_trading_equipment);

        tradingEquipments = portfolio.getTradingEquipments();


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

        addTradingEquipmentButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                addTradingEquipmentButton.setClickable(false);
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
                    tempTradingEquipment.remove(selected);
                }
            }
        });

        dialogBuilder.setPositiveButton("Ok", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                Log.d("Dialog","Positive button is clicked");

                for (int j=0;j<tradingEquipmentOptions.size();j++) {
                    TradingEquipment current = tradingEquipmentOptions.get(j);
                    int temp = tempTradingEquipment.indexOf(current);
                    int orig = tradingEquipments.indexOf(current);
                    if (temp == -1 && orig != -1) { // Not in temp but in origin
                        Log.d("Dialog","Delete " + current.getSymbol());
                        deleteTradingEquipment(current);
                    }
                    if (temp != -1 && orig == -1) { // in temp but not in orig
                        Log.d("Dialog","Add " + current.getSymbol());
                        addTradingEquipment(current);
                    }
                }

                //tradingEquipments.clear();
                //tradingEquipments.addAll(tempTradingEquipment);
                tempTradingEquipment.clear();
                //tradingEquipmentListViewAdapter.notifyDataSetChanged();
            }
        });

        dialogBuilder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                Log.d("Dialog","Negative button is clicked");
                tempTradingEquipment.clear();
            }
        });



        AlertDialog dialog = dialogBuilder.create();
        dialog.show();
    }

    private void addTradingEquipment(final TradingEquipment tradingEquipment) {
        RequestQueue requestQueue = Volley.newRequestQueue(PortfolioDetailActivity.this);
        String url = Constants.LOCALHOST + Constants.PORTFOLIO + portfolio.getId() + "/"+ Constants.STOCK;
        final JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("_id", tradingEquipment.getId());
            jsonBody.put("name",tradingEquipment.getName());
            jsonBody.put("price",tradingEquipment.getPrice());
            jsonBody.put("stockSymbol",tradingEquipment.getSymbol());
            jsonBody.put("stockName",tradingEquipment.getStockName());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        StringRequest request = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject jsonResponse = new JSONObject(response);
                    Portfolio parsedPortfolio = ResponseParser.parsePortfolio(jsonResponse);
                    if(parsedPortfolio != null) {
                        portfolio = parsedPortfolio;
                        tradingEquipments.clear();
                        tradingEquipments.addAll(portfolio.getTradingEquipments());
                        tradingEquipmentListViewAdapter.notifyDataSetChanged();
                    }
                }catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                // TODO handle error
            }
        }){
            @Override
            public byte[] getBody() throws AuthFailureError {
                return jsonBody.toString().getBytes();
            }

            @Override
            public String getBodyContentType() {
                return "application/json";
            }
        };
        requestQueue.add(request);
    }

    private void deleteTradingEquipment(TradingEquipment tradingEquipment) {
        CustomHurlStack customHurlStack = new CustomHurlStack();
        RequestQueue requestQueue = Volley.newRequestQueue(PortfolioDetailActivity.this,customHurlStack);
        String url = Constants.LOCALHOST + Constants.PORTFOLIO + portfolio.getId() + "/"+ Constants.STOCK;
        final JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("_id", tradingEquipment.getId());
            Log.d("Delete",tradingEquipment.getId());
            jsonBody.put("name",tradingEquipment.getName());
            Log.d("Delete",tradingEquipment.getName());
            jsonBody.put("price",tradingEquipment.getPrice());
            Log.d("Delete",""+tradingEquipment.getPrice());
            jsonBody.put("stockSymbol",tradingEquipment.getSymbol());
            Log.d("Delete",tradingEquipment.getSymbol());
            jsonBody.put("stockName",tradingEquipment.getStockName());
            Log.d("Delete",tradingEquipment.getStockName());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        StringRequest request = new StringRequest(Request.Method.DELETE, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject jsonResponse = new JSONObject(response);
                    Portfolio parsedPortfolio = ResponseParser.parsePortfolio(jsonResponse);
                    if(parsedPortfolio != null) {
                        portfolio = parsedPortfolio;
                        tradingEquipments.clear();
                        tradingEquipments.addAll(portfolio.getTradingEquipments());
                        tradingEquipmentListViewAdapter.notifyDataSetChanged();
                    }
                }catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                // TODO handle error
                NetworkResponse networkResponse = error.networkResponse;
                if (networkResponse != null) {
                    Log.d("Network response","statusCode: " + networkResponse.statusCode);
                    String errorData = new String(networkResponse.data);
                    Log.d("Network response","data: " + errorData);
                }
            }
        }){
            @Override
            public byte[] getBody() throws AuthFailureError {
                return jsonBody.toString().getBytes();
            }

            @Override
            public String getBodyContentType() {
                return "application/json";
            }

        };
        requestQueue.add(request);
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
                    tradingEquipmentOptions.clear();
                    for(int i = 0; i<responseArray.length(); i++) {
                        JSONObject object = responseArray.getJSONObject(i);
                        String id = object.getString("_id");
                        String name = object.getString("name");
                        String stockName = object.getString("stockName");
                        double price = object.getDouble("price");
                        String symbol = object.getString("stockSymbol");
                        Log.d("Response","stockName: " + stockName);
                        tradingEquipmentOptions.add(new TradingEquipment(id,name,price,symbol,stockName));
                    }

                    progressBar.setVisibility(View.INVISIBLE);
                    showListDialog();
                    addTradingEquipmentButton.setClickable(true);

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
