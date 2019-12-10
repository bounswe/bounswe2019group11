package com.papel.ui.investments;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.SearchView;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.abdeveloper.library.MultiSelectDialog;
import com.abdeveloper.library.MultiSelectModel;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.papel.Constants;
import com.papel.ListViewAdapter;
import com.papel.R;
import com.papel.data.Currency;
import com.papel.data.Investment;
import com.papel.data.Portfolio;
import com.papel.data.Stock;
import com.papel.data.TradingEquipment;
import com.papel.data.User;
import com.papel.data.UserInvestments;
import com.papel.ui.portfolio.PortfolioDetailActivity;
import com.papel.ui.portfolio.PortfolioListViewAdapter;
import com.papel.ui.portfolio.TradingEquipmentDetailActivity;
import com.papel.ui.portfolio.TradingEquipmentListViewAdapter;
import com.papel.ui.utils.DialogHelper;
import com.papel.ui.utils.ResponseParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class InvestmentsFragment extends Fragment {

    private ArrayList<Investment> investments = new ArrayList<>();
    private InvestmentListViewAdapter investmentsListViewAdapter;
    private FloatingActionButton addInvestment;
    private ProgressBar progressBar;
    private ListView investmentsListView;
    private SearchView searchView;
    private ArrayList<TradingEquipment> tradingEquipmentOptions = new ArrayList<>();
    private int numberOfTradingEquipmentRequest = 0;


    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_investments, container, false);

        Stock s = new Stock("fdjkg", "ADBE - Adobe Inc. - Common Stock", 272.7, "ADBE");
        Investment i = new Investment(s, 20.0);
        investments.add(i);
        Currency c = new Currency("dsgfhjsdk", "EUR", "European Euro", 0.91);
        Investment k = new Investment(c, 45.0);
        investments.add(k);

        searchView = root.findViewById(R.id.inv_searchView);
        investmentsListView = root.findViewById(R.id.investment_list);
        addInvestment = root.findViewById(R.id.add_investment);
        progressBar = root.findViewById(R.id.investmentProgressBar);
        progressBar.setVisibility(View.INVISIBLE);

        investmentsListViewAdapter = new InvestmentListViewAdapter(container.getContext(), investments, true);
        investmentsListView.setAdapter(investmentsListViewAdapter);
        investmentsListViewAdapter.notifyDataSetChanged();

        investmentsListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                Investment clicked = investmentsListViewAdapter.getItem(i);
                Intent intent = new Intent(getContext(), TradingEquipmentDetailActivity.class);
                intent.putExtra("TradingEquipment", clicked.getEquipment());
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
                investmentsListViewAdapter.getFilter().filter(s);
                return false;
            }
        });

        addInvestment.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d("Portfolio", "Add portfolio");
                fetchTradingEquipments(getContext());
            }
        });

        return root;
    }

    private void fetchTradingEquipments(final Context context) {
        numberOfTradingEquipmentRequest = 2;

        progressBar.setVisibility(View.VISIBLE);

        RequestQueue requestQueue = Volley.newRequestQueue(context);

        String stockUrl = Constants.LOCALHOST + Constants.STOCK;
        String currencyUrl = Constants.LOCALHOST + Constants.CURRENCY;

        tradingEquipmentOptions.clear();

        StringRequest stockRequest = new StringRequest(Request.Method.GET, stockUrl, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONArray responseArray = new JSONArray(response);
                    for(int i = 0; i<responseArray.length(); i++) {
                        JSONObject object = responseArray.getJSONObject(i);
                        tradingEquipmentOptions.add(ResponseParser.parseStock(object));
                    }

                    numberOfTradingEquipmentRequest -= 1;
                    if (numberOfTradingEquipmentRequest == 0) {
                        progressBar.setVisibility(View.INVISIBLE);
                        showListDialog(context);
                    }
                } catch (JSONException exp) {
                    exp.printStackTrace();
                }

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                numberOfTradingEquipmentRequest -= 1;
                if (numberOfTradingEquipmentRequest == 0) {
                    DialogHelper.showBasicDialog(context,"Error","We couldn't get trading equipments.Please try again.",null);
                    progressBar.setVisibility(View.INVISIBLE);
                }
            }
        });


        StringRequest currencyRequest = new StringRequest(Request.Method.GET, currencyUrl, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONArray responseArray = new JSONArray(response);
                    for(int i = 0; i<responseArray.length(); i++) {
                        JSONObject object = responseArray.getJSONObject(i);
                        tradingEquipmentOptions.add(ResponseParser.parseCurrency(object));
                    }
                    numberOfTradingEquipmentRequest -= 1;
                    if (numberOfTradingEquipmentRequest == 0) {
                        progressBar.setVisibility(View.INVISIBLE);
                        showListDialog(context);
                    }
                } catch (JSONException exp) {
                    exp.printStackTrace();
                }

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                numberOfTradingEquipmentRequest -= 1;
                if (numberOfTradingEquipmentRequest == 0) {
                    DialogHelper.showBasicDialog(context,"Error","We couldn't get trading equipments.Please try again.",null);
                    progressBar.setVisibility(View.INVISIBLE);
                }
            }
        });

        requestQueue.add(stockRequest);
        requestQueue.add(currencyRequest);

    }

    private void showListDialog(final Context context){
        AlertDialog.Builder mBuilder = new AlertDialog.Builder(context);
        View mView = getLayoutInflater().inflate(R.layout.add_investment_dialog, null);
        mBuilder.setTitle("Add Investment");
        final Spinner spinner = mView.findViewById(R.id.inv_spinner);
        final EditText edtText = mView.findViewById(R.id.amount_editText);
        TradingEquipmentListViewAdapter adapter = new TradingEquipmentListViewAdapter(context, tradingEquipmentOptions, true);
        spinner.setAdapter(adapter);
        mBuilder.setPositiveButton("Add", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                String text = edtText.getText().toString();
                double amount;
                if(!text.equals("")){
                    amount =  Double.parseDouble(text);
                    addInvestments(context, (TradingEquipment) spinner.getSelectedItem(), amount);
                    dialogInterface.dismiss();
                }else{
                    Toast.makeText(context, "Please specify the amount", Toast.LENGTH_SHORT).show();
                }
            }
        });

        mBuilder.setView(mView);
        AlertDialog dialog = mBuilder.create();
        dialog.show();
    }

    private void addInvestments(final Context context,TradingEquipment te, Double amount) {}

    private void getInvestmentsFromEndpoint(final Context context) {
        RequestQueue requestQueue = Volley.newRequestQueue(context);
        String url = Constants.LOCALHOST + Constants.INVESTMENTS;
        StringRequest request = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject object = new JSONObject(response);
                    UserInvestments inv = ResponseParser.parseInvestment(object);
                    investments = inv.getInvestments();
                    investmentsListViewAdapter.notifyDataSetChanged();
                    progressBar.setVisibility(View.INVISIBLE);
                    //addInvestment.setVisibility(View.VISIBLE);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                DialogHelper.showBasicDialog(context, "Error", "We couldn't get your investments.Please try again.", null);
                progressBar.setVisibility(View.INVISIBLE);
                //addInvestment.setVisibility(View.VISIBLE);
            }
        });

        requestQueue.add(request);
    }
}