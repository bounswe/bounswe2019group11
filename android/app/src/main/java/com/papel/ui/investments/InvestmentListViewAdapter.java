package com.papel.ui.investments;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Filter;
import android.widget.TextView;

import com.papel.R;
import com.papel.data.Currency;
import com.papel.data.Investment;
import com.papel.data.Stock;
import com.papel.data.TradingEquipment;

import java.util.ArrayList;

public class InvestmentListViewAdapter extends BaseAdapter {

    private Context context;
    private ArrayList<Investment> investments;
    private ArrayList<Investment> filteredData;
    private boolean showFullname;

    public InvestmentListViewAdapter(Context context, ArrayList<Investment> investments, boolean showFullname) {
        this.context = context;
        this.investments = investments;
        this.filteredData = investments;
        this.showFullname = showFullname;
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
            view = LayoutInflater.from(context).inflate(R.layout.trading_equipment_row,viewGroup,false);
        }

        Investment item = filteredData.get(i);

        TextView name = view.findViewById(R.id.trading_equipment_name);
        TextView amount = view.findViewById(R.id.trading_equipment_type_name);
        String text_amount = ""+item.getAmount();


        if (item.getEquipment() instanceof Stock) {
            if (showFullname) {
                name.setText(((Stock)item.getEquipment()).getName());
            } else {
                name.setText(((Stock)item.getEquipment()).getSymbol());
            }
        } else if (item.getEquipment() instanceof Currency) {
            text_amount = text_amount + "€";
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
