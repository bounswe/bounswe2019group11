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
import android.widget.RelativeLayout;
import android.widget.Toast;

import com.abdeveloper.library.MultiSelectDialog;
import com.abdeveloper.library.MultiSelectModel;
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
import com.papel.ui.utils.DialogHelper;
import com.papel.ui.utils.ResponseParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class PortfolioDetailActivity extends AppCompatActivity {

    private ArrayList<TradingEquipment> tradingEquipments = new ArrayList<>();
    private TradingEquipmentListViewAdapter tradingEquipmentListViewAdapter;
    private ArrayList<TradingEquipment> tradingEquipmentOptions = new ArrayList<>();

    private Portfolio portfolio;

    private FloatingActionButton addTradingEquipmentButton;

    private ListView tradingEquipmentListView;
    private ProgressBar progressBar;

    private RequestQueue deleteRequestQueue;
    private RequestQueue addRequestQueue;

    private int requestNumber = 0;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_portfolio_detail);

        final Intent intent = getIntent();
        portfolio = intent.getParcelableExtra("Portfolio");

        tradingEquipmentListView = findViewById(R.id.trading_equipment_list);
        addTradingEquipmentButton = findViewById(R.id.add_trading_equipment);
        progressBar = findViewById(R.id.progressBar);

        CustomHurlStack customHurlStack = new CustomHurlStack();
        deleteRequestQueue = Volley.newRequestQueue(PortfolioDetailActivity.this,customHurlStack);
        addRequestQueue = Volley.newRequestQueue(PortfolioDetailActivity.this);

        fetchPortfolio();

        setTitle(portfolio.getName());
        
        try {
            // TODO Test HERE
            ActionBar actionBar = getSupportActionBar();
            actionBar.setHomeButtonEnabled(true);
            actionBar.setDisplayHomeAsUpEnabled(true);
        } catch (NullPointerException exp) {
            exp.printStackTrace();
        }


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
        ArrayList<MultiSelectModel> tradingEquipmentList = new ArrayList<>();
        for(int i = 0; i<tradingEquipmentOptions.size(); i++) {
            tradingEquipmentList.add(new MultiSelectModel(i,tradingEquipmentOptions.get(i).getSymbol()));
        }

        final ArrayList<Integer> selectedTradingEquipments = new ArrayList<>();
        final ArrayList<Integer> initialSelectedTradingEquipments = new ArrayList<>();

        for(int i = 0; i<tradingEquipmentOptions.size(); i++) {
            for (int j = 0; j<tradingEquipments.size(); j++) {
                if (tradingEquipmentOptions.get(i).getId().equals(tradingEquipments.get(j).getId())) {
                    selectedTradingEquipments.add(i);
                    initialSelectedTradingEquipments.add(i);
                }
            }
        }

        MultiSelectDialog multiSelectDialog = new MultiSelectDialog()
                .title("Select trading equipments") //setting title for dialog
                .titleSize(18)
                .positiveText("Ok")
                .setMinSelectionLimit(0)
                .negativeText("Cancel")
                .preSelectIDsList(selectedTradingEquipments) //List of ids that you need to be selected
                .multiSelectList(tradingEquipmentList) // the multi select model list with ids and name
                .onSubmit(new MultiSelectDialog.SubmitCallbackListener() {
                    @Override
                    public void onSelected(ArrayList<Integer> selectedIds, ArrayList<String> selectedNames, String dataString) {
                        //will return list of selected IDS
                        for (int i=0;i<tradingEquipmentOptions.size();i++) {
                            TradingEquipment current = tradingEquipmentOptions.get(i);
                            int beforeSelected = initialSelectedTradingEquipments.indexOf(i);
                            int currentSelected = selectedIds.indexOf(i);
                            if(beforeSelected != -1 && currentSelected == -1) {
                                // The current item was in the list, but it is not in the list right now
                                Log.d("Dialog","Delete " + current.getSymbol());
                                deleteTradingEquipment(current);
                            }
                            if (beforeSelected == -1 && currentSelected != -1) {
                                // The current item wasn't in the list, but it is in the list right now
                                Log.d("Dialog","Add " + current.getSymbol());
                                addTradingEquipment(current);
                            }
                        }
                    }

                    @Override
                    public void onCancel() {
                        Log.d("Info","Dialog cancelled");
                    }


                });

        multiSelectDialog.show(getSupportFragmentManager(), "multiSelectDialog");

    }

    private void addTradingEquipment(final TradingEquipment tradingEquipment) {
        requestNumber += 1;
        hideUI();
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
                    requestNumber -= 1;
                    if (requestNumber == 0) {
                       showUI();
                    }
                }catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                DialogHelper.showBasicDialog(PortfolioDetailActivity.this,"Error","We couldn't add trading equipment to your porfolio.Please try again.",null);
                requestNumber -= 1;
                if (requestNumber == 0) {
                    showUI();
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
        addRequestQueue.add(request);
    }

    private void deleteTradingEquipment(TradingEquipment tradingEquipment) {
        requestNumber += 1;
        hideUI();
        Log.d("Delete","seq num " + deleteRequestQueue.getSequenceNumber());
        String url = Constants.LOCALHOST + Constants.PORTFOLIO + portfolio.getId() + "/"+ Constants.STOCK;
        final JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("_id", tradingEquipment.getId());
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
                    requestNumber -= 1;
                    if (requestNumber == 0) {
                        showUI();
                    }
                }catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("Delete","Error");
                NetworkResponse networkResponse = error.networkResponse;
                if (networkResponse != null) {
                    Log.d("Network response","statusCode: " + networkResponse.statusCode);
                    String errorData = new String(networkResponse.data);
                    Log.d("Network response","data: " + errorData);
                }
                DialogHelper.showBasicDialog(PortfolioDetailActivity.this,"Error","We couldn't delete trading equipment from your porfolio.Please try again.",null);
                requestNumber -= 1;
                if (requestNumber == 0) {
                    showUI();
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
        deleteRequestQueue.add(request);
    }

    private void hideUI() {
        tradingEquipmentListView.setVisibility(View.INVISIBLE);
        progressBar.setVisibility(View.VISIBLE);
        addTradingEquipmentButton.setClickable(false);
    }

    private void showUI() {
        tradingEquipmentListView.setVisibility(View.VISIBLE);
        progressBar.setVisibility(View.INVISIBLE);
        addTradingEquipmentButton.setClickable(true);
    }

    private void fetchPortfolio() {

        hideUI();

        RequestQueue requestQueue = Volley.newRequestQueue(PortfolioDetailActivity.this);
        String url = Constants.LOCALHOST + Constants.PORTFOLIO + portfolio.getId();
        StringRequest request = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject responseObject = new JSONObject(response);
                    Portfolio parsedPortfolio = ResponseParser.parsePortfolio(responseObject);
                    if (parsedPortfolio != null) {
                        portfolio = parsedPortfolio;
                        tradingEquipments.clear();
                        tradingEquipments.addAll(portfolio.getTradingEquipments());
                        tradingEquipmentListViewAdapter.notifyDataSetChanged();
                    }
                   showUI();

                } catch (JSONException exp) {
                    exp.printStackTrace();
                }

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                DialogHelper.showBasicDialog(PortfolioDetailActivity.this,"Error","We couldn't get detail of your porfolio.Please try again.",null);
                showUI();
            }
        });
        requestQueue.add(request);
    }

    private void fetchTradingEquipments() {
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
                DialogHelper.showBasicDialog(PortfolioDetailActivity.this,"Error","We couldn't get trading equipments.Please try again.",null);
                progressBar.setVisibility(View.INVISIBLE);
                addTradingEquipmentButton.setClickable(true);
            }
        });

        requestQueue.add(request);

    }
}
