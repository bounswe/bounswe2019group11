package com.papel.ui.profile;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;

import com.papel.R;

public class ProfileActivity extends AppCompatActivity {
    private boolean following = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        Intent intent = getIntent();
        boolean otherProfile = intent.getBooleanExtra("otherProfile", false);
        final Button followButton = findViewById(R.id.followButton);
        if(otherProfile) {
            followButton.setVisibility(View.VISIBLE);
        }

        ActionBar actionBar = getSupportActionBar();
        actionBar.setHomeButtonEnabled(true);
        actionBar.setDisplayHomeAsUpEnabled(true);


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
        });

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
