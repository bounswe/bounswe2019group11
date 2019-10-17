package com.papel.ui.portfolio;

import android.util.Log;

import com.github.mikephil.charting.components.AxisBase;
import com.github.mikephil.charting.formatter.ValueFormatter;
import com.papel.Constants;

import java.util.ArrayList;
import java.util.Calendar;

public class ChartTimeValueFormatter extends ValueFormatter {

    private ArrayList<Calendar> dates;
    private int chartType;

    public ChartTimeValueFormatter(ArrayList<Calendar> dates, int chartType) {
        this.dates = dates;
        this.chartType = chartType;
    }

    @Override
    public String getAxisLabel(float value, AxisBase axis) {
        Calendar current = dates.get((int) value);
        if (this.chartType == Constants.DAILY_CHART) {
            int h = current.get(Calendar.HOUR_OF_DAY);
            int m = current.get(Calendar.MINUTE);

            return addPadding(h) + " : " + addPadding(m);
        }
        int d = current.get(Calendar.DAY_OF_MONTH);
        int m = current.get(Calendar.MONTH);

        return addPadding(d) + " - " + addPadding(m);
    }

    private String addPadding(int x) {
        if (x <= 9) {
            return "0" + x;
        }
        return x + "";
    }
}
