package com.papel.ui.portfolio;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;
import android.widget.TextView;
import androidx.annotation.Nullable;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProviders;
import com.papel.R;
import com.papel.data.Portfolio;

import java.util.ArrayList;

public class PortfolioFragment extends Fragment {


    public View onCreateView(@NonNull LayoutInflater inflater,
            ViewGroup container, Bundle savedInstanceState) {

        View root = inflater.inflate(R.layout.fragment_portfolio, container, false);
        ListView portfolioListView = root.findViewById(R.id.portfolio_list);

        ArrayList<Portfolio> portfolios = new ArrayList<>();
        Portfolio portfolio1 = new Portfolio("First Portfolio");
        Portfolio portfolio2 = new Portfolio("Second Portfolio");
        portfolios.add(portfolio1);
        portfolios.add(portfolio2);

        PortfolioListViewAdapter portfolioListViewAdapter = new PortfolioListViewAdapter(container.getContext(),portfolios);
        portfolioListView.setAdapter(portfolioListViewAdapter);

        return root;
    }
}