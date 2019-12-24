package com.papel.ui.recommendations;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.viewpager.widget.ViewPager;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.google.android.material.tabs.TabLayout;
import com.papel.R;
import com.papel.ui.profile.ProfileSubpageAdapter;


public class RecommendationFragment extends Fragment {

    private RecommendationSubpageAdapter adapter;
    private ViewPager pager;
    private TabLayout tabLayout;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_recommendation, container, false);
        pager = view.findViewById(R.id.pager);
        tabLayout = view.findViewById(R.id.tabLayout);
        adapter = new RecommendationSubpageAdapter(getFragmentManager());
        pager.setAdapter(adapter);
        tabLayout.setupWithViewPager(pager);
        tabLayout.setTabMode(TabLayout.MODE_SCROLLABLE);
        return view;
    }

}
