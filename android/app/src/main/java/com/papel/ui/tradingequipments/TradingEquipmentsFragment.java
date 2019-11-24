package com.papel.ui.tradingequipments;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.SearchView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.papel.Constants;
import com.papel.R;
import com.papel.data.Currency;
import com.papel.data.Stock;
import com.papel.data.TradingEquipment;
import com.papel.ui.portfolio.PortfolioDetailActivity;
import com.papel.ui.portfolio.TradingEquipmentDetailActivity;
import com.papel.ui.portfolio.TradingEquipmentListViewAdapter;
import com.papel.ui.utils.DialogHelper;
import com.papel.ui.utils.ResponseParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class TradingEquipmentsFragment extends Fragment {

    private ListView tradingEquipmentListView;
    private ArrayList<TradingEquipment> tradingEquipmentArrayList = new ArrayList<>();
    private TradingEquipmentListViewAdapter adapter;
    private SearchView searchView;
    private int numberOfTradingEquipmentRequest = 0;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_trading_equipments, container, false);

        searchView = root.findViewById(R.id.trading_eq_searchView);
        tradingEquipmentListView = root.findViewById(R.id.trading_eq_listview);
        adapter = new TradingEquipmentListViewAdapter(getContext(), tradingEquipmentArrayList);
        tradingEquipmentListView.setAdapter(adapter);
        getTradingEquipmentsFromEndpoint(getContext());

        tradingEquipmentListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                TradingEquipment clicked = adapter.getItem(i);
                Intent intent = new Intent(getContext(), TradingEquipmentDetailActivity.class);
                intent.putExtra("TradingEquipment", clicked);
                startActivity(intent);
            }
        });

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

        return root;
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