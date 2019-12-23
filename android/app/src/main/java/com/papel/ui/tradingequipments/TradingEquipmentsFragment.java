package com.papel.ui.tradingequipments;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.view.ContextMenu;
import android.view.LayoutInflater;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.SearchView;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ToggleButton;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.papel.Constants;
import com.papel.R;
import com.papel.data.Comment;
import com.papel.data.Currency;
import com.papel.data.Stock;
import com.papel.data.TradingEquipment;
import com.papel.data.User;
import com.papel.ui.portfolio.PortfolioDetailActivity;
import com.papel.ui.portfolio.TradingEquipmentDetailActivity;
import com.papel.ui.portfolio.TradingEquipmentListViewAdapter;
import com.papel.ui.utils.DialogHelper;
import com.papel.ui.utils.ResponseParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

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
        adapter = new TradingEquipmentListViewAdapter(getContext(), tradingEquipmentArrayList,true);
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

        registerForContextMenu(tradingEquipmentListView);

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

    @Override
    public void onCreateContextMenu(ContextMenu menu, View v, ContextMenu.ContextMenuInfo menuInfo) {
        super.onCreateContextMenu(menu, v, menuInfo);
        AdapterView.AdapterContextMenuInfo info = (AdapterView.AdapterContextMenuInfo) menuInfo;
        if (v.getId() == R.id.trading_eq_listview) {
            MenuInflater inflater = getActivity().getMenuInflater();
            inflater.inflate(R.menu.alert_menu, menu);
        }
    }

    @Override
    public boolean onContextItemSelected(MenuItem item) {
        AdapterView.AdapterContextMenuInfo info = (AdapterView.AdapterContextMenuInfo) item.getMenuInfo();
        final TradingEquipment c = (TradingEquipment) tradingEquipmentArrayList.get(info.position);
        if (item.getItemId() == R.id.set_alert) {
            LayoutInflater li = LayoutInflater.from(getContext());
            View promptsView = li.inflate(R.layout.edit_comment_prompt, null);
            AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(getContext());
            alertDialogBuilder.setView(promptsView);
            alertDialogBuilder.setTitle("Set Alarm");
            final EditText userInput = (EditText) promptsView.findViewById(R.id.editTextDialogUserInput);
            final TextView title = (TextView) promptsView.findViewById(R.id.textView1);
            final ToggleButton directionToggle = (ToggleButton) promptsView.findViewById(R.id.direction_toggleButton);
            directionToggle.setVisibility(View.VISIBLE);
            title.setText("Send me an alarm when the rate is");
            userInput.setHint("Value");
            alertDialogBuilder
                    .setCancelable(true)
                    .setPositiveButton("OK",
                            new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int id) {
                                    setAlert(getContext(), Double.parseDouble(userInput.getText().toString().trim()), directionToggle.isChecked(),c);
                                }
                            })
                    .setNegativeButton("Cancel",
                            new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int id) {
                                    dialog.cancel();
                                }
                            });

            AlertDialog alertDialog = alertDialogBuilder.create();
            alertDialog.show();
            return true;
        }
        return false;
    }

    public static void setAlert(final Context context, Double value, boolean isUp, TradingEquipment te){
        RequestQueue requestQueue = Volley.newRequestQueue(context);
        String requestUrl = Constants.LOCALHOST;
        if(te instanceof Currency){
            requestUrl += Constants.CURRENCY + ((Currency) te).getCode() + "/" + Constants.ALERT;
        }else if (te instanceof Stock){
            requestUrl += Constants.STOCK + ((Stock) te).getId() + "/" + Constants.ALERT;
        }
        final JSONObject jsonBody = new JSONObject();
        try {
            if(isUp){
                jsonBody.put("direction", 1);
            }else{
                jsonBody.put("direction", -1);
            }
            jsonBody.put("rate", value);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        StringRequest request = new StringRequest(Request.Method.POST, requestUrl, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Toast.makeText(context, "Alarm set", Toast.LENGTH_SHORT).show();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                NetworkResponse networkResponse = error.networkResponse;
                if (networkResponse != null) {
                    String data = new String(networkResponse.data);
                    try {
                        JSONObject errorObject = new JSONObject(data);
                        String message = errorObject.getString("message");
                        Toast.makeText(context, "There was an error when setting alarm: " + message, Toast.LENGTH_LONG).show();
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        }) {
            @Override
            public byte[] getBody() throws AuthFailureError {
                return jsonBody.toString().getBytes();
            }

            @Override
            public String getBodyContentType() {
                return "application/json; charset=utf-8";
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

}