package com.papel.ui.profile;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.Switch;
import android.widget.TextView;

import com.papel.R;
import com.papel.data.User;

public class ProfileActivity extends AppCompatActivity {
    private boolean following = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        Intent intent = getIntent();
        User user = intent.getParcelableExtra("User");
        boolean otherProfile = intent.getBooleanExtra("otherProfile", false);

        final Button followButton = findViewById(R.id.followButton);
        if(otherProfile) {
            followButton.setVisibility(View.VISIBLE);
        }
        final Switch publicPrivateButton = findViewById(R.id.publicPrivateProfile);

        // Add the public or private profile button if profile page is own profile page.
        if(!otherProfile){
            publicPrivateButton.setVisibility(View.VISIBLE);
            //publicPrivateButton.setText(Buraya user'ın profili public mi degil mi infosu gelecek.);
            // Sets the text for when the button is first created.
        }


        try {
            // TODO Test HERE
            ActionBar actionBar = getSupportActionBar();
            actionBar.setHomeButtonEnabled(true);
            actionBar.setDisplayHomeAsUpEnabled(true);
        } catch (NullPointerException exp) {
            exp.printStackTrace();
        }

        TextView userName = findViewById(R.id.username);
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
