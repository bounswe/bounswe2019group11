package com.papel.ui.portfolio;

import android.util.Log;

import com.github.mikephil.charting.components.AxisBase;
import com.github.mikephil.charting.formatter.ValueFormatter;

import java.util.ArrayList;
import java.util.Calendar;

public class ChartTimeValueFormatter extends ValueFormatter {

    private ArrayList<Calendar> dates;

    public ChartTimeValueFormatter(ArrayList<Calendar> dates) {
        this.dates = dates;
    }

    @Override
    public String getAxisLabel(float value, AxisBase axis) {
        Calendar current = dates.get((int) value);
        int h = current.get(Calendar.HOUR_OF_DAY);
        int m = current.get(Calendar.MINUTE);

        return addPadding(h) + " : " + addPadding(m);
    }

    private String addPadding(int x) {
        if (x <= 9) {
            return "0" + x;
        }
        return x + "";
    }
}
