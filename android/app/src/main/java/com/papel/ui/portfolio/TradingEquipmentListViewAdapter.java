package com.papel.ui.portfolio;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.papel.R;
import com.papel.data.TradingEquipment;

import java.util.ArrayList;

public class TradingEquipmentListViewAdapter extends BaseAdapter {

    private Context context;
    private ArrayList<TradingEquipment> tradingEquipments;

    public TradingEquipmentListViewAdapter(Context context, ArrayList<TradingEquipment> tradingEquipments) {
        this.context = context;
        this.tradingEquipments = tradingEquipments;
    }


    @Override
    public int getCount() {
        return tradingEquipments.size();
    }

    @Override
    public TradingEquipment getItem(int i) {
        return tradingEquipments.get(i);
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

        TradingEquipment item = tradingEquipments.get(i);

        TextView name = view.findViewById(R.id.trading_equipment_name);

        name.setText(item.getSymbol());

        return view;
    }
}
