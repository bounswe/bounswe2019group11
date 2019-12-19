package com.papel.ui.investments;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.papel.Constants;
import com.papel.R;
import com.papel.data.Currency;
import com.papel.data.Investment;
import com.papel.data.Stock;
import com.papel.data.TradingEquipment;
import com.papel.ui.portfolio.TradingEquipmentDetailActivity;
import com.papel.ui.portfolio.TradingEquipmentListViewAdapter;
import com.papel.ui.utils.DialogHelper;
import com.papel.ui.utils.ResponseParser;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.SearchView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class AddInvestmentActivity extends AppCompatActivity {

    private ArrayList<TradingEquipment> tradingEquipmentArrayList = new ArrayList<>();
    private TradingEquipmentListViewAdapter adapter;
    private ListView tradingEquipmentListView;
    private SearchView searchView;
    private int numberOfTradingEquipmentRequest = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_investment);

        searchView = findViewById(R.id.inv_searchView);
        tradingEquipmentListView = findViewById(R.id.investment_list);
        adapter = new TradingEquipmentListViewAdapter(getApplicationContext(), tradingEquipmentArrayList,true);
        tradingEquipmentListView.setAdapter(adapter);
        getTradingEquipmentsFromEndpoint(getApplicationContext());

        tradingEquipmentListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                // TODO: dialog to put amount
                Toast.makeText(AddInvestmentActivity.this, "Amount", Toast.LENGTH_SHORT).show();
            }
        });

        searchView.setQueryHint(getString(R.string.search_trading_eq_hint));
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String s) {
                return false;
            }

            @Override
            public boolean onQueryTextChange(String s) {
                adapter.getFilter().filter(s);
                return false;
            }
        });


    }

    private void getTradingEquipmentsFromEndpoint(final Context context) {
        numberOfTradingEquipmentRequest = 2;
        RequestQueue requestQueue = Volley.newRequestQueue(context);

        String stockUrl = Constants.LOCALHOST + Constants.STOCK;
        String currencyUrl = Constants.LOCALHOST + Constants.CURRENCY;

        StringRequest stockRequest = new StringRequest(Request.Method.GET, stockUrl, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONArray responseArray = new JSONArray(response);
                    for (int i = 0; i < responseArray.length(); i++) {
                        JSONObject object = responseArray.getJSONObject(i);
                        Stock stock = ResponseParser.parseStock(object);
                        if (stock != null) {
                            tradingEquipmentArrayList.add(stock);
                        }
                    }
                    numberOfTradingEquipmentRequest -= 1;
                    if (numberOfTradingEquipmentRequest == 0) {
                        adapter.notifyDataSetChanged();
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                numberOfTradingEquipmentRequest -= 1;
                DialogHelper.showBasicDialog(context, "Error", "We couldn't load the trading equipments. Please try again.", null);
            }
        });

        StringRequest currencyRequest = new StringRequest(Request.Method.GET, currencyUrl, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONArray responseArray = new JSONArray(response);
                    for (int i = 0; i < responseArray.length(); i++) {
                        JSONObject object = responseArray.getJSONObject(i);
                        Currency currency = ResponseParser.parseCurrency(object);

                        if (currency != null) {
                            tradingEquipmentArrayList.add(currency);
                        }
                    }
                    numberOfTradingEquipmentRequest -= 1;
                    if (numberOfTradingEquipmentRequest == 0) {
                        adapter.notifyDataSetChanged();
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                numberOfTradingEquipmentRequest -= 1;
                DialogHelper.showBasicDialog(context, "Error", "We couldn't load the trading equipments. Please try again.", null);
            }
        });

        requestQueue.add(stockRequest);
        requestQueue.add(currencyRequest);
    }


}
