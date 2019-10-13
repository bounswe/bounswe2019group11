package com.papel.ui.articles;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProviders;

import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.snackbar.Snackbar;
import com.papel.ListViewAdapter;
import com.papel.R;
import com.papel.data.Article;

import java.util.ArrayList;

public class ArticlesFragment extends Fragment {

    private ArticlesViewModel articlesViewModel;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        articlesViewModel =
                ViewModelProviders.of(this).get(ArticlesViewModel.class);
        View root = inflater.inflate(R.layout.fragment_articles, container, false);
        final ListView articleList = root.findViewById(R.id.article_list);
        final FloatingActionButton addArticleButton = root.findViewById(R.id.addArticleButton);
        ArrayList<Article> articles = new ArrayList<Article>();
        ListViewAdapter adapter = new ListViewAdapter(getActivity().getApplicationContext(), articles);
        articleList.setAdapter(adapter);

        addArticleButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Add article", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });

        articleList.setOnItemClickListener(new AdapterView.OnItemClickListener()
        {
            @Override
            public void onItemClick(AdapterView<?> adapter, View v, int position,
                                    long arg3)
            {
                Toast.makeText(getActivity().getApplicationContext(), "You clicked an item", Toast.LENGTH_SHORT).show();
            }
        });
        return root;
    }
}