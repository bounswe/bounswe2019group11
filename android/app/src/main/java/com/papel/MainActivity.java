package com.papel;

import android.content.Intent;
import android.os.Bundle;

import com.google.android.material.card.MaterialCardView;

import android.view.View;


import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import com.google.android.material.navigation.NavigationView;
import com.papel.data.User;
import com.papel.ui.profile.ProfileActivity;

import androidx.drawerlayout.widget.DrawerLayout;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.view.Menu;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {

    private AppBarConfiguration mAppBarConfiguration;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        Intent comingIntent = getIntent();
        final User user = comingIntent.getParcelableExtra("User");

        final Intent profileIntent = new Intent(this, ProfileActivity.class);
        profileIntent.putExtra("UserId",user.getId());


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
    }


    @Override
    public void onBackPressed() {
        moveTaskToBack(true);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onSupportNavigateUp() {
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment);
        return NavigationUI.navigateUp(navController, mAppBarConfiguration)
                || super.onSupportNavigateUp();
    }

}
