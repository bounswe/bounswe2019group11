package com.papel.ui.portfolio;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.graphics.Color;
import android.graphics.Paint;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.Spinner;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.github.mikephil.charting.charts.CandleStickChart;
import com.github.mikephil.charting.components.Legend;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.CandleData;
import com.github.mikephil.charting.data.CandleDataSet;
import com.github.mikephil.charting.data.CandleEntry;
import com.papel.Constants;
import com.papel.R;
import com.papel.data.Stock;
import com.papel.data.TradingEquipment;
import com.papel.ui.utils.DialogHelper;

import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.ListIterator;
import java.util.Locale;

public class TradingEquipmentDetailActivity extends AppCompatActivity {


    private ArrayList<CandleEntry> dailyPoints = new ArrayList<>();
    private ArrayList<CandleEntry> monthlyPoints = new ArrayList<>();
    private ArrayList<Calendar> dailyDates = new ArrayList<>();
    private ArrayList<Calendar> monthlyDates = new ArrayList<>();
    private int chartType = Constants.DAILY_CHART;

    private CandleStickChart chart;
    private Spinner dropdown;
    private ProgressBar progressBar;
    private TextView value;
    private ListView commentList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_trading_equipment_detail);
        final View header = getLayoutInflater().inflate(R.layout.trading_equipment_header, null);

        Intent intent = getIntent();
        Stock tradingEquipment = intent.getParcelableExtra("TradingEquipment");
        setTitle(tradingEquipment.getSymbol());

        commentList = findViewById(R.id.trading_equipment_comments);
        commentList.addHeaderView(header);
        ArrayList<String> list = new ArrayList<>();
        ArrayAdapter<String> adapter =
                new ArrayAdapter<String>(this, android.R.layout.simple_list_item_1, list);
        commentList.setAdapter(adapter);

        value = header.findViewById(R.id.value);
        String valueText = tradingEquipment.getPrice() + "$";
        value.setText(valueText);

        try {
            // TODO Test HERE
            ActionBar actionBar = getSupportActionBar();
            actionBar.setHomeButtonEnabled(true);
            actionBar.setDisplayHomeAsUpEnabled(true);
        } catch (NullPointerException exp) {
            exp.printStackTrace();
        }

        dropdown = header.findViewById(R.id.spinner);
        final String[] items = new String[]{"Daily", "Monthly"};
        ArrayAdapter<String> dropdownAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, items);
        dropdown.setAdapter(dropdownAdapter);


        dropdown.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                String clicked = items[i];
                Log.d("Dropdown","Selected: " + clicked);
                if(clicked.equals("Daily")) {
                    chartType = Constants.DAILY_CHART;
                } else if (clicked.equals("Monthly")){
                    chartType = Constants.MONTHLY_CHART;
                }
                showChart();
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {
                Log.d("Dropdown","Nothing selected");
            }
        });


        progressBar = findViewById(R.id.progressBar);

        chart = header.findViewById(R.id.chart);
        chartSetup();

        fetchChartData(tradingEquipment.getId());

    }

    private void fetchChartData(String id) {
        final SimpleDateFormat dailyDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US);
        final SimpleDateFormat monthlyDateFormat = new SimpleDateFormat("yyyy-MM-dd",Locale.US);

        Log.d("Info","Trading Equipment Detail: " + id);

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String url = Constants.LOCALHOST + Constants.STOCK + id;
        StringRequest request = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject responseJSON = new JSONObject(response);

                    JSONObject daily = responseJSON.getJSONObject("dailyPrice");
                    JSONObject monthly = responseJSON.getJSONObject("monthlyPrice");

                    Iterator<String> dailyKeysIterator = daily.keys();
                    Iterator<String> monthlyKeysIterator = monthly.keys();

                    ArrayList<String> dailyKeys = new ArrayList<>();
                    while (dailyKeysIterator.hasNext()) {
                        dailyKeys.add(dailyKeysIterator.next());
                    }
                    ArrayList<String> monthlyKeys = new ArrayList<>();
                    while (monthlyKeysIterator.hasNext()) {
                        monthlyKeys.add(monthlyKeysIterator.next());
                    }

                    int dailyIndex = 0;
                    int monthlyIndex = 0;

                    for(int i = dailyKeys.size() - 1; i>=0;i--) {
                        String key = dailyKeys.get(i);
                        Log.d("Response", "Daily key: " + key);
                        JSONObject object = daily.getJSONObject(key);

                        double high = object.getDouble("2. high");
                        double low = object.getDouble("3. low");
                        double open = object.getDouble("1. open");
                        double close = object.getDouble("4. close");

                        dailyPoints.add(new CandleEntry(dailyIndex, (float) high, (float) low, (float) open, (float) close));
                        dailyIndex += 1;

                        try {
                            Date date = dailyDateFormat.parse(key);
                            Calendar calendar = Calendar.getInstance();
                            calendar.setTime(date);
                            dailyDates.add(calendar);
                        } catch (ParseException e) {
                            e.printStackTrace();
                            DialogHelper.showBasicDialog(TradingEquipmentDetailActivity.this,"Error","We couldn't get detail of the trading equipment.Please try again.",null);
                            progressBar.setVisibility(View.INVISIBLE);
                        }
                    }

                    for (int i = monthlyKeys.size() - 1; i>=0;i--) {
                        String key = monthlyKeys.get(i);
                        Log.d("Response", "Monthly key: " + key);
                        JSONObject object = monthly.getJSONObject(key);

                        double high = object.getDouble("2. high");
                        double low = object.getDouble("3. low");
                        double open = object.getDouble("1. open");
                        double close = object.getDouble("4. close");

                        monthlyPoints.add(new CandleEntry(monthlyIndex, (float) high, (float) low, (float) open, (float) close));
                        monthlyIndex += 1;

                        try {
                            Date date = monthlyDateFormat.parse(key);
                            Calendar calendar = Calendar.getInstance();
                            calendar.setTime(date);
                            monthlyDates.add(calendar);
                        } catch (ParseException e) {
                            e.printStackTrace();
                            DialogHelper.showBasicDialog(TradingEquipmentDetailActivity.this,"Error","We couldn't get detail of the trading equipment.Please try again.",null);
                            progressBar.setVisibility(View.INVISIBLE);
                        }
                    }

                    showChart();

                    progressBar.setVisibility(View.INVISIBLE);
                    value.setVisibility(View.VISIBLE);
                    dropdown.setVisibility(View.VISIBLE);
                    chart.setVisibility(View.VISIBLE);

                } catch (JSONException e) {
                    e.printStackTrace();
                    DialogHelper.showBasicDialog(TradingEquipmentDetailActivity.this,"Error","We couldn't get detail of the trading equipment.Please try again.",null);
                    progressBar.setVisibility(View.INVISIBLE);
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                DialogHelper.showBasicDialog(TradingEquipmentDetailActivity.this,"Error","We couldn't get detail of the trading equipment.Please try again.",null);
                progressBar.setVisibility(View.INVISIBLE);
            }
        });

        requestQueue.add(request);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            onBackPressed();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private void showChart() {
        XAxis xAxis = chart.getXAxis();

        CandleDataSet set;
        if (chartType == Constants.DAILY_CHART) {
            set = new CandleDataSet(dailyPoints, "DataSet 1");
            xAxis.setValueFormatter(new ChartTimeValueFormatter(dailyDates, chartType));
        } else {
            set = new CandleDataSet(monthlyPoints, "DataSet 1");
            xAxis.setValueFormatter(new ChartTimeValueFormatter(monthlyDates, chartType));
        }

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
    }

    private void chartSetup() {
        chart.setHighlightPerDragEnabled(true);
        chart.setDrawBorders(true);
        chart.setBorderColor(getResources().getColor(R.color.black_overlay));
        chart.getDescription().setEnabled(false);
        chart.requestDisallowInterceptTouchEvent(true);

        YAxis rightAxis = chart.getAxisRight();
        rightAxis.setDrawLabels(false);


        XAxis xAxis = chart.getXAxis();
        xAxis.setGranularity(1f);
        xAxis.setGranularityEnabled(true);
        xAxis.setAvoidFirstLastClipping(true);
        xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);

        Legend l = chart.getLegend();
        l.setEnabled(false);
    }
}
