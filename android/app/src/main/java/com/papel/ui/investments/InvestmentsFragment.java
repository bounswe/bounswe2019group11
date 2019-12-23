package com.papel.ui.investments;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.SearchView;

import androidx.annotation.NonNull;
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
import com.papel.data.Investment;
import com.papel.data.User;
import com.papel.data.UserInvestments;
import com.papel.ui.utils.DialogHelper;
import com.papel.ui.utils.ResponseParser;

import org.json.JSONArray;
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
                startActivity(intent);
            }
        });

        return root;
    }

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
                    investmentsAdapter.notifyDataSetChanged();
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

    private void fetchInvestments(Context context){
        String url = Constants.LOCALHOST + Constants.INVESTMENTS + Constants.USER + User.getInstance().getId();
        RequestQueue requestQueue = Volley.newRequestQueue(context);
        StringRequest request = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONArray responseArray = new JSONArray(response);
                    JSONObject jsonResponse = responseArray.getJSONObject(0);
                    UserInvestments userInvestments = ResponseParser.parseInvestment(jsonResponse);
                    investments.addAll(userInvestments.getInvestments());
                    investmentsAdapter.notifyDataSetChanged();
                }catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                DialogHelper.showBasicDialog(getContext(),"Error","We couldn't load investments.Please try again.",null);
            }
        }){

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