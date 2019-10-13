package com.papel.ui.articles;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.ImageView;
import android.widget.RatingBar;
import android.widget.TextView;

import com.papel.R;

public class ReadArticleActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_read_article);

        final TextView title = (TextView) findViewById(R.id.read_article_title_textview);
        final TextView content = (TextView) findViewById(R.id.read_article_content_textview);
        final TextView author = (TextView) findViewById(R.id.read_article_author_textview);
        final TextView date = (TextView) findViewById(R.id.read_article_date_textview);
        final TextView ratingTextView = (TextView) findViewById(R.id.article_rating_textview);
        final ImageView profile_pic = (ImageView) findViewById(R.id.read_article_pic_image);
        final ImageView share = (ImageView) findViewById(R.id.article_share_imageview);
        RatingBar ratingBar = (RatingBar) findViewById(R.id.article_rating_bar);


        ratingBar.setOnRatingBarChangeListener(new RatingBar.OnRatingBarChangeListener() {
            public void onRatingChanged(RatingBar ratingBar, float rating,
                                        boolean fromUser) {

                ratingTextView.setText(String.valueOf(rating)+" / 5");


            }
        });
    }
}
