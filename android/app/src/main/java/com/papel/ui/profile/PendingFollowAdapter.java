package com.papel.ui.profile;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Button;
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
import com.papel.Constants;
import com.papel.R;
import com.papel.data.User;
import com.papel.ui.utils.DialogHelper;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class PendingFollowAdapter extends BaseAdapter {

    private Context context;
    private ArrayList<User> users;
    private boolean isFollowerPending;

    public PendingFollowAdapter(Context context, ArrayList<User> users,boolean isFollowerPending) {
        this.context = context;
        this.users = users;
        this.isFollowerPending = isFollowerPending;
    }

    @Override
    public int getCount() {
        return users.size();
    }

    @Override
    public Object getItem(int i) {
        return users.get(i);
    }

    @Override
    public long getItemId(int i) {
        return i;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        if(view == null) {
            view = LayoutInflater.from(context).inflate(R.layout.follow_pending_row,viewGroup,false);
        }

        final User user = users.get(i);

        TextView fullName = view.findViewById(R.id.follow_user_full_name);
        fullName.setText(user.getName() + " " + user.getSurname());

        final Button acceptButton = view.findViewById(R.id.accept_button);
        final Button declineButton = view.findViewById(R.id.decline_button);

        if (isFollowerPending) {
           acceptButton.setOnClickListener(new View.OnClickListener() {
               @Override
               public void onClick(View view) {
                   Log.d("Info","Accept Button");
                   sendRequest(user.getId(),true,acceptButton,declineButton);
               }
           });
           declineButton.setOnClickListener(new View.OnClickListener() {
               @Override
               public void onClick(View view) {
                   Log.d("Info","Decline Button");
                   sendRequest(user.getId(),false,acceptButton,declineButton);
               }
           });
        } else {
            acceptButton.setVisibility(View.INVISIBLE);
            declineButton.setVisibility(View.INVISIBLE);
        }
        return view;
    }

    private void sendRequest(String userId, boolean accept, final Button acceptButton, final Button declineButton) {
        RequestQueue requestQueue = Volley.newRequestQueue(context);
        String url = "";
        if (accept) {
            url = Constants.LOCALHOST + Constants.PROFILE + userId + "/" + Constants.ACCEPT;
        } else {
            url = Constants.LOCALHOST + Constants.PROFILE + userId + "/" + Constants.DECLINE;
        }
        StringRequest request = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject responseObject = new JSONObject(response);
                    String msg = responseObject.getString("msg");
                    Toast.makeText(context,msg,Toast.LENGTH_LONG).show();
                    // TODO change the button
                    acceptButton.setVisibility(View.INVISIBLE);
                    declineButton.setVisibility(View.INVISIBLE);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                DialogHelper.showBasicDialog(context, "Error", "We couldn't send your request.Please try again!", null);
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
