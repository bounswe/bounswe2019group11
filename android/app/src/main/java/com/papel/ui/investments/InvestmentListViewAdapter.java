package com.papel.ui.investments;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.Filter;
import android.widget.TextView;

import com.papel.R;
import com.papel.data.Currency;
import com.papel.data.Investment;
import com.papel.data.Stock;
import com.papel.data.TradingEquipment;
import com.papel.data.User;

import java.util.ArrayList;

public class InvestmentListViewAdapter extends BaseAdapter {

    private Context context;
    private ArrayList<Investment> investments;
    private ArrayList<Investment> filteredData;
    private User user;
    private boolean showFullname;

    public InvestmentListViewAdapter(Context context, ArrayList<Investment> investments, boolean showFullname) {
        this.context = context;
        this.investments = investments;
        this.filteredData = investments;
        this.showFullname = showFullname;
        user = User.getInstance();
        Log.d(user.getRole(), "getView: ");
    }


    @Override
    public int getCount() {
        return filteredData.size();
    }

    @Override
    public Investment getItem(int i) {
        return filteredData.get(i);
    }

    @Override
    public long getItemId(int i) {
        return i;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        if(view == null) {
            view = LayoutInflater.from(context).inflate(R.layout.investment_row,viewGroup,false);
        }

        Investment item = filteredData.get(i);

        TextView name = view.findViewById(R.id.investment_name);
        TextView amount = view.findViewById(R.id.investment_amount);
        String text_amount = ""+item.getAmount();
        Button sell_button = view.findViewById(R.id.investment_sell_button);


        if(user.getRole().toLowerCase().equals("trader")){
            sell_button.setText(R.string.sell);
        }else{
            sell_button.setText(R.string.remove);
        }


        if (item.getEquipment() instanceof Stock) {
            if (showFullname) {
                name.setText(((Stock)item.getEquipment()).getName());
            } else {
                name.setText(((Stock)item.getEquipment()).getSymbol());
            }
        } else if (item.getEquipment() instanceof Currency) {
            if (showFullname) {
                name.setText(((Currency)item.getEquipment()).getName());
            } else {
                name.setText(((Currency)item.getEquipment()).getCode());
            }
        }
        amount.setText(text_amount);

        return view;
    }

    public Filter getFilter() {
        return filter;
    }

    private Filter filter = new Filter() {
        @Override
        protected FilterResults performFiltering(CharSequence constraint) {
            FilterResults results = new FilterResults();
            ArrayList<Investment> suggestions = new ArrayList<>();

            if (constraint == null || constraint.length() == 0) {
                suggestions.addAll(investments);
            } else {
                String filterPattern = constraint.toString().toLowerCase().trim();
                for (int i = 0; i<investments.size(); i++) {
                    Investment item = investments.get(i);
                    if (item.getEquipment() instanceof Stock) {
                        if(((Stock)item.getEquipment()).getName().toLowerCase().contains(filterPattern)
                                || ((Stock)item.getEquipment()).getSymbol().toLowerCase().contains(filterPattern)) {
                            suggestions.add(item);
                        }
                    } else if (item.getEquipment() instanceof Currency) {
                        if(((Currency)item.getEquipment()).getName().toLowerCase().contains(filterPattern)
                                || ((Currency)item.getEquipment()).getCode().toLowerCase().contains(filterPattern)) {
                            suggestions.add(item);
                        }
                    }

                }
            }

            results.values = suggestions;
            results.count = suggestions.size();

            return results;        }

        @Override
        protected void publishResults(CharSequence constraint, FilterResults results) {
            filteredData = (ArrayList<Investment>) results.values;
            notifyDataSetChanged();
        }

        @Override
        public CharSequence convertResultToString(Object resultValue) {
            return ((Stock) resultValue).getSymbol();
        }
    };
}
