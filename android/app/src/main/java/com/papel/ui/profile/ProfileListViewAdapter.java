package com.papel.ui.profile;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.papel.R;
import com.papel.data.Article;

import java.util.ArrayList;

public class ProfileListViewAdapter extends BaseAdapter {

    private Context context;
    private ArrayList<Article> articles;

    public ProfileListViewAdapter(Context context, ArrayList<Article> articles) {
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
            view = LayoutInflater.from(context).inflate(R.layout.profile_row,viewGroup,false);
        }

        Article article = articles.get(i);

        TextView title = view.findViewById(R.id.article_title);
        TextView content = view.findViewById(R.id.article_content);
        TextView date = view.findViewById(R.id.article_date);

        title.setText(article.getTitle());
        date.setText(article.getDate());
        content.setText("\n" + article.getBody());

        return view;
    }
}
