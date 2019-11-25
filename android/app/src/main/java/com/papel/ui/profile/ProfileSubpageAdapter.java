package com.papel.ui.profile;

import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;

import com.papel.Constants;
import com.papel.data.Article;
import com.papel.data.Portfolio;
import com.papel.data.User;

import java.util.ArrayList;

public class ProfileSubpageAdapter extends FragmentPagerAdapter {

    private ArrayList<Article> articles;
    private ArrayList<Portfolio> portfolios;
    private ArrayList<User> followers;
    private ArrayList<User> following;
    private ArrayList<User> followersPending;
    private ArrayList<User> followingPending;
    private boolean isMe;
    public ProfileSubpageAdapter(FragmentManager fragmentManager, ArrayList<Article> articles, ArrayList<Portfolio> portfolios, ArrayList<User> followers,ArrayList<User> following,ArrayList<User> followersPending,ArrayList<User> followingPending,boolean isMe) {
        super(fragmentManager);
        this.articles = articles;
        this.portfolios = portfolios;
        this.followers = followers;
        this.following = following;
        this.followersPending = followersPending;
        this.followingPending = followingPending;
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
        } else if (position == 2) {
            args.putString(ProfileSubpageFragment.ARG_SUBPAGE_NAME,Constants.FOLLOWERS_TITLE);
            args.putParcelableArrayList(ProfileSubpageFragment.ARG_FOLLOWERS,followers);
        } else if (position == 3) {
            args.putString(ProfileSubpageFragment.ARG_SUBPAGE_NAME,Constants.FOLLOWING_TITLE);
            args.putParcelableArrayList(ProfileSubpageFragment.ARG_FOLLOWING,following);
        } else if (position == 4) {
            args.putString(ProfileSubpageFragment.ARG_SUBPAGE_NAME,Constants.REQUESTS_TITLE);
            args.putParcelableArrayList(ProfileSubpageFragment.ARG_FOLLOWER_PENDING,followersPending);
            args.putParcelableArrayList(ProfileSubpageFragment.ARG_FOLLOWING_PENDING,followingPending);
        }
        args.putBoolean(ProfileSubpageFragment.ARG_ISME, this.isMe);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public int getCount() {
        if (this.isMe) {
            return 5;
        }
        return 4;
    }

    @Nullable
    @Override
    public CharSequence getPageTitle(int position) {
        if (position == 0) {
            return Constants.ARTICLE_TITLE;
        } else if (position == 1) {
            return Constants.PORTFOLIO_TITLE;
        } else if (position == 2) {
            return Constants.FOLLOWERS_TITLE;
        } else if(position == 3) {
            return Constants.FOLLOWING_TITLE;
        } else if (position == 4) {
            return Constants.REQUESTS_TITLE;
        }
        return "PAGE TITLE";
    }
}
