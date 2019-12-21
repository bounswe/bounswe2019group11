package com.papel.ui.articles;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.papel.R;
import com.papel.data.AnnotationBody;

import java.util.ArrayList;

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
        AnnotationBody currentAnnotationBody = this.body.get(i);
        commentBody.setText(currentAnnotationBody.getValue());

        return view;
    }
}
