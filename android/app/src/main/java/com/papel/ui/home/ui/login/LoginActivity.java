package com.papel.ui.home.ui.login;

import android.app.Activity;

import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProviders;

import android.app.AlertDialog;
import android.app.Dialog;
import android.app.IntentService;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.annotation.StringRes;
import androidx.appcompat.app.AppCompatActivity;

import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.RetryPolicy;
import com.android.volley.VolleyError;
import com.android.volley.VolleyLog;
import com.android.volley.toolbox.HttpHeaderParser;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.papel.MainActivity;
import com.papel.R;
import com.papel.ui.home.ui.login.LoginViewModel;
import com.papel.ui.home.ui.login.LoginViewModelFactory;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class LoginActivity extends AppCompatActivity {

    private LoginViewModel loginViewModel;
    private boolean isLogin = true;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        loginViewModel = ViewModelProviders.of(this, new LoginViewModelFactory())
                .get(LoginViewModel.class);

        EditText emailInput = findViewById(R.id.emailInput);
        EditText passwordInput = findViewById(R.id.passwordInput);

        final EditText nameInput = findViewById(R.id.nameInput);
        final EditText surnameInput = findViewById(R.id.surnameInput);
        final EditText ibanInput = findViewById(R.id.ibanInput);
        final EditText idInput = findViewById(R.id.idInput);
        final Button changeScreen = findViewById(R.id.changeScreen);
        final Button sendReq = findViewById(R.id.sendReqButton);

        final Intent intent = new Intent(this, MainActivity.class);


        changeScreen.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {


                if (isLogin) {
                    // Click on "change to sign up" button.

                    nameInput.setVisibility(View.VISIBLE);
                    surnameInput.setVisibility(View.VISIBLE);
                    ibanInput.setVisibility(View.VISIBLE);
                    idInput.setVisibility(View.VISIBLE);
                    changeScreen.setText(getString(R.string.changeLogin));
                    sendReq.setText(getString(R.string.signUp_button));
                    isLogin = false;

                } else {
                    // Click on "change to sign in" button.

                    nameInput.setVisibility(View.INVISIBLE);
                    surnameInput.setVisibility(View.INVISIBLE);
                    ibanInput.setVisibility(View.INVISIBLE);
                    idInput.setVisibility(View.INVISIBLE);
                    changeScreen.setText(getString(R.string.changeSignup));
                    sendReq.setText(getString(R.string.login_button));
                    isLogin = true;
                }
            }
        });

        // To test, please write your local ip address and don't forget to run servers locally.
        final String url = "http://192.168.43.108:3000/auth/sign-up";
        final RequestQueue queue = Volley.newRequestQueue(this);

        sendReq.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                if (isLogin) {
                    startActivity(intent);
                } else {
                    final JSONObject jsonBody = new JSONObject();
                    try {
                        // TODO Get parameters from EditText's
                        jsonBody.put("name", "name1");
                        jsonBody.put("surname", "surname1");
                        jsonBody.put("email", "hasan09912120d0@gmail.com");
                        jsonBody.put("password", "strongPa$.$word");
                        jsonBody.put("idNumber", "12345678910");
                        jsonBody.put("iban", "TR33 0006 1005 1978 6457 8413 26");
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                    StringRequest request = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
                        @Override
                        public void onResponse(String response) {
                            Log.i("Response", response);
                        }
                    }, new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            String responseBody = new String(error.networkResponse.data, StandardCharsets.UTF_8);
                            // TODO convert responseBody to JSON Object and display appropriate error messages
                            Log.d("Error", responseBody);
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

                    queue.add(request);
                    signUpDialog();
                    nameInput.setVisibility(View.INVISIBLE);
                    surnameInput.setVisibility(View.INVISIBLE);
                    ibanInput.setVisibility(View.INVISIBLE);
                    idInput.setVisibility(View.INVISIBLE);
                    changeScreen.setText(getString(R.string.changeSignup));
                    sendReq.setText(getString(R.string.login_button));
                    isLogin = true;
                }
            }

        });


    }

    private void signUpDialog() {
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
