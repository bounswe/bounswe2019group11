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
import com.papel.data.User;

import org.json.JSONException;
import org.json.JSONObject;

public class ProfileActivity extends AppCompatActivity implements ProfileSubpageFragment.OnFragmentInteractionListener {
    private String userId;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        Intent intent = getIntent();
        userId = intent.getStringExtra("UserId");

        ProfileSubpageAdapter adapter;
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
                    String name = responseJSON.getString("name");
                    Log.d("Info","Profile name: " + name);
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
