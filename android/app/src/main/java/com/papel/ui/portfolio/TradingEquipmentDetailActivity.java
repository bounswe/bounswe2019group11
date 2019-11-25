package com.papel.ui.portfolio;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.graphics.Paint;
import android.os.Bundle;
import android.util.Log;
import android.view.ContextMenu;
import android.view.LayoutInflater;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
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
import com.papel.ListViewAdapter;
import com.papel.R;
import com.papel.data.Comment;
import com.papel.data.Currency;
import com.papel.data.Stock;
import com.papel.data.TradingEquipment;
import com.papel.data.User;
import com.papel.ui.profile.ProfileActivity;
import com.papel.ui.utils.DialogHelper;
import com.papel.ui.utils.ResponseParser;

import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;

public class TradingEquipmentDetailActivity extends AppCompatActivity {


    private ArrayList<CandleEntry> dailyPoints = new ArrayList<>();
    private ArrayList<CandleEntry> weeklyPoints = new ArrayList<>();
    private ArrayList<CandleEntry> monthlyPoints = new ArrayList<>();
    private ArrayList<Calendar> dailyDates = new ArrayList<>();
    private ArrayList<Calendar> weeklyDates = new ArrayList<>();
    private ArrayList<Calendar> monthlyDates = new ArrayList<>();
    private int chartType = Constants.DAILY_CHART;

    private CandleStickChart chart;
    private Spinner dropdown;
    private ProgressBar progressBar;
    private TextView value;
    private TextView totalPredCountTextView;
    private TextView percentagePredTextView;
    private TextView noCommentTextView;
    private ProgressBar predProgressBar;
    private RadioGroup predictionRadioGroup;
    private RadioButton increaseRadioButton;
    private RadioButton decreaseRadioButton; private ListView commentList;
    private EditText commentEditText;
    private ImageButton addCommentButton;
    private ColorStateList cl_green;
    private ColorStateList cl_red;

    private Stock stock;
    private Currency currency;

    private String[] chartItems;
    private ArrayList<Object> comments;
    private ListViewAdapter adapter;

    final SimpleDateFormat dailyDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US);
    final SimpleDateFormat monthlyDateFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.US);


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_trading_equipment_detail);
        final View header = getLayoutInflater().inflate(R.layout.trading_equipment_header, null);

        Intent intent = getIntent();
        TradingEquipment tradingEquipment = intent.getParcelableExtra("TradingEquipment");

        noCommentTextView = header.findViewById(R.id.no_comment_textview);
        totalPredCountTextView = header.findViewById(R.id.prediction_vote_count_textview);
        percentagePredTextView = header.findViewById(R.id.prediction_vote_textview);
        predProgressBar = header.findViewById(R.id.prediction_progressbar);
        predictionRadioGroup = header.findViewById(R.id.prediction_radio_group);
        increaseRadioButton = header.findViewById(R.id.increase_radioButton);
        decreaseRadioButton = header.findViewById(R.id.decrease_radioButton);
        cl_green = ColorStateList.valueOf(getResources().getColor(R.color.colorPrimary));
        cl_red = ColorStateList.valueOf(getResources().getColor(android.R.color.holo_red_dark));

        if (tradingEquipment instanceof Stock) {
            stock = (Stock) tradingEquipment;
            setTitle(stock.getSymbol());
            noCommentTextView.setVisibility(View.VISIBLE);
            percentagePredTextView.setText(R.string.no_predictions);
            predProgressBar.setProgress(0);
            String text = "0 Voted";
            totalPredCountTextView.setText(text);
        } else if (tradingEquipment instanceof Currency) {
            currency = (Currency) tradingEquipment;
            setTitle(currency.getName());
        }

        predictionRadioGroup.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                if (checkedId == R.id.increase_radioButton) {
                    makePrediction(getApplicationContext(), 1);
                } else if (checkedId == R.id.decrease_radioButton) {
                    makePrediction(getApplicationContext(), -1);
                }
            }
        });

        commentEditText = (EditText) header.findViewById(R.id.te_comment_edittext);
        addCommentButton = (ImageButton) header.findViewById(R.id.te_add_comment_button);
        commentList = findViewById(R.id.trading_equipment_comments);
        commentList.addHeaderView(header);
        if (stock != null) {
            comments = new ArrayList<Object>();
            adapter = new ListViewAdapter(getApplicationContext(), comments);
            commentList.setAdapter(adapter);
        } else {
            getTradingEqFromEndpoint(getApplicationContext());
        }

        value = header.findViewById(R.id.value);
        String valueText = "";
        if (stock != null) {
            valueText = stock.getPrice() + "$";
        } else if (currency != null) {
            valueText = currency.getRate() + "$";
        }
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
        chartItems = new String[]{"Daily", "Monthly"};
        if (currency != null) {
            chartItems = new String[]{"Daily", "Weekly", "Monthly"};
        }
        ArrayAdapter<String> dropdownAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, chartItems);
        dropdown.setAdapter(dropdownAdapter);


        dropdown.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                String clicked = chartItems[i];
                Log.d("Dropdown", "Selected: " + clicked);

                if (stock != null) {
                    if (clicked.equals("Daily")) {
                        chartType = Constants.DAILY_CHART;
                    } else if (clicked.equals("Monthly")) {
                        chartType = Constants.MONTHLY_CHART;
                    }
                    showChart();
                } else if (currency != null) {
                    if (clicked.equals("Daily")) {
                        chartType = Constants.DAILY_CHART;
                    } else if (clicked.equals("Weekly")) {
                        chartType = Constants.WEEKLY_CHART;
                    } else if (clicked.equals("Monthly")) {
                        chartType = Constants.MONTHLY_CHART;
                    }
                    fetchCurrencyChartData(currency.getCode());
                }


            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {
                Log.d("Dropdown", "Nothing selected");
            }
        });


        progressBar = findViewById(R.id.progressBar);

        chart = header.findViewById(R.id.chart);
        chartSetup();

        if (stock != null) {
            fetchStockChartData(stock.getId());
        }

        commentList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                final Intent profileIntent = new Intent(getApplicationContext(), ProfileActivity.class);
                Comment clickedComment = (Comment) adapter.getItem(i - 1);
                profileIntent.putExtra("UserId", clickedComment.getAuthorId());
                startActivity(profileIntent);
            }
        });

        addCommentButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (commentEditText.getText() != null) {
                    String content = commentEditText.getText().toString().trim();
                    addTradingEqComment(getApplicationContext(), content);
                }

            }
        });
        registerForContextMenu(commentList);
    }

    private void fetchCurrencyChartData(String code) {

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        String url = "";
        if (chartType == Constants.DAILY_CHART) {
            url = Constants.LOCALHOST + Constants.CURRENCY + code + "/" + Constants.INTRADAY;
            dailyPoints.clear();
            dailyDates.clear();
        } else if (chartType == Constants.WEEKLY_CHART) {
            url = Constants.LOCALHOST + Constants.CURRENCY + code + "/" + Constants.LAST_WEEK;
            weeklyPoints.clear();
            weeklyDates.clear();
        } else if (chartType == Constants.MONTHLY_CHART) {
            url = Constants.LOCALHOST + Constants.CURRENCY + code + "/" + Constants.LAST_MONTH;
            monthlyPoints.clear();
            monthlyDates.clear();
        }

        StringRequest request = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject responseJSON = new JSONObject(response);
                    JSONObject rates = new JSONObject();
                    if (chartType == Constants.DAILY_CHART) {
                        rates = responseJSON.getJSONObject("intradayRates");
                    } else if (chartType == Constants.WEEKLY_CHART) {
                        rates = responseJSON.getJSONObject("lastWeek");
                    } else if (chartType == Constants.MONTHLY_CHART) {
                        rates = responseJSON.getJSONObject("lastMonth");
                    }

                    Iterator<String> keysIterator = rates.keys();

                    ArrayList<String> keys = new ArrayList<>();
                    while (keysIterator.hasNext()) {
                        keys.add(keysIterator.next());
                    }

                    int index = 0;
                    Log.d("Info", "Key Size: " + keys.size());
                    for (int i = keys.size() - 1; i >= 0; i--) {
                        String key = keys.get(i);
                        //Log.d("Response", "Key: " + key);
                        JSONObject object = rates.getJSONObject(key);

                        double high = object.getDouble("2. high");
                        double low = object.getDouble("3. low");
                        double open = object.getDouble("1. open");
                        double close = object.getDouble("4. close");

                        if (chartType == Constants.DAILY_CHART) {
                            dailyPoints.add(new CandleEntry(index, (float) high, (float) low, (float) open, (float) close));

                            try {
                                Date date = dailyDateFormat.parse(key);
                                Calendar calendar = Calendar.getInstance();
                                calendar.setTime(date);
                                dailyDates.add(calendar);
                            } catch (ParseException e) {
                                e.printStackTrace();
                            }
                        } else if (chartType == Constants.WEEKLY_CHART) {
                            weeklyPoints.add(new CandleEntry(index, (float) high, (float) low, (float) open, (float) close));

                            try {
                                Date date = monthlyDateFormat.parse(key);
                                Calendar calendar = Calendar.getInstance();
                                calendar.setTime(date);
                                weeklyDates.add(calendar);
                            } catch (ParseException e) {
                                e.printStackTrace();
                            }
                        } else if (chartType == Constants.MONTHLY_CHART) {
                            monthlyPoints.add(new CandleEntry(index, (float) high, (float) low, (float) open, (float) close));

                            try {
                                Date date = monthlyDateFormat.parse(key);
                                Calendar calendar = Calendar.getInstance();
                                calendar.setTime(date);
                                monthlyDates.add(calendar);
                            } catch (ParseException e) {
                                e.printStackTrace();
                            }
                        }
                        index += 1;

                        showChart();

                        progressBar.setVisibility(View.INVISIBLE);
                        value.setVisibility(View.VISIBLE);
                        dropdown.setVisibility(View.VISIBLE);
                        chart.setVisibility(View.VISIBLE);
                        commentList.setVisibility(View.VISIBLE);
                    }

                } catch (JSONException e) {
                    e.printStackTrace();
                    DialogHelper.showBasicDialog(TradingEquipmentDetailActivity.this, "Error", "We couldn't get detail of the trading equipment.Please try again.", null);
                    progressBar.setVisibility(View.INVISIBLE);
                    commentList.setVisibility(View.VISIBLE);
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                DialogHelper.showBasicDialog(TradingEquipmentDetailActivity.this, "Error", "We couldn't get detail of the trading equipment.Please try again.", null);
                progressBar.setVisibility(View.INVISIBLE);
                commentList.setVisibility(View.VISIBLE);
            }
        });

        requestQueue.add(request);
    }


    private void fetchStockChartData(String id) {
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

                    for (int i = dailyKeys.size() - 1; i >= 0; i--) {
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
                            DialogHelper.showBasicDialog(TradingEquipmentDetailActivity.this, "Error", "We couldn't get detail of the trading equipment.Please try again.", null);
                            progressBar.setVisibility(View.INVISIBLE);
                            commentList.setVisibility(View.VISIBLE);
                        }
                    }

                    for (int i = monthlyKeys.size() - 1; i >= 0; i--) {
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
                            DialogHelper.showBasicDialog(TradingEquipmentDetailActivity.this, "Error", "We couldn't get detail of the trading equipment.Please try again.", null);
                            progressBar.setVisibility(View.INVISIBLE);
                            commentList.setVisibility(View.VISIBLE);
                        }
                    }

                    showChart();

                    progressBar.setVisibility(View.INVISIBLE);
                    value.setVisibility(View.VISIBLE);
                    dropdown.setVisibility(View.VISIBLE);
                    chart.setVisibility(View.VISIBLE);
                    commentList.setVisibility(View.VISIBLE);

                } catch (JSONException e) {
                    e.printStackTrace();
                    DialogHelper.showBasicDialog(TradingEquipmentDetailActivity.this, "Error", "We couldn't get detail of the trading equipment.Please try again.", null);
                    progressBar.setVisibility(View.INVISIBLE);
                    commentList.setVisibility(View.VISIBLE);

                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                DialogHelper.showBasicDialog(TradingEquipmentDetailActivity.this, "Error", "We couldn't get detail of the trading equipment.Please try again.", null);
                progressBar.setVisibility(View.INVISIBLE);
                commentList.setVisibility(View.VISIBLE);

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
        } else if (chartType == Constants.MONTHLY_CHART) {
            set = new CandleDataSet(monthlyPoints, "DataSet 1");
            xAxis.setValueFormatter(new ChartTimeValueFormatter(monthlyDates, chartType));
        } else {
            set = new CandleDataSet(weeklyPoints, "DataSet 1");
            xAxis.setValueFormatter(new ChartTimeValueFormatter(weeklyDates, chartType));
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

    private void getTradingEqFromEndpoint(final Context context) {
        if (currency != null) {
            final String currencyUrl = Constants.LOCALHOST + Constants.CURRENCY + currency.getCode();
            RequestQueue requestQueue = Volley.newRequestQueue(context);
            StringRequest currencyRequest = new StringRequest(Request.Method.GET, currencyUrl, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {
                    try {
                        JSONObject object = new JSONObject(response);
                        Currency c = ResponseParser.parseCurrency(object);
                        currency.setComments(c.getComments());
                        setComments(currency.getComments());
                        currency.setIncreaseCount(c.getIncreaseCount());
                        currency.setDecreaseCount(c.getDecreaseCount());
                        currency.setUserVote(c.getUserVote());
                        updatePrediction(c.getUserVote());
                    } catch (JSONException exp) {
                        exp.printStackTrace();
                    }

                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {

                }
            }){
                @Override
                public Map<String, String> getHeaders() throws AuthFailureError {
                    Map<String, String> headers = new HashMap<String, String>();
                    headers.put("Authorization", "Bearer " + User.getInstance().getToken());
                    return headers;
                }
            };

            requestQueue.add(currencyRequest);
        }

    }

    private void setComments(ArrayList<Comment> comments_list) {
        comments = new ArrayList<>();
        comments.addAll(comments_list);
        adapter = new ListViewAdapter(getApplicationContext(), comments);
        commentList.setAdapter(adapter);
        if(currency.getComments().size() == 0){
            noCommentTextView.setVisibility(View.VISIBLE);
        }else{
            noCommentTextView.setVisibility(View.GONE);
        }
        adapter.notifyDataSetChanged();
    }

    private void addTradingEqComment(final Context context, final String content) {
        if (currency != null) {
            RequestQueue requestQueue = Volley.newRequestQueue(context);
            String url = Constants.LOCALHOST + Constants.CURRENCY + currency.getCode() + "/" + Constants.COMMENT;
            final JSONObject jsonBody = new JSONObject();
            try {
                jsonBody.put("body", content);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            StringRequest request = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {
                    getTradingEqFromEndpoint(context);
                    commentEditText.setText("");
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    NetworkResponse networkResponse = error.networkResponse;
                    if (networkResponse != null) {
                        String data = new String(networkResponse.data);
                        try {
                            JSONObject errorObject = new JSONObject(data);
                            String message = errorObject.getString("message");
                            Toast.makeText(context, "There was an error when posting your comment: " + message, Toast.LENGTH_LONG).show();
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }) {
                @Override
                public byte[] getBody() throws AuthFailureError {
                    return jsonBody.toString().getBytes();
                }

                @Override
                public String getBodyContentType() {
                    return "application/json; charset=utf-8";
                }

                @Override
                public Map<String, String> getHeaders() throws AuthFailureError {
                    Map<String, String> headers = new HashMap<String, String>();
                    headers.put("Authorization", "Bearer " + User.getInstance().getToken());
                    return headers;
                }
            };
            requestQueue.add(request);
        }

    }

    private void editTradingEqComment(final Context context, final String commentId, final String content) {
        if (currency != null) {
            RequestQueue requestQueue = Volley.newRequestQueue(context);
            String url = Constants.LOCALHOST + Constants.CURRENCY + currency.getCode() + "/" + Constants.COMMENT + commentId;
            final JSONObject jsonBody = new JSONObject();
            try {
                jsonBody.put("body", content);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            StringRequest request = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {
                    getTradingEqFromEndpoint(context);
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    NetworkResponse networkResponse = error.networkResponse;
                    if (networkResponse != null) {
                        String data = new String(networkResponse.data);
                        try {
                            JSONObject errorObject = new JSONObject(data);
                            String message = errorObject.getString("message");
                            Toast.makeText(context, "There was an error when editing your comment: " + message, Toast.LENGTH_LONG).show();
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }) {
                @Override
                public byte[] getBody() throws AuthFailureError {
                    return jsonBody.toString().getBytes();
                }

                @Override
                public String getBodyContentType() {
                    return "application/json; charset=utf-8";
                }

                @Override
                public Map<String, String> getHeaders() throws AuthFailureError {
                    Map<String, String> headers = new HashMap<String, String>();
                    headers.put("Authorization", "Bearer " + User.getInstance().getToken());
                    return headers;
                }
            };
            requestQueue.add(request);
        }
    }

    private void deleteTradingEqComment(final Context context, final String commentId) {
        if (currency != null) {
            RequestQueue requestQueue = Volley.newRequestQueue(context);
            String url = Constants.LOCALHOST + Constants.CURRENCY + currency.getCode() + "/" + Constants.COMMENT + commentId;
            StringRequest request = new StringRequest(
                    Request.Method.DELETE, url,
                    new Response.Listener<String>() {

                        @Override
                        public void onResponse(String response) {
                            Toast.makeText(context, "Comment deleted.", Toast.LENGTH_SHORT).show();
                            getTradingEqFromEndpoint(context);
                        }
                    }, new Response.ErrorListener() {

                @Override
                public void onErrorResponse(VolleyError error) {
                    NetworkResponse response = error.networkResponse;
                    if (response != null && response.data != null) {
                        JSONObject jsonObject = null;
                        String errorMessage = null;

                        switch (response.statusCode) {
                            case 400:
                                errorMessage = new String(response.data);
                                try {
                                    jsonObject = new JSONObject(errorMessage);
                                    String serverResponseMessage = (String) jsonObject.get("message");
                                    Toast.makeText(getApplicationContext(), "" + serverResponseMessage, Toast.LENGTH_LONG).show();
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                        }
                    }
                }
            }) {
                @Override
                public Map<String, String> getHeaders() throws AuthFailureError {
                    Map<String, String> headers = new HashMap<String, String>();
                    headers.put("Authorization", "Bearer " + User.getInstance().getToken());
                    return headers;
                }
            };
            requestQueue.add(request);
        }

    }

    @Override
    public void onCreateContextMenu(ContextMenu menu, View v, ContextMenu.ContextMenuInfo menuInfo) {
        super.onCreateContextMenu(menu, v, menuInfo);
        AdapterView.AdapterContextMenuInfo info = (AdapterView.AdapterContextMenuInfo) menuInfo;
        if (v.getId() == R.id.trading_equipment_comments && ((Comment) comments.get(info.position - 1)).getAuthorId().equals(User.getInstance().getId())) {
            MenuInflater inflater = getMenuInflater();
            inflater.inflate(R.menu.article_comments_menu, menu);
        }
    }

    @Override
    public boolean onContextItemSelected(MenuItem item) {
        AdapterView.AdapterContextMenuInfo info = (AdapterView.AdapterContextMenuInfo) item.getMenuInfo();
        final Comment c = (Comment) comments.get(info.position - 1);
        if (item.getItemId() == R.id.edit) {
            LayoutInflater li = LayoutInflater.from(getApplicationContext());
            View promptsView = li.inflate(R.layout.edit_comment_prompt, null);
            AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(this);
            alertDialogBuilder.setView(promptsView);
            final EditText userInput = promptsView.findViewById(R.id.editTextDialogUserInput);
            userInput.setText(c.getContent());
            alertDialogBuilder
                    .setCancelable(true)
                    .setPositiveButton("OK",
                            new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int id) {
                                    editTradingEqComment(getApplicationContext(),
                                            c.getCommentId(), userInput.getText().toString().trim());
                                }
                            })
                    .setNegativeButton("Cancel",
                            new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int id) {
                                    dialog.cancel();
                                }
                            });

            AlertDialog alertDialog = alertDialogBuilder.create();
            alertDialog.show();
            return true;
        } else if (item.getItemId() == R.id.delete) {
            deleteTradingEqComment(getApplicationContext(), c.getCommentId());
            return true;
        }
        return false;
    }

    private void makePrediction(final Context context, final int prediction) {
        String prediction_url;
        if (prediction == 1) {
            prediction_url = "/predict-increase";
        } else if (prediction == -1) {
            prediction_url = "/predict-decrease";
        } else {
            prediction_url = "/clear-prediction";
        }
        if (currency != null) {
            RequestQueue requestQueue = Volley.newRequestQueue(context);
            String url = Constants.LOCALHOST + Constants.CURRENCY + currency.getCode() + prediction_url;
            StringRequest request = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
                @Override
                public void onResponse(String response) {
                    getTradingEqFromEndpoint(context);
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    NetworkResponse networkResponse = error.networkResponse;
                    if (networkResponse != null) {
                        String data = new String(networkResponse.data);
                        try {
                            JSONObject errorObject = new JSONObject(data);
                            String message = errorObject.getString("message");
                            Toast.makeText(context, "There was an error when making prediction: " + message, Toast.LENGTH_LONG).show();
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }) {

                @Override
                public Map<String, String> getHeaders() throws AuthFailureError {
                    Map<String, String> headers = new HashMap<String, String>();
                    headers.put("Authorization", "Bearer " + User.getInstance().getToken());
                    return headers;
                }
            };
            requestQueue.add(request);
        }

    }
    private void updatePrediction(int userVote){
        if(currency!=null){
            if(userVote==1){
                increaseRadioButton.setChecked(true);
                decreaseRadioButton.setChecked(false);
            }else if(userVote==-1){
                decreaseRadioButton.setChecked(true);
                increaseRadioButton.setChecked(false);
            }else{
                decreaseRadioButton.setChecked(false);
                increaseRadioButton.setChecked(false);
            }
            String text = ""+currency.getPredictionVoteCount()+" Voted";
            totalPredCountTextView.setText(text);
            if(currency.getPredictionVoteCount() != 0) {
                int percentageIncrease = 100 * currency.getIncreaseCount() / currency.getPredictionVoteCount();
                int percentageDecrease = 100 * currency.getDecreaseCount() / currency.getPredictionVoteCount();
                if (percentageIncrease >= percentageDecrease) {
                    text = "" + percentageIncrease + "% Increases";
                    percentagePredTextView.setTextColor(getResources().getColor(R.color.colorPrimary));
                    predProgressBar.setProgress(percentageIncrease);
                    predProgressBar.setProgressTintList(cl_green);
                } else {
                    text = "" + percentageDecrease + "% Decreases";
                    percentagePredTextView.setTextColor(getResources().getColor(android.R.color.holo_red_dark));
                    predProgressBar.setProgress(percentageDecrease);
                    predProgressBar.setProgressTintList(cl_red);
                }
                percentagePredTextView.setText(text);
            }else{
                percentagePredTextView.setText(R.string.no_predictions);
                predProgressBar.setProgress(0);
            }
        }


    }
}
