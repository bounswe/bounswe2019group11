package com.papel.ui.profile;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.viewpager.widget.ViewPager;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.Switch;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.tabs.TabLayout;
import com.papel.Constants;
import com.papel.R;
import com.papel.data.Article;
import com.papel.data.Portfolio;
import com.papel.data.User;
import com.papel.ui.utils.ResponseParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class ProfileActivity extends AppCompatActivity implements ProfileSubpageFragment.OnFragmentInteractionListener {
    private String userId;

    private ArrayList<Article> articles = new ArrayList<>();
    private ArrayList<Portfolio> portfolios = new ArrayList<>();

    private ProfileSubpageAdapter adapter;

    private TextView userName;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        Intent intent = getIntent();
        userId = intent.getStringExtra("UserId");

        userName = findViewById(R.id.username);

        ViewPager pager;
        TabLayout tabLayout;

        adapter = new ProfileSubpageAdapter(getSupportFragmentManager());
        pager = findViewById(R.id.pager);
        tabLayout = findViewById(R.id.tabLayout);

        pager.setAdapter(adapter);
        tabLayout.setupWithViewPager(pager);

        try {
            // TODO Test HERE
            ActionBar actionBar = getSupportActionBar();
            actionBar.setHomeButtonEnabled(true);
            actionBar.setDisplayHomeAsUpEnabled(true);
        } catch (NullPointerException exp) {
            exp.printStackTrace();
        }

        fetchProfile();



        /*TextView userName = findViewById(R.id.username);
        TextView userEmail = findViewById(R.id.usermail);

        String fullName = user.getName() + " " + user.getSurname();
        userName.setText(fullName);
        userEmail.setText(user.getEmail());


        followButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(following) {
                    followButton.setBackground(getDrawable(R.drawable.follow_button));
                    followButton.setTextColor(getResources().getColor(R.color.colorPrimary));
                    followButton.setText(getString(R.string.follow_button_text));
                    following = false;
                } else {
                    followButton.setBackground(getDrawable(R.drawable.following_button));
                    followButton.setTextColor(getResources().getColor(R.color.white));
                    followButton.setText(getString(R.string.following_button_text));
                    following = true;
                }
            }
        }); */

    }

    private void fetchProfile() {
        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String url = Constants.LOCALHOST + Constants.PROFILE + userId;

        StringRequest request = new StringRequest(Request.Method.GET, url,new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject responseJSON = new JSONObject(response);
                    String privacy = responseJSON.getString("privacy");
                    String name = responseJSON.getString("name");
                    String surname = responseJSON.getString("surname");
                    JSONArray articleArray = responseJSON.getJSONArray("articles");
                    for(int i = 0; i<articleArray.length(); i++) {
                        articles.add(ResponseParser.parseArticle(articleArray.getJSONObject(i)));
                    }
                    JSONArray portfolioArray = responseJSON.getJSONArray("portfolios");
                    for(int i = 0;i<portfolioArray.length(); i++) {
                        portfolios.add(ResponseParser.parsePortfolio(portfolioArray.getJSONObject(i)));
                    }

                    updateUI(privacy,name,surname);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }
        });

        requestQueue.add(request);
    }


    private void updateUI(String privacy, String name, String surname) {
        userName.setText(name + " " + surname);
    }

    @Override
    public void onFragmentInteraction(Uri uri) {

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
}
