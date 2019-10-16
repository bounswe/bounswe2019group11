package com.papel.ui.portfolio;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.TextView;
import androidx.annotation.Nullable;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProviders;

import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.papel.R;
import com.papel.data.Portfolio;

import java.util.ArrayList;

public class PortfolioFragment extends Fragment {


    public View onCreateView(@NonNull LayoutInflater inflater,
            ViewGroup container, Bundle savedInstanceState) {

        View root = inflater.inflate(R.layout.fragment_portfolio, container, false);
        ListView portfolioListView = root.findViewById(R.id.portfolio_list);
        FloatingActionButton addPortfolio = root.findViewById(R.id.add_portfolio);

        ArrayList<Portfolio> portfolios = new ArrayList<>();
        Portfolio portfolio1 = new Portfolio("First Portfolio");
        Portfolio portfolio2 = new Portfolio("Second Portfolio");
        portfolios.add(portfolio1);
        portfolios.add(portfolio2);

        PortfolioListViewAdapter portfolioListViewAdapter = new PortfolioListViewAdapter(container.getContext(),portfolios);
        portfolioListView.setAdapter(portfolioListViewAdapter);

        portfolioListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                Log.d("Portfolio", i + " is clicked");
            }
        });

        portfolioListView.setOnItemLongClickListener(new AdapterView.OnItemLongClickListener() {
            @Override
            public boolean onItemLongClick(AdapterView<?> adapterView, View view, int i, long l) {
                Log.d("Portfolio", i + " is long clicked");
                // Return true to indicate that we have consumed the event.
                return true;
            }
        });


        addPortfolio.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d("Portfolio","Add portfolio");
            }
        });

        return root;
    }
}