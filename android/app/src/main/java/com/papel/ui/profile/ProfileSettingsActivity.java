package com.papel.ui.profile;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.CompoundButton;
import android.widget.Switch;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.papel.Constants;
import com.papel.R;
import com.papel.ui.utils.DialogHelper;
import com.papel.ui.utils.ResponseParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class ProfileSettingsActivity extends AppCompatActivity {

    private String userId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile_settings);

        Intent intent = getIntent();
        userId = intent.getStringExtra("UserId");
        boolean isPrivate = intent.getBooleanExtra("IsPrivate",false);

        Switch publicPrivateSwitch = findViewById(R.id.publicPrivateProfile);

        publicPrivateSwitch.setChecked(isPrivate);

        publicPrivateSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                // If b is true -> make private
                // If b is false -> make public
                changePrivacy(b);
            }
        });
    }


    private void changePrivacy(boolean isPrivate) {
        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String url = Constants.LOCALHOST + Constants.USER + userId + "/privacy";
        final JSONObject jsonBody = new JSONObject();
        try {
            if (isPrivate) {
                jsonBody.put("privacy","private");
            } else  {
                jsonBody.put("privacy","public");
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        StringRequest request = new StringRequest(Request.Method.PUT, url,new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Log.d("Info","Successful update");
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                DialogHelper.showBasicDialog(getApplicationContext(), "Error","We couldn't update your choices.Please try again!",null);
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
