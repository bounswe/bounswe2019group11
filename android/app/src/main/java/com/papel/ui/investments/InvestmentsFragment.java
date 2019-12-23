package com.papel.ui.investments;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.text.InputType;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.SearchView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.papel.Constants;
import com.papel.R;
import com.papel.SellButtonListener;
import com.papel.data.Currency;
import com.papel.data.Investment;
import com.papel.data.Stock;
import com.papel.data.User;
import com.papel.data.UserInvestments;
import com.papel.ui.utils.DialogHelper;
import com.papel.ui.utils.ResponseParser;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class InvestmentsFragment extends Fragment {

    private ArrayList<Investment> investments = new ArrayList<>();
    private InvestmentListViewAdapter investmentsAdapter;
    private FloatingActionButton addInvestment;
    private ProgressBar progressBar;
    private ListView investmentsListView;
    private SearchView searchView;
    private UserInvestments userInvestments;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_investments, container, false);

        searchView = root.findViewById(R.id.inv_searchView);
        investmentsListView = root.findViewById(R.id.investment_list);
        addInvestment = root.findViewById(R.id.add_investment);
        progressBar = root.findViewById(R.id.investmentProgressBar);
        progressBar.setVisibility(View.INVISIBLE);

        investmentsAdapter = new InvestmentListViewAdapter(container.getContext(), investments, true);
        investmentsListView.setAdapter(investmentsAdapter);
        investmentsAdapter.notifyDataSetChanged();


        investmentsAdapter.setSellButtonListener(new SellButtonListener() {
            @Override
            public void onSellButtonListener(final Investment item) {

                AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(getContext());
                alertDialogBuilder.setTitle("Sell trading equipment");
                alertDialogBuilder.setMessage("Write the amount");
                final EditText amountEditText = new EditText(getContext());
                amountEditText.setInputType(InputType.TYPE_CLASS_NUMBER);
                alertDialogBuilder.setView(amountEditText);
                alertDialogBuilder.setPositiveButton("Sell", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        String sellAmount = amountEditText.getText().toString();
                        if (item.getEquipment() instanceof Currency) {
                            Log.d("Info", "Sell currency.Amount: " + sellAmount);
                            sellCurrency(getContext(), (Currency) item.getEquipment(), sellAmount);
                        } else if (item.getEquipment() instanceof Stock) {
                            Log.d("Info", "Sell stock.Amount: " + sellAmount);
                            sellStock(getContext(), (Stock) item.getEquipment(), sellAmount);
                        }
                    }
                });
                AlertDialog alertDialog = alertDialogBuilder.create();
                alertDialog.show();

            }
        });

        fetchInvestments(getContext());

        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String s) {
                return false;
            }

            @Override
            public boolean onQueryTextChange(String s) {
                investmentsAdapter.getFilter().filter(s);
                return false;
            }
        });


        addInvestment.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(getContext(), AddInvestmentActivity.class);
                intent.putExtra("InvestmentId",userInvestments.getId());
                startActivity(intent);
            }
        });

        return root;
    }


    private void sellCurrency(Context context, Currency currency, String amount) {
        String url = Constants.LOCALHOST + Constants.INVESTMENTS + userInvestments.getId() + "/" + Constants.CURRENCY;
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
        StringRequest request = new StringRequest(Request.Method.PUT, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject jsonResponse = new JSONObject(response);
                    userInvestments = ResponseParser.parseInvestment(jsonResponse);
                    investments.clear();
                    investments.addAll(userInvestments.getInvestments());
                    investmentsAdapter.notifyDataSetChanged();
                }catch (JSONException e) {
                    e.printStackTrace();
                }

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

    private void sellStock(Context context, Stock stock, String amount) {
        String url = Constants.LOCALHOST + Constants.INVESTMENTS + userInvestments.getId() + "/" + Constants.STOCK;
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
        StringRequest request = new StringRequest(Request.Method.PUT, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject jsonResponse = new JSONObject(response);
                    userInvestments = ResponseParser.parseInvestment(jsonResponse);
                    investments.clear();
                    investments.addAll(userInvestments.getInvestments());
                    investmentsAdapter.notifyDataSetChanged();
                }catch (JSONException e) {
                    e.printStackTrace();
                }
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

    private void fetchInvestments(Context context) {
        String url = Constants.LOCALHOST + Constants.INVESTMENTS + Constants.USER + User.getInstance().getId();
        RequestQueue requestQueue = Volley.newRequestQueue(context);
        StringRequest request = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject jsonResponse = new JSONObject(response);
                    userInvestments = ResponseParser.parseInvestment(jsonResponse);
                    investments.addAll(userInvestments.getInvestments());
                    investmentsAdapter.notifyDataSetChanged();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                DialogHelper.showBasicDialog(getContext(), "Error", "We couldn't load investments.Please try again.", null);
            }
        }) {

            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> headers = new HashMap<String, String>();
                headers.put("Authorization", "Bearer " + User.getInstance().getToken());
                return headers;
            }
        };
        requestQueue.add(request);

    }
}