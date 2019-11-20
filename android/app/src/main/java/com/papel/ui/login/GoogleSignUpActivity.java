package com.papel.ui.login;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.ProgressBar;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.papel.Constants;
import com.papel.R;
import com.papel.data.GoogleUserAccount;
import com.papel.ui.utils.DialogHelper;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class GoogleSignUpActivity extends AppCompatActivity {

    private CheckBox traderCheckBox;
    private EditText ibanInput;
    private EditText idInput;
    private ProgressBar progressBar;
    private Button signUpButton;

    private boolean isTrader = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_google_sign_up);

        Intent intent = getIntent();
        final GoogleUserAccount googleAccount = intent.getParcelableExtra("GoogleAccount");

        traderCheckBox = findViewById(R.id.checkBox);
        ibanInput = findViewById(R.id.ibanInput);
        idInput = findViewById(R.id.idInput);
        progressBar = findViewById(R.id.progressBar);
        signUpButton = findViewById(R.id.signUpButton);

        traderCheckBox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                isTrader = b;
                if (b) {
                    showTraderSignUp();
                } else {
                    hideTraderSignUp();
                }
            }
        });


        signUpButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String id = idInput.getText().toString();
                String iban = ibanInput.getText().toString();

                signUpButton.setClickable(false);
                progressBar.setVisibility(View.VISIBLE);

                if (isTrader) {
                    if (id.length() == 0 || iban.length() == 0) {
                        DialogHelper.showBasicDialog(GoogleSignUpActivity.this, "Error", "You must fill all fields.", null);
                        signUpButton.setClickable(true);
                        signUpButton.setVisibility(View.INVISIBLE);
                    }
                    sendSignUpRequest(googleAccount,id,iban);
                } else {
                    sendSignUpRequest(googleAccount,"","");
                }

            }
        });

    }

    private void sendSignUpRequest(GoogleUserAccount googleAccount,String id, String iban) {
        RequestQueue requestQueue = Volley.newRequestQueue(GoogleSignUpActivity.this);
        String url = Constants.LOCALHOST + Constants.SIGN_UP;
        final JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("name", googleAccount.getName());
            jsonBody.put("surname", googleAccount.getSurname());
            jsonBody.put("email", googleAccount.getEmail());
            jsonBody.put("idNumber", id);
            jsonBody.put("iban", iban);
            JSONObject location = new JSONObject();
            Log.d("SignUp", "Location" + googleAccount.getLatitude() + " " + googleAccount.getLongitude());
            location.put("latitude", googleAccount.getLatitude());
            location.put("longitude", googleAccount.getLongitude());
            jsonBody.put("location", location);
            jsonBody.put("googleUserId",googleAccount.getGoogleUserId());
        } catch (JSONException e) {
            e.printStackTrace();
        }

        StringRequest request = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                progressBar.setVisibility(View.INVISIBLE);
                signUpButton.setClickable(true);
                Intent loginIntent = new Intent(GoogleSignUpActivity.this, LoginActivity.class);
                startActivity(loginIntent);
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                progressBar.setVisibility(View.INVISIBLE);
                signUpButton.setClickable(true);
                NetworkResponse networkResponse = error.networkResponse;
                if (networkResponse != null) {
                    String data = new String(networkResponse.data);
                    try {
                        JSONObject errorObject = new JSONObject(data);
                        String name = errorObject.getString("name");
                        String message = errorObject.getString("message");
                        if (name.equals(Constants.VALIDATION_ERROR)) {
                            JSONArray cause = errorObject.getJSONArray("cause");
                            message = "";
                            for (int i = 0; i < cause.length(); i++) {
                                JSONObject c = cause.getJSONObject(i);
                                message = message + c.getString("message");
                            }
                        }
                        DialogHelper.showBasicDialog(GoogleSignUpActivity.this, "Error", message, null);
                    } catch (JSONException e) {
                        DialogHelper.showBasicDialog(GoogleSignUpActivity.this, "Error", "We couldn't make it.Please try again.", null);
                        e.printStackTrace();
                    }
                }
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

    private void showTraderSignUp() {
        idInput.setVisibility(View.VISIBLE);
        ibanInput.setVisibility(View.VISIBLE);
        idInput.setText("");
        ibanInput.setText("");
    }

    private void hideTraderSignUp() {
        idInput.setVisibility(View.INVISIBLE);
        ibanInput.setVisibility(View.INVISIBLE);
        idInput.setText("");
        ibanInput.setText("");
    }
}
