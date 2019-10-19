package com.papel.ui.home.ui.login;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.StringRes;
import androidx.appcompat.app.AppCompatActivity;

import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.papel.Constants;
import com.papel.MainActivity;
import com.papel.R;
import com.papel.ui.utils.DialogHelper;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class LoginActivity extends AppCompatActivity {

    private boolean isLogin = true;
    private boolean isTrader = false;

    private EditText emailInput;
    private EditText passwordInput;
    private EditText nameInput;
    private EditText surnameInput;
    private CheckBox traderCheckBox;
    private EditText ibanInput;
    private EditText idInput;
    private Button changeScreen;
    private Button sendReq;
    private ProgressBar progressBar;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        emailInput = findViewById(R.id.emailInput);
        passwordInput = findViewById(R.id.passwordInput);
        nameInput = findViewById(R.id.nameInput);
        surnameInput = findViewById(R.id.surnameInput);
        ibanInput = findViewById(R.id.ibanInput);
        idInput = findViewById(R.id.idInput);
        progressBar = findViewById(R.id.progressBar);

        changeScreen = findViewById(R.id.changeScreen);
        sendReq = findViewById(R.id.sendReqButton);

        traderCheckBox = findViewById(R.id.checkBox);
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

        final Intent intent = new Intent(this, MainActivity.class);

        changeScreen.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                if (isLogin) {
                    // Click on "change to sign up" button.
                    showSignUp();
                    isLogin = false;

                } else {
                    // Click on "change to sign in" button.
                    showLogin();
                    isLogin = true;
                }
            }
        });


        sendReq.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                sendReq.setClickable(false);
                progressBar.setVisibility(View.VISIBLE);

                String email = emailInput.getText().toString();
                String password = passwordInput.getText().toString();

                if (isLogin) {
                    if (email.length() == 0 ||password.length() == 0) {
                        DialogHelper.showBasicDialog(LoginActivity.this,"Error","You must fill all fields.");
                    } else {
                        sendLoginRequest(email, password);
                    }

                } else {
                    String name = nameInput.getText().toString();
                    String surname = surnameInput.getText().toString();
                    String id = idInput.getText().toString();
                    String iban = ibanInput.getText().toString();

                    if (isTrader) {
                        if (email.length() == 0 || password.length() == 0 ||name.length() == 0 || surname.length() == 0 || id.length() == 0 || iban.length() == 0) {
                            DialogHelper.showBasicDialog(LoginActivity.this, "Error", "You must fill all fields.");
                        }
                    } else {
                        if (email.length() == 0 || password.length() == 0 ||name.length() == 0 || surname.length() == 0) {
                            DialogHelper.showBasicDialog(LoginActivity.this, "Error", "You must fill all fields.");
                        }
                        id = "";
                        iban = "";
                    }

                    sendSignUpRequest(email, password, name, surname, id, iban);
                }
            }

        });


    }

    private void showLogin() {
        clearTexts();
        emailInput.setVisibility(View.VISIBLE);
        passwordInput.setVisibility(View.VISIBLE);
        nameInput.setVisibility(View.INVISIBLE);
        surnameInput.setVisibility(View.INVISIBLE);
        traderCheckBox.setVisibility(View.INVISIBLE);
        traderCheckBox.setChecked(false);
        idInput.setVisibility(View.INVISIBLE);
        ibanInput.setVisibility(View.INVISIBLE);

        changeScreen.setText(getText(R.string.changeSignup));
        sendReq.setText(getText(R.string.login_button));
    }


    private void showSignUp() {
        clearTexts();
        emailInput.setVisibility(View.VISIBLE);
        passwordInput.setVisibility(View.VISIBLE);
        nameInput.setVisibility(View.VISIBLE);
        surnameInput.setVisibility(View.VISIBLE);
        traderCheckBox.setVisibility(View.VISIBLE);
        changeScreen.setText(getText(R.string.changeLogin));
        sendReq.setText(getText(R.string.signUp_button));

    }


    private void clearTexts() {
        emailInput.setText("");
        passwordInput.setText("");
        nameInput.setText("");
        surnameInput.setText("");
        idInput.setText("");
        ibanInput.setText("");
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

    private void sendSignUpRequest(String email, String password, String name, String surname, String id, String iban) {
        RequestQueue requestQueue = Volley.newRequestQueue(LoginActivity.this);
        String url = Constants.LOCALHOST + Constants.SIGN_UP;
        final JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("name", name);
            jsonBody.put("surname", surname);
            jsonBody.put("email", email);
            jsonBody.put("password", password);
            // TODO change hardcoded strings
            jsonBody.put("idNumber", "12345678910");
            jsonBody.put("iban", "TR33 0006 1005 1978 6457 8413 26");
            JSONObject location = new JSONObject();
            location.put("latitude", "41.085987");
            location.put("longitude", "29.044008");
            jsonBody.put("location", location);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        StringRequest request = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                progressBar.setVisibility(View.INVISIBLE);
                sendReq.setClickable(true);
                // Success
                validationDialog();
                showLogin();
                isLogin = true;
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                progressBar.setVisibility(View.INVISIBLE);
                sendReq.setClickable(true);
                NetworkResponse networkResponse = error.networkResponse;
                if(networkResponse != null) {
                    String data = new String(networkResponse.data);
                    try{
                        JSONObject errorObject = new JSONObject(data);
                        String name = errorObject.getString("name");
                        String message = errorObject.getString("message");
                        if (name.equals(Constants.VALIDATION_ERROR)) {
                            JSONArray cause = errorObject.getJSONArray("cause");
                            message = "";
                            for (int i=0;i<cause.length();i++) {
                                JSONObject c = cause.getJSONObject(i);
                                message = message + c.getString("message");
                            }
                        }
                        DialogHelper.showBasicDialog(LoginActivity.this, "Error",message);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        }) {
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


    private void sendLoginRequest(String email, String password) {
        RequestQueue requestQueue = Volley.newRequestQueue(LoginActivity.this);
        String url = Constants.LOCALHOST + Constants.LOGIN;
        final JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("email", email);
            jsonBody.put("password", password);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        StringRequest request = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                progressBar.setVisibility(View.INVISIBLE);
                sendReq.setClickable(true);
                NetworkResponse networkResponse = error.networkResponse;
                if(networkResponse != null) {
                    String data = new String(networkResponse.data);
                    try{
                        JSONObject errorObject = new JSONObject(data);
                        String message = errorObject.getString("message");
                        DialogHelper.showBasicDialog(LoginActivity.this, "Error",message);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        }) {
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


    private void validationDialog() {
        AlertDialog.Builder dialog = new AlertDialog.Builder(this);
        dialog.setMessage("Please check your e-mail for verification.");
        dialog.setTitle("Sign up successful.");
        dialog.setNeutralButton("Ok",
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog,
                                        int which) {
                        Toast.makeText(getApplicationContext(), "Hope you do it...", Toast.LENGTH_LONG).show();
                    }
                });
        AlertDialog alertDialog = dialog.create();
        alertDialog.show();
    }

    private void updateUiWithUser(LoggedInUserView model) {
        String welcome = getString(R.string.app_name) + model.getDisplayName();
        // TODO : initiate successful logged in experience
        Toast.makeText(getApplicationContext(), welcome, Toast.LENGTH_LONG).show();
    }

    private void showLoginFailed(@StringRes Integer errorString) {
        Toast.makeText(getApplicationContext(), errorString, Toast.LENGTH_SHORT).show();
    }
}
