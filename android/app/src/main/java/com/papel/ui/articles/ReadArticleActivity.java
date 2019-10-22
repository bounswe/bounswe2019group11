package com.papel.ui.articles;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.RatingBar;
import android.widget.TextView;
import android.widget.Toast;

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
import com.papel.ui.utils.DialogHelper;
import com.papel.ui.utils.ResponseParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class ReadArticleActivity extends AppCompatActivity {

    private TextView title;
    private TextView content;
    private TextView author;
    private TextView date;
    private TextView ratingTextView;
    private ImageView profile_pic;
    private ImageView share;
    private RatingBar ratingBar;
    private ListView commentListView;
    private ArrayList<String> comments;
    private ArrayAdapter<String> adapter;
    private Article article;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_read_article);
        article = null;

        String articleId = getIntent().getStringExtra("articleId");

        title = (TextView) findViewById(R.id.read_article_title_textview);
        content = (TextView) findViewById(R.id.read_article_content_textview);
        author = (TextView) findViewById(R.id.read_article_author_textview);
        date = (TextView) findViewById(R.id.read_article_date_textview);
        ratingTextView = (TextView) findViewById(R.id.article_rating_textview);
        profile_pic = (ImageView) findViewById(R.id.read_article_pic_image);
        share = (ImageView) findViewById(R.id.article_share_imageview);
        ratingBar = (RatingBar) findViewById(R.id.article_rating_bar);
        commentListView = (ListView) findViewById(R.id.article_comments_listview);

        getArticleFromEndpoint(getApplicationContext(), articleId);

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
                    comments = article.getComments();
                    date.setText(article.getDate());
                    adapter = new ArrayAdapter<String>(context, android.R.layout.simple_list_item_1, comments);
                    commentListView.setAdapter(adapter);

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

}
