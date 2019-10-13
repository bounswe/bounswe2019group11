package com.papel.ui.home.ui.login;

import android.app.Activity;

import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProviders;

import android.app.IntentService;
import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.annotation.StringRes;
import androidx.appcompat.app.AppCompatActivity;

import android.text.Editable;
import android.text.TextWatcher;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.papel.MainActivity;
import com.papel.R;
import com.papel.ui.home.ui.login.LoginViewModel;
import com.papel.ui.home.ui.login.LoginViewModelFactory;

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
                // Click on "change to sign up" button.
                if(isLogin){
                    nameInput.setVisibility(View.VISIBLE);
                    surnameInput.setVisibility(View.VISIBLE);
                    ibanInput.setVisibility(View.VISIBLE);
                    idInput.setVisibility(View.VISIBLE);
                    changeScreen.setText(getString(R.string.changeLogin));
                    sendReq.setText(getString(R.string.signUp_button));
                    isLogin = false;
                }
                // Click on "change to sign in" button.
                else{
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

        sendReq.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(intent);
            }
        });


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
