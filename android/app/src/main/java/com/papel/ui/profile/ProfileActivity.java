package com.papel.ui.profile;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.viewpager.widget.ViewPager;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
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
import com.papel.ui.utils.DialogHelper;
import com.papel.ui.utils.ResponseParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class ProfileActivity extends AppCompatActivity implements ProfileSubpageFragment.OnFragmentInteractionListener {
    private String userId;
    private boolean isMe = true; // TODO delete here!
    private boolean isPrivate;
    private String isInMyNetwork;

    private ArrayList<Article> articles = new ArrayList<>();
    private ArrayList<Portfolio> portfolios = new ArrayList<>();

    private ArrayList<User> following = new ArrayList<>();
    private ArrayList<User> followers = new ArrayList<>();

    private ArrayList<User> followingPending = new ArrayList<>();
    private ArrayList<User> followersPending = new ArrayList<>();

    private ProfileSubpageAdapter adapter;
    private ViewPager pager;
    private TabLayout tabLayout;

    private TextView userName;
    private Button followButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        Intent intent = getIntent();
        userId = intent.getStringExtra("UserId");
        Log.d("Info", "Profile userid: " + userId);

        userName = findViewById(R.id.username);
        followButton = findViewById(R.id.followButton);

        pager = findViewById(R.id.pager);
        tabLayout = findViewById(R.id.tabLayout);

        try {
            // TODO Test HERE
            ActionBar actionBar = getSupportActionBar();
            actionBar.setHomeButtonEnabled(true);
            actionBar.setDisplayHomeAsUpEnabled(true);
        } catch (NullPointerException exp) {
            exp.printStackTrace();
        }

        fetchProfile();

        followButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (isInMyNetwork.equals("true")) {
                    // I am following this user
                    sendFollowRequest(false);
                } else if (isInMyNetwork.equals("false")) {
                    // I am not following this user
                    sendFollowRequest(true);
                } else if (isInMyNetwork.equals("pending")) {
                    // I send request to the user and I am waiting
                }
            }
        });
    }

    private void sendFollowRequest(final boolean follow) {
        // Send follow request if follow is true, and send unfollow request if follow is false
        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String url = "";
        if (follow) {
            url = Constants.LOCALHOST + Constants.PROFILE + userId + "/" + Constants.FOLLOW;
        } else {
            url = Constants.LOCALHOST + Constants.PROFILE + userId + "/" + Constants.UNFOLLOW;
        }
        StringRequest request = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject responseObject = new JSONObject(response);
                    String msg = responseObject.getString("msg");
                    String status = responseObject.getString("status");
                    Toast.makeText(ProfileActivity.this,msg,Toast.LENGTH_LONG).show();
                    if(follow) {
                        if (status.equals("request")) {
                            showPendingButton();
                        } else if (status.equals("follow")) {
                            showFollowingButton();
                        }
                    } else {
                        showFollowButton();
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                NetworkResponse networkResponse = error.networkResponse;

                if (networkResponse != null) {
                    String data = new String(networkResponse.data);
                    Log.d("Info","Data: " + data);
                    try {
                        JSONObject errorObject = new JSONObject(data);
                        String message = errorObject.getString("message");
                        Toast.makeText(ProfileActivity.this,message, Toast.LENGTH_LONG).show();
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
                //DialogHelper.showBasicDialog(ProfileActivity.this, "Error", "We couldn't send your request.Please try again!", null);
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

    private void fetchProfile() {
        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String url = Constants.LOCALHOST + Constants.PROFILE + userId;

        StringRequest request = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject responseJSON = new JSONObject(response);
                    String privacy = responseJSON.getString("privacy");
                    if (privacy.equals("private")) {
                        isPrivate = true;
                    } else {
                        isPrivate = false;
                    }
                    String name = responseJSON.getString("name");
                    String surname = responseJSON.getString("surname");
                    JSONArray articleArray = responseJSON.getJSONArray("articles");
                    for (int i = 0; i < articleArray.length(); i++) {
                        articles.add(ResponseParser.parseArticle(articleArray.getJSONObject(i)));
                    }
                    JSONArray portfolioArray = responseJSON.getJSONArray("portfolios");
                    for (int i = 0; i < portfolioArray.length(); i++) {
                        portfolios.add(ResponseParser.parsePortfolio(portfolioArray.getJSONObject(i)));
                    }
                    if (responseJSON.has("isInMyNetwork")) {
                        isInMyNetwork = responseJSON.getString("isInMyNetwork");
                    }
                    isMe = responseJSON.getBoolean("isMe");
                    if (isMe) {
                        // Get request list
                        JSONArray followingPendingArray = responseJSON.getJSONArray("followingPending");
                        for (int i = 0; i < followingPendingArray.length(); i++) {
                            User user = ResponseParser.parseFollowUser(followingPendingArray.getJSONObject(i));
                            if (user != null) {
                                followingPending.add(user);
                            }
                        }
                        JSONArray followersPendingArray = responseJSON.getJSONArray("followerPending");
                        for (int i = 0; i < followersPendingArray.length(); i++) {
                            User user = ResponseParser.parseFollowUser(followersPendingArray.getJSONObject(i));
                            if (user != null) {
                                followersPending.add(user);
                            }
                        }

                    }
                    JSONArray followingArray = responseJSON.getJSONArray("following");
                    for (int i = 0; i < followingArray.length(); i++) {
                        User user = ResponseParser.parseFollowUser(followingArray.getJSONObject(i));
                        if (user != null) {
                            following.add(user);
                        }
                    }

                    JSONArray followersArray = responseJSON.getJSONArray("followers");
                    for (int i = 0; i < followersArray.length(); i++) {
                        User user = ResponseParser.parseFollowUser(followersArray.getJSONObject(i));
                        if (user != null) {
                            Log.d("Info","Follower " + user.getName());
                            followers.add(user);
                        }
                    }

                    Log.d("Info", "Privacy: " + privacy);

                    updateUI(privacy, name, surname);

                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

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


    private void updateUI(String privacy, String name, String surname) {
        userName.setText(name + " " + surname);
        userName.setVisibility(View.VISIBLE);
        if (!isMe) {
            // Looking other's profile
            followButton.setVisibility(View.VISIBLE);

            // We can't see the pending request of the other user
            followersPending = null;
            followingPending = null;

            if (privacy.equals("private")) {
                // Other's private profile
                portfolios = null;
                followers = null;
                following = null;
            }

            if (isInMyNetwork.equals("true")) {
                // I am following this user
                showFollowingButton();
            } else if (isInMyNetwork.equals("false")) {
                // I am not following this user
                showFollowButton();
            } else if (isInMyNetwork.equals("pending")) {
                // I send request to the user and I am waiting
                showPendingButton();
            }
        }
        adapter = new ProfileSubpageAdapter(getSupportFragmentManager(), articles, portfolios, followers, following, followersPending, followingPending, isMe);
        pager.setAdapter(adapter);
        tabLayout.setupWithViewPager(pager);
        tabLayout.setTabMode(TabLayout.MODE_SCROLLABLE);

        //adapter.notifyDataSetChanged();
    }

    private void showFollowButton() {
        followButton.setBackground(getDrawable(R.drawable.follow_button));
        followButton.setTextColor(getResources().getColor(R.color.colorPrimary));
        followButton.setText(getString(R.string.follow_button_text));
    }

    private void showFollowingButton() {
        followButton.setBackground(getDrawable(R.drawable.following_button));
        followButton.setTextColor(getResources().getColor(R.color.white));
        followButton.setText(getString(R.string.following_button_text));
    }

    private void showPendingButton() {
        followButton.setBackground(getDrawable(R.drawable.following_button));
        followButton.setTextColor(getResources().getColor(R.color.white));
        followButton.setText(getString(R.string.pending_follow_button_text));
    }

    @Override
    public void onFragmentInteraction(Uri uri) {

    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater menuInflater = getMenuInflater();
        menuInflater.inflate(R.menu.main, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            //this.finish();
            onBackPressed();
            return true;
        } else if (item.getItemId() == R.id.action_settings) {
            // Show settings activity
            if (isMe) {
                Intent settingsIntent = new Intent(ProfileActivity.this, ProfileSettingsActivity.class);
                settingsIntent.putExtra("UserId", userId);
                settingsIntent.putExtra("IsPrivate", isPrivate);
                startActivity(settingsIntent);
            }
        }
        return super.onOptionsItemSelected(item);
    }
}
