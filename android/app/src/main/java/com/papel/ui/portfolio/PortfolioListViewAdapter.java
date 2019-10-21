package com.papel.ui.portfolio;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.papel.R;
import com.papel.data.Portfolio;

import java.util.ArrayList;

public class PortfolioListViewAdapter extends BaseAdapter {

    private Context context;
    private ArrayList<Portfolio> portfolios;

    public PortfolioListViewAdapter(Context context,  ArrayList<Portfolio >portfolios) {
        this.context = context;
        this.portfolios = portfolios;
    }

    @Override
    public int getCount() {
        return portfolios.size();
    }

    @Override
    public Portfolio getItem(int i) {
        return portfolios.get(i);
    }

    @Override
    public long getItemId(int i) {
        return i;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        if(view == null) {
            view = LayoutInflater.from(context).inflate(R.layout.portfolio_row,viewGroup,false);
        }

        Portfolio item = portfolios.get(i);

        TextView name = view.findViewById(R.id.portfolio_name);

        name.setText(item.getName());

        return view;
    }
}
