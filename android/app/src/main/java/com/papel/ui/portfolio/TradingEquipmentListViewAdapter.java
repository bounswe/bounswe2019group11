package com.papel.ui.portfolio;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Filter;
import android.widget.TextView;

import com.papel.R;
import com.papel.data.Currency;
import com.papel.data.Stock;
import com.papel.data.TradingEquipment;

import java.util.ArrayList;

public class TradingEquipmentListViewAdapter extends BaseAdapter {

    private Context context;
    private ArrayList<TradingEquipment> tradingEquipments;
    private ArrayList<TradingEquipment> filteredData;
    private boolean showFullname;

    public TradingEquipmentListViewAdapter(Context context, ArrayList<TradingEquipment> tradingEquipments,boolean showFullname) {
        this.context = context;
        this.tradingEquipments = tradingEquipments;
        this.filteredData = tradingEquipments;
        this.showFullname = showFullname;
    }


    @Override
    public int getCount() {
        return filteredData.size();
    }

    @Override
    public TradingEquipment getItem(int i) {
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

        TradingEquipment item = filteredData.get(i);

        TextView name = view.findViewById(R.id.trading_equipment_name);
        TextView type = view.findViewById(R.id.trading_equipment_type_name);

        if (item instanceof Stock) {
            type.setText(R.string.stock);
            String parity_name;
            if (showFullname) {
                parity_name = ((Stock)item).getName() + "/ USD";
                name.setText(parity_name);
            } else {
                parity_name = ((Stock)item).getSymbol() + "/ USD";
                name.setText(parity_name);
            }
        } else if (item instanceof Currency) {
            type.setText(R.string.currency);
            String parity_name;
            if (showFullname) {
                parity_name = ((Currency)item).getName() + "/ USD";
                name.setText(parity_name);
            } else {
                parity_name = ((Currency)item).getCode() + "/ USD";
                name.setText(parity_name);
            }
        }

        return view;
    }

    public Filter getFilter() {
        return filter;
    }

    private Filter filter = new Filter() {
        @Override
        protected FilterResults performFiltering(CharSequence constraint) {
            FilterResults results = new FilterResults();
            ArrayList<TradingEquipment> suggestions = new ArrayList<>();

            if (constraint == null || constraint.length() == 0) {
                suggestions.addAll(tradingEquipments);
            } else {
                String filterPattern = constraint.toString().toLowerCase().trim();
                for (int i = 0; i<tradingEquipments.size(); i++) {
                    TradingEquipment item = tradingEquipments.get(i);
                    if (item instanceof Stock) {
                        if(((Stock)item).getName().toLowerCase().contains(filterPattern)
                                || ((Stock)item).getSymbol().toLowerCase().contains(filterPattern)) {
                            suggestions.add(item);
                        }
                    } else if (item instanceof Currency) {
                        if(((Currency)item).getName().toLowerCase().contains(filterPattern)
                                || ((Currency)item).getCode().toLowerCase().contains(filterPattern)) {
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
            filteredData = (ArrayList<TradingEquipment>) results.values;
            notifyDataSetChanged();
        }

        @Override
        public CharSequence convertResultToString(Object resultValue) {
            return ((Stock) resultValue).getSymbol();
        }
    };
}
