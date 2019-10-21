package com.papel.ui.articles;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.papel.Constants;
import com.papel.ListViewAdapter;
import com.papel.R;
import com.papel.data.Article;
import com.papel.data.Portfolio;
import com.papel.ui.utils.DialogHelper;
import com.papel.ui.utils.ResponseParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;

public class ArticlesFragment extends Fragment {

    private ListView articleListView;
    private FloatingActionButton addArticleButton;
    private ArrayList<Object> articles;
    private ListViewAdapter adapter;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_articles, container, false);

        articleListView = root.findViewById(R.id.article_list);
        addArticleButton = root.findViewById(R.id.addArticleButton);
        articles = new ArrayList<Object>();
        adapter = new ListViewAdapter(getActivity().getApplicationContext(), articles);
        articleListView.setAdapter(adapter);

        getArticles(container.getContext());

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
                intent.putExtra("articleId", article.getId());
                startActivity(intent);
            }
        });
        return root;
    }

    private void getArticles(final Context context) {
        RequestQueue requestQueue = Volley.newRequestQueue(context);
        String url = Constants.LOCALHOST + Constants.ARTICLE;
        StringRequest request = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONArray responseArray = new JSONArray(response);
                    for(int i = 0;i<responseArray.length(); i++) {
                        JSONObject object = responseArray.getJSONObject(i);
                        Article article = ResponseParser.parseArticle(object, context);
                        if (article != null) {
                            articles.add(article);
                        }
                    }
                    adapter.notifyDataSetChanged();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                DialogHelper.showBasicDialog(context,"Error","We couldn't load the articles. Please try again.",null);
            }
        });

        requestQueue.add(request);

    }


}