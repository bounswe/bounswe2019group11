package com.papel.ui.articles;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.RatingBar;
import android.widget.TextView;

import com.papel.ListViewAdapter;
import com.papel.R;
import com.papel.data.Article;
import com.papel.data.Comment;

import java.util.ArrayList;

public class ReadArticleActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_read_article);

        int article_id = getIntent().getIntExtra("article_id", -1);
        final TextView title = (TextView) findViewById(R.id.read_article_title_textview);
        final TextView content = (TextView) findViewById(R.id.read_article_content_textview);
        final TextView author = (TextView) findViewById(R.id.read_article_author_textview);
        final TextView date = (TextView) findViewById(R.id.read_article_date_textview);
        final TextView ratingTextView = (TextView) findViewById(R.id.article_rating_textview);
        final ImageView profile_pic = (ImageView) findViewById(R.id.read_article_pic_image);
        final ImageView share = (ImageView) findViewById(R.id.article_share_imageview);
        final RatingBar ratingBar = (RatingBar) findViewById(R.id.article_rating_bar);
        final ListView commentListView = (ListView) findViewById(R.id.article_comments_listview);
        final ArrayList<Object> comments = new ArrayList<Object>();
        ListViewAdapter adapter = new ListViewAdapter(getApplicationContext(), comments);
        commentListView.setAdapter(adapter);


        ratingBar.setOnRatingBarChangeListener(new RatingBar.OnRatingBarChangeListener() {
            public void onRatingChanged(RatingBar ratingBar, float rating,
                                        boolean fromUser) {
                ratingTextView.setText(String.valueOf(rating)+" / 5");
            }
        });
    }
}
