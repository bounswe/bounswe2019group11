package com.papel.ui.recommendations;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.papel.Constants;
import com.papel.R;
import com.papel.data.Article;
import com.papel.data.User;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;


public class NearbyUserFragment extends Fragment {

    private ListView listView;
    private NearbyUserAdapter adapter;

    public NearbyUserFragment() {
        // Required empty public constructor
    }



    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_nearby_user, container, false);
        listView = view.findViewById(R.id.listView);
        fetchNearbyUsers(getContext());
        return view;

    }

    private void fetchNearbyUsers(final Context context) {
        Log.d("Info","fetch nearby users");
        RequestQueue requestQueue = Volley.newRequestQueue(context);
        String url = Constants.LOCALHOST + Constants.RECOMMENDATION + "nearby-users";
        StringRequest request = new StringRequest(Request.Method.GET, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONArray responseArray = new JSONArray(response);
                    ArrayList<User> users = new ArrayList<>();
                    for (int i = 0; i<responseArray.length(); i++) {
                        JSONObject jsonObject = responseArray.getJSONObject(i);
                        String userId = jsonObject.getString("_id");
                        String userName = jsonObject.getString("name");
                        String userSurname = jsonObject.getString("surname");
                        users.add(new User(userId,userName,userSurname));
                    }
                    adapter = new NearbyUserAdapter(context,users);
                    listView.setAdapter(adapter);
                    adapter.notifyDataSetChanged();
                } catch (JSONException e) {
                    e.printStackTrace();
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

        requestQueue.add(request);
    }


}
