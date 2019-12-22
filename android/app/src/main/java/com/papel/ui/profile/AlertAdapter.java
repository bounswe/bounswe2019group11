package com.papel.ui.profile;

import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.papel.R;
import com.papel.data.Alert;
import com.papel.data.User;

import java.util.ArrayList;

public class AlertAdapter extends BaseAdapter {

    private Context context;
    private ArrayList<Alert> alerts;

    public AlertAdapter(Context context, ArrayList<Alert> alerts) {
        this.context = context;
        this.alerts = alerts;
    }

    @Override
    public int getCount() {
        return alerts.size();
    }

    @Override
    public Object getItem(int i) {
        return alerts.get(i);
    }

    @Override
    public long getItemId(int i) {
        return i;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        if(view == null) {
            view = LayoutInflater.from(context).inflate(R.layout.alert_row,viewGroup,false);
        }

        Alert alert = alerts.get(i);

        TextView alertName = view.findViewById(R.id.alertName);
        TextView alertRate = view.findViewById(R.id.alertRate);

        if (alert.getType() == 0) {
            // Currency case
            alertName.setText(alert.getCurrencyCode());
        } else {
            // Stock case
            alertName.setText(alert.getStockId());
        }

        alertRate.setText(String.valueOf(alert.getRate()));
        if (alert.getDirection() == 1) {
            // Cıkarsa haber ver
            alertName.setTextColor(Color.GREEN);
            alertRate.setTextColor(Color.GREEN);
        } else {
            // Duserse haber ver
            alertName.setTextColor(Color.RED);
            alertName.setTextColor(Color.RED);
        }

        return view;
    }
}
