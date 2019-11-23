package com.papel.ui.profile;

import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;

public class ProfileSubpageAdapter extends FragmentPagerAdapter {

    public ProfileSubpageAdapter(FragmentManager fragmentManager) {
        super(fragmentManager);
    }

    @Override
    public Fragment getItem(int position) {
        Fragment fragment = new ProfileSubpageFragment();
        Bundle args = new Bundle();
        if(position == 0) {
            args.putString(ProfileSubpageFragment.ARG_SUBPAGE_NAME,"Article");
        } else if (position == 1) {
            args.putString(ProfileSubpageFragment.ARG_SUBPAGE_NAME,"Portfolio");
        }
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
        if(position == 0) {
            return "ARTICLES";
        } else if(position == 1) {
            return "PORTFOLIOS";
        }
        return "PAGE TITLE";
    }
}
