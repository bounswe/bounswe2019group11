package com.papel.ui.recommendations;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.papel.R;
import com.papel.data.Article;

import java.util.ArrayList;

public class RecommendedArticleAdapter extends BaseAdapter {

    private Context context;
    private ArrayList<Article> articles;

    public RecommendedArticleAdapter(Context context, ArrayList<Article> articles) {
        this.context = context;
        this.articles = articles;
    }

    @Override
    public int getCount() {
        return articles.size();
    }

    @Override
    public Object getItem(int i) {
        return articles.get(i);
    }

    @Override
    public long getItemId(int i) {
        return i;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        if(view == null) {
            view = LayoutInflater.from(context).inflate(R.layout.recommended_article_row,viewGroup,false);
        }

        Article article = articles.get(i);

        TextView recommendedArticleTitle = view.findViewById(R.id.recommendedArticleTitle);
        TextView recommmeddedArticleBody = view.findViewById(R.id.recommendedArticleBody);

        recommendedArticleTitle.setText(article.getTitle());
        recommmeddedArticleBody.setText(article.getBody());
        return view;
    }
}
