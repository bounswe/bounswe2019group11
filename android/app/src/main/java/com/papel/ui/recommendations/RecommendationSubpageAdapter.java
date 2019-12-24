package com.papel.ui.recommendations;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;

public class RecommendationSubpageAdapter extends FragmentPagerAdapter {

    public RecommendationSubpageAdapter(FragmentManager fragmentManager) {
        super(fragmentManager);
    }



    @Override
    public Fragment getItem(int position) {
        Fragment fragment;
        if (position == 0) {
            fragment = new RecommendedArticleFragment();
        } else {
            fragment = new NearbyUserFragment();
        }
        return fragment;
    }

    @Override
    public int getCount() {
        return 2;
    }

    @Nullable
    @Override
    public CharSequence getPageTitle(int position) {
        if (position == 0 ){
            return "Recommended Articles";
        } else if (position == 1) {
            return "Nearby Users";
        }
        return super.getPageTitle(position);
    }
}
