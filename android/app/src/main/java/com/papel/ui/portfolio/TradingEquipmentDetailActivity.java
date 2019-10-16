package com.papel.ui.portfolio;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.graphics.Color;
import android.graphics.Paint;
import android.os.Bundle;
import android.view.MenuItem;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Spinner;

import com.github.mikephil.charting.charts.CandleStickChart;
import com.github.mikephil.charting.components.Legend;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.CandleData;
import com.github.mikephil.charting.data.CandleDataSet;
import com.github.mikephil.charting.data.CandleEntry;
import com.papel.R;

import java.util.ArrayList;

public class TradingEquipmentDetailActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_trading_equipment_detail);

        Intent intent = getIntent();
        String tradingEquipmentName = intent.getStringExtra("TradingEquipmentName");
        setTitle(tradingEquipmentName);

        Spinner dropdown = findViewById(R.id.spinner);
        String[] items = new String[]{"1", "2", "3"};
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, items);
        dropdown.setAdapter(adapter);


        CandleStickChart chart = findViewById(R.id.chart);
        chart.setHighlightPerDragEnabled(true);
        chart.setDrawBorders(true);
        chart.setBorderColor(getResources().getColor(R.color.black_overlay));
        chart.getDescription().setEnabled(false);
        chart.requestDisallowInterceptTouchEvent(true);

        YAxis leftAxis = chart.getAxisLeft();
        YAxis rightAxis = chart.getAxisRight();
        rightAxis.setDrawLabels(false);


        XAxis xAxis = chart.getXAxis();
        xAxis.setGranularity(1f);
        xAxis.setGranularityEnabled(true);
        xAxis.setAvoidFirstLastClipping(true);
        xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);

        Legend l = chart.getLegend();
        l.setEnabled(false);

        ArrayList<CandleEntry> points = new ArrayList<>();
        // x, high, low, open, close
        points.add(new CandleEntry(0, 233.9400f, 233.8000f, 233.8500f, 233.9000f));
        points.add(new CandleEntry(1, 233.9700f, 233.8100f, 233.9100f, 233.7000f));
        points.add(new CandleEntry(2, 233.8400f,  233.5950f, 233.8350f, 223.84f));
        points.add(new CandleEntry(3, 233.7500f, 233.7000f, 233.7000f, 233.7000f));
        points.add(new CandleEntry(4, 234.0600f, 233.7000f, 233.7045f, 233.9600f));
        points.add(new CandleEntry(5, 233.9800f, 233.8200f, 233.9600f, 233.8867f));
        points.add(new CandleEntry(6, 233.9000f,  233.8200f, 233.8699f, 233.8800f));


        CandleDataSet set = new CandleDataSet(points, "DataSet 1");
        //set.setColor(Color.rgb(80, 80, 80));
        //set.setShadowColor(getResources().getColor(R.color.black_overlay));
        //set.setShadowWidth(0.8f);
        set.setDecreasingColor(getResources().getColor(R.color.chart_red));
        set.setDecreasingPaintStyle(Paint.Style.FILL);
        set.setIncreasingColor(getResources().getColor(R.color.chart_green));
        set.setIncreasingPaintStyle(Paint.Style.FILL);
        set.setNeutralColor(Color.LTGRAY);
        set.setDrawValues(true);
        set.setValueTextSize(8);
        
        // create a data object with the datasets
        CandleData data = new CandleData(set);

        // set data
        chart.setData(data);
        chart.invalidate();

        try {
            // TODO Test HERE
            ActionBar actionBar = getSupportActionBar();
            actionBar.setHomeButtonEnabled(true);
            actionBar.setDisplayHomeAsUpEnabled(true);
        } catch (NullPointerException exp) {
            exp.printStackTrace();
        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if(item.getItemId() == android.R.id.home) {
            //this.finish();
            onBackPressed();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
