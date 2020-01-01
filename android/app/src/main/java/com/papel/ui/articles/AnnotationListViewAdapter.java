package com.papel.ui.articles;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.papel.R;
import com.papel.data.AnnotationBody;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

public class AnnotationListViewAdapter extends BaseAdapter {

    private Context context;
    private ArrayList<AnnotationBody> body;

    public AnnotationListViewAdapter(Context context, ArrayList<AnnotationBody> body) {
        this.context = context;
        this.body = body;
    }

    @Override
    public int getCount() {
        return this.body.size();
    }

    @Override
    public AnnotationBody getItem(int i) {
        return this.body.get(i);
    }

    @Override
    public long getItemId(int i) {
        return i;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        if(view == null) {
            view = LayoutInflater.from(context).inflate(R.layout.annotation_comment,viewGroup,false);
        }

        TextView commentBody = view.findViewById(R.id.commentBody);
        TextView commentUser = view.findViewById(R.id.commentUser);
        TextView commentTime = view.findViewById(R.id.commentTime);
        AnnotationBody currentAnnotationBody = this.body.get(i);

        String userFullName = currentAnnotationBody.getUserName() + " " + currentAnnotationBody.getUserSurname();
        commentBody.setText(currentAnnotationBody.getValue());
        commentUser.setText(userFullName);

        try {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ", Locale.US);
            Date formattedDate = formatter.parse(currentAnnotationBody.getCreateTime().replaceAll("Z$", "+0000"));
            SimpleDateFormat prettyFormatter = new SimpleDateFormat("dd MMM yy • HH:mm a", Locale.US);
            String formattedTime = prettyFormatter.format(formattedDate);
            commentTime.setText(formattedTime);
        } catch (ParseException e ) {
            e.printStackTrace();
        }


        return view;
    }
}
