package com.papel;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Filter;
import android.widget.TextView;

import com.papel.data.Article;
import com.papel.data.Currency;
import com.papel.data.Event;
import com.papel.data.Stock;
import com.papel.data.User;

import java.util.ArrayList;

public class SearchAdapter extends BaseAdapter {

    private Context context;
    private ArrayList<Object> data;
    private ArrayList<Object> filteredData;

    public SearchAdapter(Context context, ArrayList<Object> data) {
        this.context = context;
        this.data = data;
        this.filteredData = data;
    }


    @Override
    public int getCount() {
        return filteredData.size();
    }

    @Override
    public Object getItem(int i) {
        return filteredData.get(i);
    }

    @Override
    public long getItemId(int i) {
        return i;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        if (view == null) {
            view = LayoutInflater.from(context).inflate(R.layout.trading_equipment_row, viewGroup, false);
        }

        Object item = filteredData.get(i);

        TextView name = view.findViewById(R.id.trading_equipment_name);
        TextView type = view.findViewById(R.id.trading_equipment_type_name);

        if (item instanceof Stock) {
            type.setText(R.string.stock);
            String parity_name = ((Stock) item).getSymbol() + " / USD";
            name.setText(parity_name);

        } else if (item instanceof Currency) {
            type.setText(R.string.currency);
            String parity_name = ((Currency) item).getCode() + " / USD";
            name.setText(parity_name);

        } else if (item instanceof User) {
            type.setText("USER");
            String name_surname = ((User) item).getName() + " " + ((User) item).getSurname();
            name.setText(name_surname);

        } else if (item instanceof Event) {
            type.setText("EVENT");
            name.setText(((Event) item).getTitle());

        } else if (item instanceof Article) {
            type.setText("ARTICLE");
            name.setText(((Article) item).getTitle());
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
            ArrayList<Object> suggestions = new ArrayList<>();

            if (constraint == null || constraint.length() == 0) {
                suggestions.addAll(data);
            } else {
                String filterPattern = constraint.toString().toLowerCase().trim().replaceAll(" +", " ");;
                for (int i = 0; i < data.size(); i++) {
                    Object item = data.get(i);
                    if (item instanceof Stock) {
                        if (((Stock) item).getName().toLowerCase().contains(filterPattern)
                                || ((Stock) item).getSymbol().toLowerCase().contains(filterPattern)) {
                            suggestions.add(item);
                        }
                    } else if (item instanceof Currency) {
                        if (((Currency) item).getName().toLowerCase().contains(filterPattern)
                                || ((Currency) item).getCode().toLowerCase().contains(filterPattern)) {
                            suggestions.add(item);
                        }
                    } else if (item instanceof User) {
                        User tmp = (User) item;
                        if ((tmp.getName() + " " + tmp.getSurname()).toLowerCase().contains(filterPattern)
                                || tmp.getRole().toLowerCase().contains(filterPattern)
                                || tmp.getEmail().toLowerCase().contains(filterPattern)) {
                            suggestions.add(item);
                        }
                    } else if (item instanceof Event) {
                        Event tmp = (Event) item;
                        if(tmp.getBody().toLowerCase().contains(filterPattern)
                                || tmp.getCountry().toLowerCase().contains(filterPattern)
                                || tmp.getTitle().toLowerCase().contains(filterPattern)){
                            suggestions.add(item);
                        }
                    }

                }
            }

            results.values = suggestions;
            results.count = suggestions.size();

            return results;
        }

        @Override
        protected void publishResults(CharSequence constraint, FilterResults results) {
            filteredData = (ArrayList<Object>) results.values;
            notifyDataSetChanged();
        }

        @Override
        public CharSequence convertResultToString(Object resultValue) {
            return ((Stock) resultValue).getSymbol();
        }
    };
}
