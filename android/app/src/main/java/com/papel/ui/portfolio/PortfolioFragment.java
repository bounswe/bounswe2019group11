package com.papel.ui.portfolio;

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
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProviders;

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
import com.papel.data.Portfolio;
import com.papel.data.TradingEquipment;
import com.papel.data.User;
import com.papel.ui.utils.DialogHelper;
import com.papel.ui.utils.ResponseParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class PortfolioFragment extends Fragment {

    private ArrayList<Portfolio> portfolios = new ArrayList<>();
    private PortfolioListViewAdapter portfolioListViewAdapter;
    private FloatingActionButton addPortfolio;
    private ProgressBar progressBar;

    private User user;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             final ViewGroup container, Bundle savedInstanceState) {

        View root = inflater.inflate(R.layout.fragment_portfolio, container, false);

        user = User.getInstance();

        ListView portfolioListView = root.findViewById(R.id.portfolio_list);

        addPortfolio = root.findViewById(R.id.add_portfolio);
        progressBar = root.findViewById(R.id.progressBar);

        fetchUserPortfolios(container.getContext());

        portfolioListViewAdapter = new PortfolioListViewAdapter(container.getContext(), portfolios);
        portfolioListView.setAdapter(portfolioListViewAdapter);

        final Intent intent = new Intent(getActivity(), PortfolioDetailActivity.class);


        portfolioListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                Log.d("Portfolio", i + " is clicked");
                Portfolio clicked = portfolioListViewAdapter.getItem(i);
                intent.putExtra("Portfolio",clicked);
                startActivity(intent);
            }
        });

        portfolioListView.setOnItemLongClickListener(new AdapterView.OnItemLongClickListener() {
            @Override
            public boolean onItemLongClick(AdapterView<?> adapterView, View view, int i, long l) {
                Log.d("Portfolio", i + " is long clicked");
                showUpdateDialog(container.getContext(), i);
                // Return true to indicate that we have consumed the event.
                return true;
            }
        });


        addPortfolio.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d("Portfolio", "Add portfolio");
                showInputDialog(container.getContext());
            }
        });

        return root;
    }

    private void fetchUserPortfolios(final Context context) {
        RequestQueue requestQueue = Volley.newRequestQueue(context);
        String url = Constants.LOCALHOST + Constants.PORTFOLIO_USER + user.getId();
        StringRequest request = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONArray responseArray = new JSONArray(response);
                    for(int i = 0;i<responseArray.length(); i++) {
                        JSONObject object = responseArray.getJSONObject(i);
                        Portfolio portfolio = ResponseParser.parsePortfolio(object);
                        if (portfolio != null) {
                            portfolios.add(portfolio);
                        }
                    }

                    portfolioListViewAdapter.notifyDataSetChanged();
                    progressBar.setVisibility(View.INVISIBLE);
                    addPortfolio.setVisibility(View.VISIBLE);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                DialogHelper.showBasicDialog(context,"Error","We couldn't get your portfolios.Please try again.",null);
                progressBar.setVisibility(View.INVISIBLE);
                addPortfolio.setVisibility(View.VISIBLE);
            }
        });

        requestQueue.add(request);

    }

    private void showUpdateDialog(Context context, final int index) {
        AlertDialog.Builder dialogBuilder = new AlertDialog.Builder(context);
        dialogBuilder.setTitle("Update portfolio");
        dialogBuilder.setMessage("Type new name of the portfolio");
        final EditText nameInput = new EditText(context);
        nameInput.setPadding(getResources().getDimensionPixelOffset(R.dimen.dialog_padding), 0,
                getResources().getDimensionPixelOffset(R.dimen.dialog_padding), 0);
        nameInput.setText(portfolioListViewAdapter.getItem(index).getName());
        dialogBuilder.setView(nameInput);
        dialogBuilder.setNeutralButton("Update", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                String portfolioName = nameInput.getText().toString();

                Log.d("Dialog", "Update button is pressed.Name: " + portfolioName);

                portfolioListViewAdapter.getItem(index).setName(portfolioName);

                portfolioListViewAdapter.notifyDataSetChanged();
            }
        });

        AlertDialog dialog = dialogBuilder.create();
        dialog.show();
    }


    private void showInputDialog(final Context context) {
        AlertDialog.Builder dialogBuilder = new AlertDialog.Builder(context);
        dialogBuilder.setTitle("Add portfolio");
        dialogBuilder.setMessage("Type name of the porfolio");
        final EditText nameInput = new EditText(context);
        nameInput.setPadding(getResources().getDimensionPixelOffset(R.dimen.dialog_padding), 0,
                getResources().getDimensionPixelOffset(R.dimen.dialog_padding), 0);
        dialogBuilder.setView(nameInput);
        dialogBuilder.setNeutralButton("Add", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                Log.d("Dialog", "Add button is pressed.Name: " + nameInput.getText().toString());

                String portfolioName = nameInput.getText().toString();
                if (portfolioName.length() > 0) {

                    progressBar.setVisibility(View.VISIBLE);
                    addPortfolio.setClickable(false);
                    createPortfolio(context,portfolioName);

                } else {
                    Toast.makeText(context, "Portfolio name cannot be empty.", Toast.LENGTH_LONG).show();
                }

            }
        });


        AlertDialog dialog = dialogBuilder.create();
        dialog.show();

    }

    private void createPortfolio(final Context context, String portfolioName) {
        RequestQueue requestQueue = Volley.newRequestQueue(context);
        final JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("name", portfolioName);
            jsonBody.put("userId", user.getId());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        String url = Constants.LOCALHOST + Constants.PORTFOLIO;
        StringRequest request = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                // It returns new portfolio
                try {
                    JSONObject responseJSON = new JSONObject(response);
                    Portfolio portfolio = ResponseParser.parsePortfolio(responseJSON);
                    if (portfolio != null) {
                        portfolios.add(portfolio);
                    }
                    portfolioListViewAdapter.notifyDataSetChanged();
                    progressBar.setVisibility(View.INVISIBLE);
                    addPortfolio.setClickable(true);
                }catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                DialogHelper.showBasicDialog(context,"Error","We couldn't create a portfolio.Please try again.",null);
                progressBar.setVisibility(View.INVISIBLE);
                addPortfolio.setClickable(true);
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
}