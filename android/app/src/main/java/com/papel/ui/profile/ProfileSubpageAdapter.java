package com.papel.ui.profile;

import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;

import com.papel.Constants;
import com.papel.data.Article;
import com.papel.data.Portfolio;

import java.util.ArrayList;

public class ProfileSubpageAdapter extends FragmentPagerAdapter {

    private ArrayList<Article> articles;
    private ArrayList<Portfolio> portfolios;
    private boolean isMe;
    public ProfileSubpageAdapter(FragmentManager fragmentManager, ArrayList<Article> articles, ArrayList<Portfolio> portfolios, boolean isMe) {
        super(fragmentManager);
        this.articles = articles;
        this.portfolios = portfolios;
        this.isMe = isMe;
    }

    @Override
    public Fragment getItem(int position) {
        Fragment fragment = new ProfileSubpageFragment();
        Bundle args = new Bundle();
        if (position == 0) {
            args.putString(ProfileSubpageFragment.ARG_SUBPAGE_NAME, Constants.ARTICLE_TITLE);
            args.putParcelableArrayList(ProfileSubpageFragment.ARG_ARTICLES, this.articles);
        } else if (position == 1) {
            args.putString(ProfileSubpageFragment.ARG_SUBPAGE_NAME, Constants.PORTFOLIO_TITLE);
            args.putParcelableArrayList(ProfileSubpageFragment.ARG_PORTFOLIOS, this.portfolios);
        }
        args.putBoolean(ProfileSubpageFragment.ARG_ISME, this.isMe);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public int getCount() {
        return 2;
    }

    @Nullable
    @Override
    public CharSequence getPageTitle(int position) {
        if (position == 0) {
            return Constants.ARTICLE_TITLE;
        } else if (position == 1) {
            return Constants.PORTFOLIO_TITLE;
        }
        return "PAGE TITLE";
    }
}
