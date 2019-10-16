package com.papel.ui.portfolio;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.graphics.Color;
import android.graphics.Paint;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.widget.ArrayAdapter;
import android.widget.Spinner;

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

import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.Locale;

public class TradingEquipmentDetailActivity extends AppCompatActivity {


    private ArrayList<CandleEntry> points = new ArrayList<>();
    private ArrayList<Calendar> dates = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_trading_equipment_detail);

        Intent intent = getIntent();
        String tradingEquipmentName = intent.getStringExtra("TradingEquipmentName");
        setTitle(tradingEquipmentName);

        try {
            // TODO Test HERE
            ActionBar actionBar = getSupportActionBar();
            actionBar.setHomeButtonEnabled(true);
            actionBar.setDisplayHomeAsUpEnabled(true);
        } catch (NullPointerException exp) {
            exp.printStackTrace();
        }

        Spinner dropdown = findViewById(R.id.spinner);
        String[] items = new String[]{"1", "2", "3"};
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, items);
        dropdown.setAdapter(adapter);

        final CandleStickChart chart = findViewById(R.id.chart);
        chartSetup(chart);

        /*String response = "{\n" +
                "    \"Meta Data\": {\n" +
                "        \"1. Information\": \"Intraday (5min) open, high, low, close prices and volume\",\n" +
                "        \"2. Symbol\": \"MSFT\",\n" +
                "        \"3. Last Refreshed\": \"2019-10-16 15:45:00\",\n" +
                "        \"4. Interval\": \"5min\",\n" +
                "        \"5. Output Size\": \"Compact\",\n" +
                "        \"6. Time Zone\": \"US/Eastern\"\n" +
                "    },\n" +
                "    \"Time Series (5min)\": {\n" +
                "        \"2019-10-16 15:45:00\": {\n" +
                "            \"1. open\": \"140.2500\",\n" +
                "            \"2. high\": \"140.2800\",\n" +
                "            \"3. low\": \"140.1300\",\n" +
                "            \"4. close\": \"140.1400\",\n" +
                "            \"5. volume\": \"169385\"\n" +
                "        },\n" +
                "        \"2019-10-16 15:40:00\": {\n" +
                "            \"1. open\": \"140.2050\",\n" +
                "            \"2. high\": \"140.3000\",\n" +
                "            \"3. low\": \"140.1949\",\n" +
                "            \"4. close\": \"140.2500\",\n" +
                "            \"5. volume\": \"131806\"\n" +
                "        },\n" +
                "        \"2019-10-16 15:35:00\": {\n" +
                "            \"1. open\": \"140.1450\",\n" +
                "            \"2. high\": \"140.2399\",\n" +
                "            \"3. low\": \"140.1200\",\n" +
                "            \"4. close\": \"140.2050\",\n" +
                "            \"5. volume\": \"197968\"\n" +
                "        },\n" +
                "        \"2019-10-16 15:30:00\": {\n" +
                "            \"1. open\": \"140.1449\",\n" +
                "            \"2. high\": \"140.2200\",\n" +
                "            \"3. low\": \"140.1200\",\n" +
                "            \"4. close\": \"140.1500\",\n" +
                "            \"5. volume\": \"167890\"\n" +
                "        }}}";

        try{
            JSONObject responseJSON = new JSONObject(response);
            //Log.d("JSON", responseJSON.getString("Meta Data"));
            JSONObject timeSeries = responseJSON.getJSONObject("Time Series (5min)");
            Iterator<String> timeSeriesKeys = timeSeries.keys();
            while (timeSeriesKeys.hasNext()) {
                String key = timeSeriesKeys.next();
                JSONObject object = timeSeries.getJSONObject(key);
                Log.d("JSON","Key: " + key);
                Log.d("JSON", "(double)Open: " + object.getDouble("1. open"));

                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US);
                try {
                    Date date = dateFormat.parse(key);
                    Calendar calendar = Calendar.getInstance();
                    calendar.setTime(date);
                    int hour = calendar.get(Calendar.HOUR);
                    int hour_of_day = calendar.get(Calendar.HOUR_OF_DAY);
                    Log.d("Date","Hour: " + hour);
                    Log.d("Date", "Hour of day: " + hour_of_day);
                } catch (ParseException e) {
                    e.printStackTrace();
                }
                //Log.d("JSON","Key: " + timeSeriesKeys.next());
            }
        } catch (JSONException e) {
            e.printStackTrace();
        } */

        final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US);

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        StringRequest request = new StringRequest(Request.Method.GET, Constants.CHART_URL, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject responseJSON = new JSONObject(response);
                    JSONObject timeSeries = responseJSON.getJSONObject("Time Series (5min)");
                    Iterator<String> timeSeriesKeys = timeSeries.keys();
                    int index = 0;
                    while (timeSeriesKeys.hasNext()) {
                        String key = timeSeriesKeys.next();
                        Log.d("Response", "Key: " + key);
                        JSONObject object = timeSeries.getJSONObject(key);

                        double high = object.getDouble("2. high");
                        double low = object.getDouble("3. low");
                        double open = object.getDouble("1. open");
                        double close = object.getDouble("4. close");

                        points.add(new CandleEntry(index, (float) high, (float) low, (float) open, (float) close));
                        index += 1;

                        try {
                            Date date = dateFormat.parse(key);
                            Calendar calendar = Calendar.getInstance();
                            calendar.setTime(date);
                            dates.add(calendar);
                        } catch (ParseException e) {
                            e.printStackTrace();
                        }


                    }
                    Log.d("Reverse", "High: " + points.get(0).getHigh());
                    showChart(chart);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("Error", "Status code: " + error.networkResponse.statusCode);
            }
        });

        requestQueue.add(request);

    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            //this.finish();
            onBackPressed();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private void showChart(CandleStickChart chart) {
        XAxis xAxis = chart.getXAxis();
        xAxis.setValueFormatter(new ChartTimeValueFormatter(dates));

        CandleDataSet set = new CandleDataSet(points, "DataSet 1");
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

    private void chartSetup(CandleStickChart chart) {
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
