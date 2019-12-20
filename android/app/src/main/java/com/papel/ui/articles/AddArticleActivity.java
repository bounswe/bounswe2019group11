package com.papel.ui.articles;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

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
import com.papel.data.User;
import com.papel.ui.login.LoginActivity;
import com.papel.ui.utils.DialogHelper;

import org.json.JSONException;
import org.json.JSONObject;

public class AddArticleActivity extends AppCompatActivity {
    private EditText titleEditText;
    private EditText contentEditText;
    private EditText imageEditText;
    private Button addArticleButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_article);
        titleEditText = findViewById(R.id.article_title_edittext);
        contentEditText = findViewById(R.id.article_content_edittext);
        imageEditText = findViewById(R.id.article_image_edittext);
        addArticleButton = findViewById(R.id.article_add_button);

        addArticleButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                String title = titleEditText.getText().toString().trim();
                String content = contentEditText.getText().toString().trim();
                String image = imageEditText.getText().toString().trim();


                if (title.isEmpty()) {
                    Toast.makeText(getApplicationContext(), R.string.title_empty_error, Toast.LENGTH_SHORT).show();
                    return;
                } else if (content.isEmpty()) {
                    Toast.makeText(getApplicationContext(), R.string.content_empty_error, Toast.LENGTH_SHORT).show();
                    return;
                } else {
                    addArticle(getApplicationContext(), title.trim(), content.trim(), image);
                }


            }
        });
    }

    public void addArticle(final Context context, String title, String body, String image_url) {
        RequestQueue requestQueue = Volley.newRequestQueue(context);
        String url = Constants.LOCALHOST + Constants.ARTICLE;
        final JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("title", title);
            jsonBody.put("imgUri", image_url);
            jsonBody.put("body", body);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        StringRequest request = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                Toast.makeText(context, "Article successfully posted.", Toast.LENGTH_SHORT).show();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                NetworkResponse networkResponse = error.networkResponse;
                if (networkResponse != null) {
                    String data = new String(networkResponse.data);
                    try {
                        JSONObject errorObject = new JSONObject(data);
                        String message = errorObject.getString("message");
                        Toast.makeText(context, "There was an error when posting your article: " + message, Toast.LENGTH_LONG).show();
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
                return "application/json; charset=utf-8";
            }

            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> headers = new HashMap<String, String>();
                headers.put("Authorization", "Bearer " + User.getInstance().getToken());
                return headers;
            }
        };
        requestQueue.add(request);

    }
}
