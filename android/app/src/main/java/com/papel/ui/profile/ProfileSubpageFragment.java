package com.papel.ui.profile;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import android.util.Log;
import android.view.ContextMenu;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.TextView;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.papel.Constants;
import com.papel.R;
import com.papel.data.Alert;
import com.papel.data.Article;
import com.papel.data.Comment;
import com.papel.data.Portfolio;
import com.papel.data.User;
import com.papel.ui.articles.ReadArticleActivity;
import com.papel.ui.portfolio.PortfolioDetailActivity;
import com.papel.ui.portfolio.PortfolioListViewAdapter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link ProfileSubpageFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link ProfileSubpageFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ProfileSubpageFragment extends Fragment {

    public static final String ARG_SUBPAGE_NAME = "subpage_name";

    public static final String ARG_ARTICLES = "articles";
    public static final String ARG_PORTFOLIOS = "portfolios";
    public static final String ARG_FOLLOWERS = "followers";
    public static final String ARG_FOLLOWING = "following";
    public static final String ARG_FOLLOWER_PENDING = "follower-pending";
    public static final String ARG_FOLLOWING_PENDING = "following-pending";
    public static final String ARG_ALERTS = "alerts";

    public static final String ARG_ISME = "isMe";

    private String subpageName;
    private ArrayList<Article> articles;
    private ArrayList<Portfolio> portfolios;
    private ArrayList<User> followers;
    private ArrayList<User> following;
    private ArrayList<User> followersPending;
    private ArrayList<User> followingPending;
    private ArrayList<Alert> alerts;
    private boolean isMe;

    private OnFragmentInteractionListener mListener;

    public ProfileSubpageFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param subpageName Name of subpage
     * @return A new instance of fragment ProfileSubpageFragment.
     */
    public static ProfileSubpageFragment newInstance(String subpageName, ArrayList<Article> articles, ArrayList<Portfolio> portfolios, ArrayList<User> followers, ArrayList<User> following, ArrayList<User> followersPending, ArrayList<User> followingPending, ArrayList<Alert> alerts,boolean isMe) {
        ProfileSubpageFragment fragment = new ProfileSubpageFragment();
        Bundle args = new Bundle();
        args.putString(ARG_SUBPAGE_NAME, subpageName);
        args.putParcelableArrayList(ARG_ARTICLES, articles);
        args.putParcelableArrayList(ARG_PORTFOLIOS, portfolios);
        args.putParcelableArrayList(ARG_FOLLOWERS, followers);
        args.putParcelableArrayList(ARG_FOLLOWING,following);
        args.putParcelableArrayList(ARG_FOLLOWER_PENDING,followersPending);
        args.putParcelableArrayList(ARG_FOLLOWING_PENDING,followingPending);
        args.putParcelableArrayList(ARG_ALERTS,alerts);
        args.putBoolean(ARG_ISME, isMe);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            subpageName = getArguments().getString(ARG_SUBPAGE_NAME);
            articles = getArguments().getParcelableArrayList(ARG_ARTICLES);
            portfolios = getArguments().getParcelableArrayList(ARG_PORTFOLIOS);
            followers = getArguments().getParcelableArrayList(ARG_FOLLOWERS);
            following = getArguments().getParcelableArrayList(ARG_FOLLOWING);
            followersPending = getArguments().getParcelableArrayList(ARG_FOLLOWER_PENDING);
            followingPending = getArguments().getParcelableArrayList(ARG_FOLLOWING_PENDING);
            alerts = getArguments().getParcelableArrayList(ARG_ALERTS);
            isMe = getArguments().getBoolean(ARG_ISME);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_profile_subpage, container, false);
        ListView listView = view.findViewById(R.id.listView);
        TextView message = view.findViewById(R.id.message);

        if (subpageName.equals(Constants.ARTICLE_TITLE)) {

            ProfileListViewAdapter adapter = new ProfileListViewAdapter(getContext(), articles);
            listView.setAdapter(adapter);

            final Intent articleIntent = new Intent(getActivity().getApplicationContext(), ReadArticleActivity.class);

            listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                @Override
                public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                    Article currentArticle = articles.get(i);
                    articleIntent.putExtra("articleId", currentArticle.getId());
                    startActivity(articleIntent);
                }
            });

            if (articles.size() == 0) {
                message.setText(getString(R.string.no_article_message));
                message.setVisibility(View.VISIBLE);
                listView.setVisibility(View.INVISIBLE);
            }

        } else if (subpageName.equals(Constants.PORTFOLIO_TITLE)) {
            if (portfolios != null) {

                PortfolioListViewAdapter adapter = new PortfolioListViewAdapter(getContext(), portfolios);
                listView.setAdapter(adapter);

                final Intent portfolioIntent = new Intent(getContext(), PortfolioDetailActivity.class);

                listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                    @Override
                    public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                        Portfolio currentPortfolio = portfolios.get(i);
                        portfolioIntent.putExtra("Portfolio", currentPortfolio);
                        portfolioIntent.putExtra("isMe", isMe);
                        startActivity(portfolioIntent);
                    }
                });
                if (portfolios.size() == 0) {
                    message.setText(getString(R.string.no_portfolio_message));
                    message.setVisibility(View.VISIBLE);
                    listView.setVisibility(View.INVISIBLE);
                }
            } else {
                message.setText(getString(R.string.private_profile_message));
                message.setVisibility(View.VISIBLE);
                listView.setVisibility(View.INVISIBLE);
            }
        } else if (subpageName.equals(Constants.FOLLOWERS_TITLE)) {
            if (followers != null) {
                Log.d("Info","Here");
                Log.d("Info","Context "  + getContext().toString());
                FollowAdapter adapter = new FollowAdapter(getContext(),followers);
                listView.setAdapter(adapter);

                if (followers.size() == 0) {
                    message.setText(getString(R.string.no_followers_message));
                    message.setVisibility(View.VISIBLE);
                    listView.setVisibility(View.INVISIBLE);
                }

                final Intent profileIntent = new Intent(getContext(),ProfileActivity.class);
                listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                    @Override
                    public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                        User clickedUser = followers.get(i);
                        profileIntent.putExtra("UserId",clickedUser.getId());
                        startActivity(profileIntent);
                    }
                });

            } else {
                message.setText(getString(R.string.private_profile_message));
                message.setVisibility(View.VISIBLE);
                listView.setVisibility(View.INVISIBLE);
            }
        } else if (subpageName.equals(Constants.FOLLOWING_TITLE)) {
            if (following != null) {

                FollowAdapter adapter = new FollowAdapter(getContext(), following);
                listView.setAdapter(adapter);

                if (following.size() == 0) {
                    message.setText(getString(R.string.no_following_message));
                    message.setVisibility(View.VISIBLE);
                    listView.setVisibility(View.INVISIBLE);
                }

                final Intent profileIntent = new Intent(getContext(),ProfileActivity.class);
                listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                    @Override
                    public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                        User clickedUser = following.get(i);
                        profileIntent.putExtra("UserId",clickedUser.getId());
                        startActivity(profileIntent);
                    }
                });
            } else {
                message.setText(getString(R.string.private_profile_message));
                message.setVisibility(View.VISIBLE);
                listView.setVisibility(View.INVISIBLE);
            }
        } else if (subpageName.equals(Constants.FOLLOWER_PENDING_TITLE)) {
            if (followersPending.size() == 0) {
                message.setText(getString(R.string.no_pending_follower_message));
                message.setVisibility(View.VISIBLE);
                listView.setVisibility(View.INVISIBLE);
            } else {
                PendingFollowAdapter adapter = new PendingFollowAdapter(getContext(),followersPending,true);
                listView.setAdapter(adapter);
            }

        } else if (subpageName.equals(Constants.FOLLOWING_PENDING_TITLE)) {
            if (followingPending.size() == 0) {
                message.setText(getString(R.string.no_pending_following_message));
                message.setVisibility(View.VISIBLE);
                listView.setVisibility(View.INVISIBLE);
            } else {
                PendingFollowAdapter adapter = new PendingFollowAdapter(getContext(),followingPending,false);
                listView.setAdapter(adapter);
            }
        } else if (subpageName.equals(Constants.ALERTS_TITLE)) {
            if (alerts.size() == 0) {
                message.setText(getString(R.string.no_alerts));
                message.setVisibility(View.VISIBLE);
                listView.setVisibility(View.INVISIBLE);
            } else {
                AlertAdapter adapter = new AlertAdapter(getContext(),alerts);
                listView.setAdapter(adapter);

                registerForContextMenu(listView);
            }
        }
        return view;
    }


    @Override
    public void onCreateContextMenu(ContextMenu menu, View v, ContextMenu.ContextMenuInfo menuInfo) {
        super.onCreateContextMenu(menu, v, menuInfo);
        menu.add(0, v.getId(), 0, "Delete");
    }


    @Override
    public boolean onContextItemSelected(MenuItem item) {
        AdapterView.AdapterContextMenuInfo info = (AdapterView.AdapterContextMenuInfo) item.getMenuInfo();
        Log.d("Info","Position: " + info.position);
        // Only item is delete
        Alert clickedAlert = alerts.get(info.position);
        deleteAlert(getContext(),clickedAlert);
        return true;
    }

    private void deleteAlert(Context context, Alert alert) {
        RequestQueue requestQueue = Volley.newRequestQueue(context);
        String url;
        if (alert.getType() == 0) {
            // Currency case
            url = Constants.LOCALHOST + Constants.CURRENCY + alert.getCurrencyCode() + "/" + Constants.ALERT + "delete/" + alert.getId();
        } else {
            // Stock case
            url = Constants.LOCALHOST + Constants.STOCK + alert.getStockId() + "/" + Constants.ALERT + "delete/" + alert.getId();
        }
        StringRequest request = new StringRequest(Request.Method.DELETE, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }
        }){
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> headers = new HashMap<String, String>();
                headers.put("Authorization", "Bearer " + User.getInstance().getToken());
                return headers;
            }
        };

        requestQueue.add(request);

    }

    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnFragmentInteractionListener) {
            mListener = (OnFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        void onFragmentInteraction(Uri uri);
    }
}
