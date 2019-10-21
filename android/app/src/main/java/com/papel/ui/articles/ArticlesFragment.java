package com.papel.ui.articles;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.papel.ListViewAdapter;
import com.papel.R;
import com.papel.data.Article;

import java.util.ArrayList;
import java.util.Calendar;

public class ArticlesFragment extends Fragment {

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_articles, container, false);
        final ListView articleListView = root.findViewById(R.id.article_list);
        final FloatingActionButton addArticleButton = root.findViewById(R.id.addArticleButton);
        final ArrayList<Object> articles = new ArrayList<Object>();
        ListViewAdapter adapter = new ListViewAdapter(getActivity().getApplicationContext(), articles);
        articleListView.setAdapter(adapter);

        addArticleButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                final Intent intent = new Intent(getActivity().getApplicationContext(), AddArticleActivity.class);
                startActivity(intent);
            }
        });

        articleListView.setOnItemClickListener(new AdapterView.OnItemClickListener()
        {
            @Override
            public void onItemClick(AdapterView<?> adapter, View v, int position,
                                    long arg3)
            {
                final Intent intent = new Intent(getActivity().getApplicationContext(), ReadArticleActivity.class);
                Article article = (Article)articles.get(position);
                intent.putExtra("article_id",article.getId());
                startActivity(intent);
            }
        });
        return root;
    }
}