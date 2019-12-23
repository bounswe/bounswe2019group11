package com.papel;

import android.content.Intent;
import android.os.Bundle;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.card.MaterialCardView;

import android.util.Log;
import android.view.MenuItem;
import android.view.View;


import androidx.core.view.MenuItemCompat;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import com.google.android.material.navigation.NavigationView;
import com.papel.data.Article;
import com.papel.data.Currency;
import com.papel.data.Event;
import com.papel.data.Stock;
import com.papel.data.TradingEquipment;
import com.papel.data.User;
import com.papel.ui.articles.ReadArticleActivity;
import com.papel.ui.events.EventsFragment;
import com.papel.ui.portfolio.TradingEquipmentDetailActivity;
import com.papel.ui.profile.ProfileActivity;
import com.papel.ui.utils.DialogHelper;
import com.papel.ui.utils.ResponseParser;

import androidx.drawerlayout.widget.DrawerLayout;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.view.Menu;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.SearchView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {

    private AppBarConfiguration mAppBarConfiguration;
    ListView searchListView;
    ArrayList<Object> searchList = new ArrayList<>();
    SearchAdapter adapter;
    private SearchView searchView;
    RequestQueue requestQueue;
    ProgressBar progressBar;
    int requestNum = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        requestQueue = Volley.newRequestQueue(getApplicationContext());

        progressBar = findViewById(R.id.search_progressBar);
        progressBar.setVisibility(View.INVISIBLE);

        Intent comingIntent = getIntent();
        final User user = comingIntent.getParcelableExtra("User");

        final Intent profileIntent = new Intent(this, ProfileActivity.class);
        profileIntent.putExtra("UserId", user.getId());


        final DrawerLayout drawer = findViewById(R.id.drawer_layout);
        final NavigationView navigationView = findViewById(R.id.nav_view);
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        mAppBarConfiguration = new AppBarConfiguration.Builder(
                R.id.nav_events, R.id.nav_articles, R.id.nav_portfolio, R.id.nav_trading_equipments,
                R.id.nav_investments, R.id.nav_money)
                .setDrawerLayout(drawer)
                .build();

        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment);

        NavigationUI.setupActionBarWithNavController(this, navController, mAppBarConfiguration);
        NavigationUI.setupWithNavController(navigationView, navController);

        // otherProfile is true when the user clicks the profile other user.
        // otherProfile is false when the user clicks the him/her profile.

        View header = navigationView.getHeaderView(0);

        MaterialCardView imageCard = header.findViewById(R.id.profileImageCard);
        TextView userName = header.findViewById(R.id.username);
        TextView userEmail = header.findViewById(R.id.title);

        String userFullName = user.getName() + " " + user.getSurname();
        userName.setText(userFullName);
        userEmail.setText(user.getEmail());

        imageCard.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(profileIntent);
            }
        });

        userName.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(profileIntent);
            }
        });

        userEmail.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(profileIntent);
            }
        });

        searchListView = findViewById(R.id.search_listView);
        adapter = new SearchAdapter(getApplicationContext(), searchList);
        searchListView.setAdapter(adapter);

        searchListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                if(adapter.getItem(i) instanceof TradingEquipment){
                    Intent intent = new Intent(getApplicationContext(), TradingEquipmentDetailActivity.class);
                    intent.putExtra("FromSearchResult",true);
                    intent.putExtra("TradingEquipment", (TradingEquipment) adapter.getItem(i));
                    startActivity(intent);
                } else if(searchList.get(i) instanceof User){
                    Intent intent = new Intent(getApplicationContext(), ProfileActivity.class);
                    intent.putExtra("UserId", ((User) adapter.getItem(i)).getId());
                    startActivity(intent);
                } else if(searchList.get(i) instanceof Event){
                    // TODO: Go to that activity
                } else if(searchList.get(i) instanceof Article){
                    Intent intent = new Intent(getApplicationContext(), ReadArticleActivity.class);
                    intent.putExtra("articleId", ((Article) adapter.getItem(i)).getId());
                    startActivity(intent);
                }
            }
        });

    }


    @Override
    public void onBackPressed() {
        if (!searchView.isIconified()) {
            searchView.setIconified(true);
            updateSearchList("");
        } else {
            moveTaskToBack(true);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        MenuItem searchViewItem = menu.findItem(R.id.app_bar_search);
        searchView = (SearchView) MenuItemCompat.getActionView(searchViewItem);
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                searchView.clearFocus();
                return false;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                searchListView.setVisibility(View.VISIBLE);
                updateSearchList(newText);
                return false;
            }
        });

        searchView.setOnCloseListener(new SearchView.OnCloseListener() {
            @Override
            public boolean onClose() {
                searchListView.setVisibility(View.GONE);
                updateSearchList("");
                return false;
            }
        });

        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onSupportNavigateUp() {
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment);
        return NavigationUI.navigateUp(navController, mAppBarConfiguration)
                || super.onSupportNavigateUp();
    }

    private void updateSearchList(String query) {
        searchList.removeAll(searchList);
        if (query.equals("")) {
            adapter.notifyDataSetChanged();
            progressBar.setVisibility(View.INVISIBLE);
        } else {
            final String searchUrl = Constants.LOCALHOST + Constants.SEARCH + query;
            Log.d(query, "updateSearchList: ");
            StringRequest searchRequest = new StringRequest(Request.Method.GET, searchUrl, new Response.Listener<String>() {
                @Override
                public void onResponse(String resp) {
                    try {
                        searchList.removeAll(searchList);
                        JSONObject response = new JSONObject(resp);
                        ArrayList<Object> list = ResponseParser.parseSearch(response);
                        searchList.addAll(list);
                        adapter.notifyDataSetChanged();
                        progressBar.setVisibility(View.INVISIBLE);

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Toast.makeText(MainActivity.this, "Cannot get the search results.", Toast.LENGTH_SHORT).show();
                    adapter.notifyDataSetChanged();
                    progressBar.setVisibility(View.INVISIBLE);

                }
            });
            requestQueue.add(searchRequest);
            progressBar.setVisibility(View.VISIBLE);
        }
    }
}
