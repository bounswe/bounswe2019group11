package com.papel.ui.recommendations;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.papel.R;
import com.papel.data.User;

import java.util.ArrayList;

public class NearbyUserAdapter extends BaseAdapter {

    private Context context;
    private ArrayList<User> users;

    public NearbyUserAdapter(Context context, ArrayList<User> users) {
        this.context = context;
        this.users = users;
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
            view = LayoutInflater.from(context).inflate(R.layout.nearby_user_row,viewGroup,false);
        }

        User user = users.get(i);

        TextView userName = view.findViewById(R.id.userName);
        String fullName = user.getName() + " " + user.getSurname();
        userName.setText(fullName);

        return view;
    }
}
