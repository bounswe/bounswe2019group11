package com.papel.ui.profile;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.papel.R;
import com.papel.data.User;

import java.util.ArrayList;

public class FollowerAdapter extends BaseAdapter {

    private Context  context;
    private ArrayList<User> users;

    public FollowerAdapter(Context context, ArrayList<User> users) {
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
            view = LayoutInflater.from(context).inflate(R.layout.follow_row,viewGroup,false);
        }

        User user = users.get(i);

        TextView fullName = view.findViewById(R.id.follow_user_full_name);
        fullName.setText(user.getName() + " " + user.getSurname());


        return view;
    }
}
