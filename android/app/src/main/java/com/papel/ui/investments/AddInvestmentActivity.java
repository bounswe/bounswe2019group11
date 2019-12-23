package com.papel.ui.investments;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.papel.Constants;
import com.papel.R;
import com.papel.data.Currency;
import com.papel.data.Portfolio;
import com.papel.data.Stock;
import com.papel.data.TradingEquipment;
import com.papel.data.User;
import com.papel.ui.portfolio.PortfolioDetailActivity;
import com.papel.ui.portfolio.TradingEquipmentListViewAdapter;
import com.papel.ui.utils.DialogHelper;
import com.papel.ui.utils.ResponseParser;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.SearchView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class AddInvestmentActivity extends AppCompatActivity {

    private ArrayList<TradingEquipment> tradingEquipmentArrayList = new ArrayList<>();
    private TradingEquipmentListViewAdapter adapter;
    private ListView tradingEquipmentListView;
    private SearchView searchView;
    private int numberOfTradingEquipmentRequest = 0;
    private RequestQueue addRequestQueue;
    private int requestNumber = 0;
    private User user = User.getInstance();
    private String investmentId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_investment);

        Intent intent = getIntent();
        investmentId = intent.getStringExtra("InvestmentId");

        addRequestQueue = Volley.newRequestQueue(getApplicationContext());

        searchView = findViewById(R.id.inv_searchView);
        tradingEquipmentListView = findViewById(R.id.investment_list);
        adapter = new TradingEquipmentListViewAdapter(getApplicationContext(), tradingEquipmentArrayList,true);
        tradingEquipmentListView.setAdapter(adapter);
        getTradingEquipmentsFromEndpoint(getApplicationContext());

        tradingEquipmentListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                showListDialog(tradingEquipmentArrayList.get(i));
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

    private void showListDialog(final TradingEquipment tradingEq){
        AlertDialog.Builder mBuilder = new AlertDialog.Builder(this);
        View mView = getLayoutInflater().inflate(R.layout.add_investment_dialog, null);

        String title, positiveButtonTitle;

        if(user.getRole().toLowerCase().equals("trader")){
            title = "Buy ";
            positiveButtonTitle = "BUY";
        }else{
            title = "Add ";
            positiveButtonTitle = "ADD";
        }

        if(tradingEq instanceof Stock){
            title += ((Stock) tradingEq).getSymbol();
        }else if(tradingEq instanceof Currency){
            title += ((Currency) tradingEq).getCode();
        }

        mBuilder.setTitle(title);
        final EditText amountEditText = mView.findViewById(R.id.amount_editText);
        mBuilder.setPositiveButton(positiveButtonTitle, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                String text = amountEditText.getText().toString();
                double amount;
                if(!text.equals("")){
                    amount =  Double.parseDouble(text);
                    //buyTradingEquipment(tradingEq, amount);
                }else{
                    Toast.makeText(AddInvestmentActivity.this, "Please specify the amount", Toast.LENGTH_SHORT).show();
                }
            }
        });

        mBuilder.setView(mView);
        AlertDialog dialog = mBuilder.create();
        dialog.show();
    }

    private void buyCurrency(Context context, Currency currency, String amount) {
        String url = Constants.LOCALHOST + Constants.INVESTMENTS + investmentId + "/" + Constants.CURRENCY;
        RequestQueue requestQueue = Volley.newRequestQueue(context);
        final JSONObject jsonBody = new JSONObject();
        JSONObject currencyBody = new JSONObject();
        try {
            currencyBody.put("_id", currency.getId());
            currencyBody.put("code", currency.getCode());
            currencyBody.put("name", currency.getName());
            currencyBody.put("rate", currency.getRate());
            jsonBody.put("currency", currencyBody);
            jsonBody.put("amount", amount);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        StringRequest request = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }
        }) {
            @Override
            public byte[] getBody() throws AuthFailureError {
                return jsonBody.toString().getBytes();
            }

            @Override
            public String getBodyContentType() {
                return "application/json";
            }

            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> headers = new HashMap<String, String>();
                headers.put("Authorization", "Bearer " + User.getInstance().getToken());
                return headers;
            }
        };
        requestQueue.add(request);
    }

    private void buyStock(Context context, Stock stock, String amount) {
        String url = Constants.LOCALHOST + Constants.INVESTMENTS + investmentId + "/" + Constants.STOCK;
        RequestQueue requestQueue = Volley.newRequestQueue(context);
        final JSONObject jsonBody = new JSONObject();
        JSONObject stockBody = new JSONObject();
        try {
            stockBody.put("_id", stock.getId());
            stockBody.put("name", stock.getName());
            stockBody.put("price", stock.getPrice());
            stockBody.put("stockSymbol", stock.getSymbol());
            jsonBody.put("stock", stockBody);
            jsonBody.put("amount", amount);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        StringRequest request = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }
        }) {
            @Override
            public byte[] getBody() throws AuthFailureError {
                return jsonBody.toString().getBytes();
            }

            @Override
            public String getBodyContentType() {
                return "application/json";
            }

            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> headers = new HashMap<String, String>();
                headers.put("Authorization", "Bearer " + User.getInstance().getToken());
                return headers;
            }
        };
        requestQueue.add(request);
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
