package com.papel;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Filter;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.papel.R;
import com.papel.data.Currency;
import com.papel.data.PapelNotification;
import com.papel.data.Stock;
import com.papel.data.TradingEquipment;

import java.util.ArrayList;

public class NotificationAdapter extends BaseAdapter {

    private Context context;
    private ArrayList<PapelNotification> notification;

    public NotificationAdapter(Context context, ArrayList<PapelNotification> notification) {
        this.context = context;
        this.notification = notification;
    }


    @Override
    public int getCount() {
        return notification.size();
    }

    @Override
    public PapelNotification getItem(int i) {
        return notification.get(i);
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

        PapelNotification item = notification.get(i);

        TextView name = view.findViewById(R.id.trading_equipment_name);
        TextView type = view.findViewById(R.id.trading_equipment_type_name);
        type.setVisibility(View.GONE);

        name.setText(item.getNotifMessage());

        return view;
    }
}
