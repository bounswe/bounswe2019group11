package com.papel.ui.articles;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.RatingBar;
import android.widget.TextView;
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
import com.papel.ListViewAdapter;
import com.papel.R;
import com.papel.data.Article;
import com.papel.data.Comment;
import com.papel.data.User;
import com.papel.ui.utils.DialogHelper;
import com.papel.ui.utils.ResponseParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class ReadArticleActivity extends AppCompatActivity {

    private TextView title;
    private TextView content;
    private TextView author;
    private TextView date;
    private TextView ratingTextView;
    private ImageView profile_pic;
    private ImageView share;
    private ImageView addCommentButton;
    private EditText commentEditText;
    private RatingBar ratingBar;
    private ListView commentListView;
    private ArrayList<Object> comments;
    private ListViewAdapter adapter;
    private Article article;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_read_article);
        article = null;

        final String articleId = getIntent().getStringExtra("articleId");

        title = (TextView) findViewById(R.id.read_article_title_textview);
        content = (TextView) findViewById(R.id.read_article_content_textview);
        author = (TextView) findViewById(R.id.read_article_author_textview);
        date = (TextView) findViewById(R.id.read_article_date_textview);
        ratingTextView = (TextView) findViewById(R.id.article_rating_textview);
        profile_pic = (ImageView) findViewById(R.id.read_article_pic_image);
        share = (ImageView) findViewById(R.id.article_share_imageview);
        addCommentButton = (ImageView) findViewById(R.id.add_comment_button);
        commentEditText = (EditText) findViewById(R.id.comment_edittext);
        ratingBar = (RatingBar) findViewById(R.id.article_rating_bar);
        commentListView = (ListView) findViewById(R.id.article_comments_listview);

        getArticleFromEndpoint(getApplicationContext(), articleId);

        addCommentButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(commentEditText.getText() != null){
                    String content = commentEditText.getText().toString().trim();
                    addArticleComment(getApplicationContext(), articleId, content);
                }

            }
        });

        ratingBar.setOnRatingBarChangeListener(new RatingBar.OnRatingBarChangeListener() {
            public void onRatingChanged(RatingBar ratingBar, float rating,
                                        boolean fromUser) {
                Toast.makeText(ReadArticleActivity.this, "Article voted", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void getArticleFromEndpoint(final Context context, final String articleId){
        RequestQueue requestQueue = Volley.newRequestQueue(context);
        String url = Constants.LOCALHOST + Constants.ARTICLE + articleId;
        StringRequest request = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject object = new JSONObject(response);
                    article = ResponseParser.parseArticle(object, context);
                    title.setText(article.getTitle());
                    content.setText(article.getBody());
                    author.setText(article.getAuthorName());
                    String rank = "" + (article.getRank()/2) + " / 5";
                    ratingTextView.setText(rank);
                    date.setText(article.getDate());
                    ArrayList<Comment> comments_list =  article.getComments();
                    for(int i=0; i<comments_list.size(); i++){
                        comments.add((Object)comments_list.get(i));
                    }
                    adapter = new ListViewAdapter(getApplicationContext(), comments);
                    commentListView.setAdapter(adapter);
                    adapter.notifyDataSetChanged();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                DialogHelper.showBasicDialog(context,"Error","We couldn't load the article. Please try again.",null);
            }
        });

        requestQueue.add(request);
    }

    private void addArticleComment(final Context context, final String articleId, final String content){
        RequestQueue requestQueue = Volley.newRequestQueue(context);
        String url = Constants.LOCALHOST + Constants.ARTICLE + articleId + "/" + Constants.COMMENT;
        final JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("body", content);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        StringRequest request = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                adapter.notifyDataSetChanged();
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
                        Toast.makeText(context, "There was an error when posting your comment: " + message, Toast.LENGTH_LONG).show();
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
