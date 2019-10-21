package com.papel.ui.events;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.papel.Constants;
import com.papel.ListViewAdapter;
import com.papel.R;
import com.papel.data.Event;
import com.papel.ui.utils.DialogHelper;
import com.papel.ui.utils.ResponseParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class EventsFragment extends Fragment {

    private ListView eventListView;
    private ArrayList<Object> events;
    private ListViewAdapter adapter;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_events, container, false);

        eventListView = root.findViewById(R.id.article_list);

        events = new ArrayList<Object>();
        adapter = new ListViewAdapter(getActivity().getApplicationContext(), events);
        eventListView.setAdapter(adapter);

        return root;
    }

    private void getEvents(final Context context) {
        RequestQueue requestQueue = Volley.newRequestQueue(context);
        String url = Constants.LOCALHOST + Constants.EVENT;
        StringRequest request = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONArray responseArray = new JSONArray(response);
                    for(int i = 0;i<responseArray.length(); i++) {
                        JSONObject object = responseArray.getJSONObject(i);
                        Event event = ResponseParser.parseEvent(object);

                        if (event != null) {
                            events.add(event);
                        }
                    }
                    adapter.notifyDataSetChanged();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                DialogHelper.showBasicDialog(context,"Error","We couldn't load the events. Please try again.",null);
            }
        });

        requestQueue.add(request);

    }
}