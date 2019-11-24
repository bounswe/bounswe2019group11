package com.papel.ui.articles;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.PorterDuff;
import android.os.Bundle;
import android.util.Log;
import android.view.ContextMenu;
import android.view.LayoutInflater;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ListView;
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
import com.papel.ui.profile.ProfileActivity;
import com.papel.ui.utils.DialogHelper;
import com.papel.ui.utils.ResponseParser;

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
    private TextView voteCount;
    private ImageView profile_pic;
    private ImageButton addCommentButton;
    private ImageButton likeButton;
    private ImageButton dislikeButton;
    private EditText commentEditText;
    private ListView commentListView;
    private ArrayList<Object> comments;
    private ListViewAdapter adapter;
    private Article article;
    private ColorStateList cl_primary;
    private ColorStateList cl_black;
    private String articleId;


    private String authorId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_read_article);
        final View header = getLayoutInflater().inflate(R.layout.article_header, null);

        articleId = getIntent().getStringExtra("articleId");

        title = (TextView) header.findViewById(R.id.read_article_title_textview);
        content = (TextView) header.findViewById(R.id.read_article_content_textview);
        author = (TextView) header.findViewById(R.id.read_article_author_textview);
        date = (TextView) header.findViewById(R.id.read_article_date_textview);
        voteCount = header.findViewById(R.id.vote_count_textview);
        profile_pic = (ImageView) header.findViewById(R.id.read_article_pic_image);
        addCommentButton = (ImageButton) header.findViewById(R.id.add_comment_button);
        likeButton = header.findViewById(R.id.like_imageButton);
        dislikeButton = header.findViewById(R.id.dislike_imageButton);
        commentEditText = (EditText) header.findViewById(R.id.comment_edittext);
        commentListView = (ListView) findViewById(R.id.article_comments_listview);
        commentListView.addHeaderView(header);
        cl_primary = ColorStateList.valueOf(getResources().getColor(R.color.colorPrimary));
        cl_black = ColorStateList.valueOf(getResources().getColor(R.color.black));
        getArticleFromEndpoint(getApplicationContext(), articleId);


        final Intent profileIntent = new Intent(this, ProfileActivity.class);
        // TODO This should be inactive during the request to server
        author.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                profileIntent.putExtra("UserId",authorId);
                startActivity(profileIntent);
            }
        });

        profile_pic.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                profileIntent.putExtra("UserId",authorId);
                startActivity(profileIntent);
            }
        });

        commentListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                Comment clickedComment = (Comment) adapter.getItem(i-1);
                profileIntent.putExtra("UserId",clickedComment.getAuthorId());
                startActivity(profileIntent);
            }
        });

        addCommentButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (commentEditText.getText() != null) {
                    String content = commentEditText.getText().toString().trim();
                    addArticleComment(getApplicationContext(), articleId, content);
                }

            }
        });

        likeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(likeButton.getImageTintList() == cl_primary){
                    voteArticle(getApplicationContext(), articleId, true, false);
                    likeButton.setImageTintList(cl_black);
                    dislikeButton.setImageTintList(cl_black);
                }else{
                    voteArticle(getApplicationContext(), articleId, false, true);
                    likeButton.setImageTintList(cl_primary);
                    dislikeButton.setImageTintList(cl_black);
                }

            }
        });

        dislikeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(dislikeButton.getImageTintList() == cl_primary){
                    voteArticle(getApplicationContext(), articleId, true, false);
                    dislikeButton.setImageTintList(cl_black);
                    likeButton.setImageTintList(cl_black);
                }else{
                    voteArticle(getApplicationContext(), articleId, false, false);
                    dislikeButton.setImageTintList(cl_primary);
                    likeButton.setImageTintList(cl_black);
                }

            }
        });

        registerForContextMenu(commentListView);
    }


    private void getArticleFromEndpoint(final Context context, final String articleId) {
        RequestQueue requestQueue = Volley.newRequestQueue(context);
        String url = Constants.LOCALHOST + Constants.ARTICLE + articleId;
        StringRequest request = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject object = new JSONObject(response);
                    article = ResponseParser.parseArticle(object);
                    title.setText(article.getTitle());
                    content.setText(article.getBody());
                    authorId = article.getAuthorId();
                    author.setText(article.getAuthorName());
                    date.setText(article.getLongDate());
                    voteCount.setText("" + article.getVoteCount());
                    if(article.getUserVote() == 1){
                        likeButton.setImageTintList(cl_primary);
                    }else if(article.getUserVote() == -1){
                        dislikeButton.setImageTintList(cl_primary);
                    }
                    setComments(article.getComments());
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                DialogHelper.showBasicDialog(context, "Error", "We couldn't load the article. Please try again.", null);
            }
        }) {
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

    private void setComments(ArrayList<Comment> comments_list){
        comments = new ArrayList<>();
        comments.addAll(comments_list);
        adapter = new ListViewAdapter(getApplicationContext(), comments);
        commentListView.setAdapter(adapter);
        adapter.notifyDataSetChanged();
    }

    private void refreshVoteCount(final Context context, final String articleId){
        RequestQueue requestQueue = Volley.newRequestQueue(context);
        String url = Constants.LOCALHOST + Constants.ARTICLE + articleId;
        StringRequest request = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject object = new JSONObject(response);
                    article = ResponseParser.parseArticle(object);
                    voteCount.setText(""+article.getVoteCount());
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                DialogHelper.showBasicDialog(context, "Error", "We couldn't load the article. Please try again.", null);
            }
        }) {
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

    private void addArticleComment(final Context context, final String articleId, final String content) {
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
                getArticleFromEndpoint(context, articleId);
                commentEditText.setText("");
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

    private void editArticleComment(final Context context, final String articleId, final String commentId, final String content) {
        RequestQueue requestQueue = Volley.newRequestQueue(context);
        String url = Constants.LOCALHOST + Constants.ARTICLE + articleId + "/" + Constants.COMMENT + commentId;
        final JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("body", content);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        StringRequest request = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                getArticleFromEndpoint(context, articleId);
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
                        Toast.makeText(context, "There was an error when editing your comment: " + message, Toast.LENGTH_LONG).show();
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

    private void deleteArticleComment(final Context context, final String articleId, final String commentId) {
        RequestQueue requestQueue = Volley.newRequestQueue(context);
        String url = Constants.LOCALHOST + Constants.ARTICLE + articleId + "/" + Constants.COMMENT + commentId;
        StringRequest request = new StringRequest(
                Request.Method.DELETE, url,
                new Response.Listener<String>() {

                    @Override
                    public void onResponse(String response) {
                        Toast.makeText(ReadArticleActivity.this, "Comment deleted.", Toast.LENGTH_SHORT).show();
                        getArticleFromEndpoint(context, articleId);
                    }
                }, new Response.ErrorListener() {

            @Override
            public void onErrorResponse(VolleyError error) {
                NetworkResponse response = error.networkResponse;
                if (response != null && response.data != null) {
                    JSONObject jsonObject = null;
                    String errorMessage = null;

                    switch (response.statusCode) {
                        case 400:
                            errorMessage = new String(response.data);
                            try {
                                jsonObject = new JSONObject(errorMessage);
                                String serverResponseMessage = (String) jsonObject.get("message");
                                Toast.makeText(getApplicationContext(), "" + serverResponseMessage, Toast.LENGTH_LONG).show();
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                    }
                }
            }
        }) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> headers = new HashMap<String, String>();
                headers.put("Authorization", "Bearer " + User.getInstance().getToken());
                return headers;
            }
        };
        requestQueue.add(request);
    }

    @Override
    public void onCreateContextMenu(ContextMenu menu, View v, ContextMenu.ContextMenuInfo menuInfo) {
        super.onCreateContextMenu(menu, v, menuInfo);
        if (v.getId() == R.id.article_comments_listview) {
            MenuInflater inflater = getMenuInflater();
            inflater.inflate(R.menu.article_comments_menu, menu);
        }
    }

    @Override
    public boolean onContextItemSelected(MenuItem item) {
        AdapterView.AdapterContextMenuInfo info = (AdapterView.AdapterContextMenuInfo) item.getMenuInfo();
        final Comment c = (Comment) comments.get(info.position - 1);
        if (item.getItemId() == R.id.edit) {
            LayoutInflater li = LayoutInflater.from(getApplicationContext());
            View promptsView = li.inflate(R.layout.edit_comment_prompt, null);
            AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(this);
            alertDialogBuilder.setView(promptsView);
            final EditText userInput = (EditText) promptsView.findViewById(R.id.editTextDialogUserInput);
            userInput.setText(c.getContent());
            alertDialogBuilder
                    .setCancelable(true)
                    .setPositiveButton("OK",
                            new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int id) {
                                    editArticleComment(getApplicationContext(), article.getId(),
                                            c.getCommentId(), userInput.getText().toString().trim());
                                }
                            })
                    .setNegativeButton("Cancel",
                            new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int id) {
                                    dialog.cancel();
                                }
                            });

            AlertDialog alertDialog = alertDialogBuilder.create();
            alertDialog.show();
            return true;
        } else if (item.getItemId() == R.id.delete) {
            deleteArticleComment(getApplicationContext(), c.getArticleId(), c.getCommentId());
            return true;
        }
        return false;
    }

    private void voteArticle(final Context context, final String articleId, boolean isClear, boolean isUp){
        RequestQueue requestQueue = Volley.newRequestQueue(context);

        String endpoint="";
        if(isClear){
            endpoint = Constants.CLEARVOTE;
        }else if(isUp){
            endpoint = Constants.UPVOTE;
        }else{
            endpoint = Constants.DOWNVOTE;

        }
        String url = Constants.LOCALHOST + Constants.ARTICLE + articleId + "/" + endpoint;
        StringRequest request = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                refreshVoteCount(context, articleId);
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
                        Toast.makeText(context, "There was an error when voting the article: " + message, Toast.LENGTH_LONG).show();
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        }) {
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

