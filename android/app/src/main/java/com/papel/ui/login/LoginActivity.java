package com.papel.ui.login;

import android.Manifest;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.os.Looper;
import android.provider.Settings;
import android.util.Log;
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
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.SignInButton;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.tabs.TabLayout;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;
import com.papel.Constants;
import com.papel.MainActivity;
import com.papel.R;
import com.papel.data.GoogleUserAccount;
import com.papel.data.User;
import com.papel.ui.utils.ConnectionHelper;
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
    private Button sendReq;
    private ProgressBar progressBar;
    private User user;
    private SignInButton googleSignInButton;

    private FusedLocationProviderClient fusedLocationProviderClient;
    
    private Double latitude = null;
    private Double longitude = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        if (!ConnectionHelper.checkInternetConnection(this)) {
            DialogHelper.showBasicDialog(this, "Error", "Please check your internet connection", null);
        } else {
            fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(this);
            checkPermission();
            getDeviceToken();

            TabLayout tabLayout = findViewById(R.id.tabLayout);
            tabLayout.addOnTabSelectedListener(new TabLayout.BaseOnTabSelectedListener() {
                @Override
                public void onTabSelected(TabLayout.Tab tab) {
                    Log.d("Tab Selected", "Tab " + tab.getPosition());
                    if (tab.getPosition() == 0) {
                        // Change to login screen
                        showLogin();
                        isLogin = true;
                    } else if (tab.getPosition() == 1) {
                        // Change to signup screen
                        showSignUp();
                        isLogin = false;
                    }
                }

                @Override
                public void onTabUnselected(TabLayout.Tab tab) {

                }

                @Override
                public void onTabReselected(TabLayout.Tab tab) {

                }
            });

            emailInput = findViewById(R.id.emailInput);
            passwordInput = findViewById(R.id.passwordInput);
            nameInput = findViewById(R.id.nameInput);
            surnameInput = findViewById(R.id.surnameInput);
            ibanInput = findViewById(R.id.ibanInput);
            idInput = findViewById(R.id.idInput);
            progressBar = findViewById(R.id.progressBar);

            sendReq = findViewById(R.id.sendReqButton);
            googleSignInButton = findViewById(R.id.googleSignInButton);

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

            GoogleSignInOptions googleSignInOptions = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                    .requestEmail()
                    .requestProfile()
                    .requestIdToken(getString(R.string.server_client_id))
                    .build();
            final GoogleSignInClient googleSignInClient = GoogleSignIn.getClient(this,googleSignInOptions);

            googleSignInButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    if(isLogin) {
                        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(LoginActivity.this);
                        if(account != null) {
                            String personName = account.getDisplayName();
                            String personGivenName = account.getGivenName();
                            String personFamilyName = account.getFamilyName();
                            String personEmail = account.getEmail();
                            String personId = account.getId();
                            Log.d("Info","Google Login");
                            Log.d("Info","Person name: " + personName);
                            Log.d("Info","Person given name: " + personGivenName);
                            Log.d("Info","Person family name: " + personFamilyName);
                            Log.d("Info","Person email: " + personEmail);
                            Log.d("Info","Person Id: " + personId);
                        } else {
                            Log.d("Info","No signed Google account.");
                        }
                    } else {
                        //Signup case
                        Intent googleSignInIntent = googleSignInClient.getSignInIntent();
                        startActivityForResult(googleSignInIntent,Constants.GOOGLE_SIGN_IN_REQUEST_CODE);
                    }
                }
            });

            sendReq.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    Log.d("Send Request", "Clicked");
                    sendReq.setClickable(false);
                    progressBar.setVisibility(View.VISIBLE);

                    String email = emailInput.getText().toString();
                    String password = passwordInput.getText().toString();

                    if (isLogin) {
                        if (email.length() == 0 || password.length() == 0) {
                            DialogHelper.showBasicDialog(LoginActivity.this, "Error", "You must fill all fields.", null);
                            progressBar.setVisibility(View.INVISIBLE);
                            sendReq.setClickable(true);
                        } else {
                            sendLoginRequest(email, password);
                        }

                    } else {
                        String name = nameInput.getText().toString();
                        String surname = surnameInput.getText().toString();
                        String id = idInput.getText().toString();
                        String iban = ibanInput.getText().toString();

                        if (isTrader) {
                            if (email.length() == 0 || password.length() == 0 || name.length() == 0 || surname.length() == 0 || id.length() == 0 || iban.length() == 0) {
                                DialogHelper.showBasicDialog(LoginActivity.this, "Error", "You must fill all fields.", null);
                                progressBar.setVisibility(View.INVISIBLE);
                                sendReq.setClickable(true);
                            } else {
                                sendSignUpRequest(email, password, name, surname, id, iban);
                            }
                        } else {
                            if (email.length() == 0 || password.length() == 0 || name.length() == 0 || surname.length() == 0) {
                                DialogHelper.showBasicDialog(LoginActivity.this, "Error", "You must fill all fields.", null);
                                progressBar.setVisibility(View.INVISIBLE);
                                sendReq.setClickable(true);
                            } else {
                                sendSignUpRequest(email, password, name, surname, "", "");
                            }
                        }

                    }
                }

            });
        }
    }

    public void getDeviceToken() {
        FirebaseInstanceId.getInstance().getInstanceId().addOnCompleteListener(new OnCompleteListener<InstanceIdResult>() {
            @Override
            public void onComplete(@NonNull Task<InstanceIdResult> task) {
                if (!task.isSuccessful()) {
                    Log.d("Info", "Cannot get the token");
                }
                String token = task.getResult().getToken();
                Log.d("Info", "Token: " + token);
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        // Result returned from launching the Intent from GoogleSignInClient.getSignInIntent(...);
        if (requestCode == Constants.GOOGLE_SIGN_IN_REQUEST_CODE) {
            // The Task returned from this call is always completed, no need to attach
            // a listener.
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
            try {
                GoogleSignInAccount account = task.getResult(ApiException.class);
                String name = account.getGivenName();
                String surname = account.getFamilyName();
                String email = account.getEmail();
                String googleUserId = account.getId();

                Intent intent = new Intent(LoginActivity.this, GoogleSignUpActivity.class);
                GoogleUserAccount googleAccount = new GoogleUserAccount(latitude,longitude,name,surname,email,googleUserId);
                intent.putExtra("GoogleAccount", googleAccount);
                startActivity(intent);

            } catch (ApiException e) {
                e.printStackTrace();
            }


        }
    }

    public void checkPermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED ||
                ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION},
                    Constants.LOCATION_PERMISSION_REQUEST_CODE);
        } else {
            // We have permissions.
            getLastKnownLocation();
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        Log.d("Info", "onRequestPermissionsResult");
        if (requestCode == Constants.LOCATION_PERMISSION_REQUEST_CODE) {
            if (grantResults.length == 2 && grantResults[0] == PackageManager.PERMISSION_GRANTED && grantResults[1] == PackageManager.PERMISSION_GRANTED) {
                Log.d("Location", "Permission granted");
                startActivity(new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS));
            } else {
                Log.d("Location", ":(");
                DialogHelper.showBasicDialog(LoginActivity.this, "Warning", "For the best experience, please turn on the GPS.", null);
            }
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (!ConnectionHelper.checkInternetConnection(this)) {
            DialogHelper.showBasicDialog(this, "Error", "Please check your internet connection", null);
        } else {
            getLastKnownLocation();
        }
    }

    private void getLastKnownLocation() {
        final LocationRequest locationRequest = LocationRequest.create();
        locationRequest.setInterval(10000);
        locationRequest.setFastestInterval(5000);
        locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);

        LocationCallback locationCallback = new LocationCallback() {
            @Override
            public void onLocationResult(LocationResult locationResult) {
                if (locationResult == null) {
                    return;
                }
                for (Location location : locationResult.getLocations()) {
                    latitude = location.getLatitude();
                    longitude = location.getLongitude();
                    //Log.d("Location Callback", location.getLatitude() + " " + location.getLongitude());
                }
            }
        };

        fusedLocationProviderClient.requestLocationUpdates(locationRequest, locationCallback, Looper.getMainLooper());


        fusedLocationProviderClient.getLastLocation().addOnSuccessListener(this, new OnSuccessListener<Location>() {
            @Override
            public void onSuccess(Location location) {
                if (location != null) {
                    double latitude = location.getLatitude();
                    double longitude = location.getLongitude();
                    Log.d("Location", latitude + " " + longitude);
                } else {
                    Log.d("Location", "No location");
                    DialogHelper.showBasicDialog(LoginActivity.this, "Warning", "For the best experience, please turn on the GPS.", null);

                }
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                Log.d("Location", "Failure" + e.toString());
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
        sendReq.setText(getText(R.string.login_button));
    }


    private void showSignUp() {
        clearTexts();
        emailInput.setVisibility(View.VISIBLE);
        passwordInput.setVisibility(View.VISIBLE);
        nameInput.setVisibility(View.VISIBLE);
        surnameInput.setVisibility(View.VISIBLE);
        traderCheckBox.setVisibility(View.VISIBLE);
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
            jsonBody.put("idNumber", id);
            jsonBody.put("iban", iban);
            JSONObject location = new JSONObject();
            Log.d("SignUp", "Location" + latitude + " " + longitude);
            location.put("latitude", latitude);
            location.put("longitude", longitude);
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
                        DialogHelper.showBasicDialog(LoginActivity.this, "Error", message, null);
                    } catch (JSONException e) {
                        DialogHelper.showBasicDialog(LoginActivity.this, "Error", "We couldn't make it.Please try again.", null);
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
                try {
                    JSONObject responseObject = new JSONObject(response);
                    String token = responseObject.getString("token");
                    JSONObject userObject = responseObject.getJSONObject("user");
                    JSONObject location = userObject.getJSONObject("location");
                    double latitude = location.getDouble("latitude");
                    double longitude = location.getDouble("longitude");
                    String role = userObject.getString("role");
                    String id = userObject.getString("_id");
                    String name = userObject.getString("name");
                    String surname = userObject.getString("surname");
                    String email = userObject.getString("email");
                    String idNumber = userObject.getString("idNumber");
                    String iban = userObject.getString("iban");

                    user = new User(token, latitude, longitude, role, id, name, surname, email, idNumber, iban);

                    User.setInstance(user);

                    Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                    intent.putExtra("User", user);
                    startActivity(intent);
                } catch (JSONException e) {
                    DialogHelper.showBasicDialog(LoginActivity.this, "Error", "We couldn't make it.Please try again.", null);
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                progressBar.setVisibility(View.INVISIBLE);
                sendReq.setClickable(true);
                NetworkResponse networkResponse = error.networkResponse;
                if (networkResponse != null) {
                    String data = new String(networkResponse.data);
                    try {
                        JSONObject errorObject = new JSONObject(data);
                        String message = errorObject.getString("message");
                        DialogHelper.showBasicDialog(LoginActivity.this, "Error", message, null);
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

}
