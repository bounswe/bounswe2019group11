package com.papel.ui.articles;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Adapter;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.TextView;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.papel.Constants;
import com.papel.R;
import com.papel.data.Annotation;
import com.papel.data.AnnotationBody;
import com.papel.data.User;
import com.papel.ui.utils.ResponseParser;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class ShowAnnotationActivity extends AppCompatActivity {

    private Annotation annotation;
    private AnnotationListViewAdapter adapter;
    private ListView bodyListView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_show_annotation);

        Intent intent = getIntent();
        annotation = intent.getParcelableExtra("Annotation");
        String annotatedText = intent.getStringExtra("AnnotatedText");

        TextView annotatedTextView = findViewById(R.id.annotatedText);
        annotatedTextView.setText(annotatedText);

        adapter = new AnnotationListViewAdapter(this,annotation.getBody());

        bodyListView = findViewById(R.id.body);
        bodyListView.setAdapter(adapter);

        final EditText comment = findViewById(R.id.annotationCommentEditText);
        ImageButton addCommentButton = findViewById(R.id.addCommentButton);
        addCommentButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String commentText = comment.getText().toString();
                if (commentText.length() > 0) {
                    sendAnnotationComment(getApplicationContext(),comment.getText().toString());
                }
                // TODO: Warn user for the else case
            }
        });
    }

    private void sendAnnotationComment (final Context context, String value){
        RequestQueue requestQueue = Volley.newRequestQueue(context);
        String url = Constants.ANNOTATION_URL + Constants.ANNOTATION + annotation.getId();
        final JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("type", "TextualBody");
            jsonBody.put("value",value);
            jsonBody.put("purpose","commenting");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        StringRequest request = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject responseObject = new JSONObject(response);
                    annotation = ResponseParser.parseAnnotation(responseObject);
                    adapter = new AnnotationListViewAdapter(context,annotation.getBody());
                    bodyListView.setAdapter(adapter);
                    Log.d("Info","Comment is added");
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }
        }){
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
