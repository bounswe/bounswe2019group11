package com.papel.ui.profile;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.TextView;

import com.papel.Constants;
import com.papel.R;
import com.papel.data.Article;
import com.papel.data.Portfolio;
import com.papel.ui.articles.ReadArticleActivity;
import com.papel.ui.portfolio.PortfolioDetailActivity;
import com.papel.ui.portfolio.PortfolioListViewAdapter;

import org.w3c.dom.Text;

import java.util.ArrayList;

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
    public static final String ARG_ISME = "isMe";

    private String subpageName;
    private ArrayList<Article> articles;
    private ArrayList<Portfolio> portfolios;
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
    public static ProfileSubpageFragment newInstance(String subpageName, ArrayList<Article> articles,ArrayList<Portfolio> portfolios, boolean isMe) {
        ProfileSubpageFragment fragment = new ProfileSubpageFragment();
        Bundle args = new Bundle();
        args.putString(ARG_SUBPAGE_NAME, subpageName);
        args.putParcelableArrayList(ARG_ARTICLES,articles);
        args.putParcelableArrayList(ARG_PORTFOLIOS,portfolios);
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
            isMe = getArguments().getBoolean(ARG_ISME);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_profile_subpage, container, false);
        ListView listView = view.findViewById(R.id.listView);
        TextView message =  view.findViewById(R.id.message);

        if (subpageName.equals(Constants.ARTICLE_TITLE)) {

            ProfileListViewAdapter adapter = new ProfileListViewAdapter(getContext(),articles);
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

            if(articles.size() == 0){
                message.setText(getString(R.string.no_article_message));
                message.setVisibility(View.VISIBLE);
                listView.setVisibility(View.INVISIBLE);
            }

        } else if (subpageName.equals(Constants.PORTFOLIO_TITLE)) {
            if (portfolios != null) {

                PortfolioListViewAdapter adapter = new PortfolioListViewAdapter(getContext(),portfolios);
                listView.setAdapter(adapter);

                final Intent portfolioIntent = new Intent(getActivity().getApplicationContext(), PortfolioDetailActivity.class);

                listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                    @Override
                    public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                        Portfolio currentPortfolio = portfolios.get(i);
                        portfolioIntent.putExtra("Portfolio", currentPortfolio);
                        portfolioIntent.putExtra("isMe", isMe);
                        startActivity(portfolioIntent);
                    }
                });
                if(portfolios.size() == 0){
                    message.setText(getString(R.string.no_portfolio_message));
                    message.setVisibility(View.VISIBLE);
                    listView.setVisibility(View.INVISIBLE);
                }
            }
            else{
                message.setText(getString(R.string.private_profile_message));
                message.setVisibility(View.VISIBLE);
                listView.setVisibility(View.INVISIBLE);
            }

        }
        return view;
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
