package com.papel;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import com.papel.data.Article;
import com.papel.data.Comment;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;


public class ListViewAdapter extends android.widget.BaseAdapter {

    Context context;
    ArrayList<Object> data;
    private static LayoutInflater inflater = null;

    public ListViewAdapter(Context context, ArrayList<Object> data) {
        this.context = context;
        this.data = data;
        inflater = (LayoutInflater) context
                .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    }

    @Override
    public int getCount() {
        return data.size();
    }

    @Override
    public Object getItem(int position) {
        return data.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View vi = convertView;
        if (vi == null)
            vi = inflater.inflate(R.layout.custom_list_row, null);

        TextView titleText = (TextView) vi.findViewById(R.id.item_title);
        TextView contentText = (TextView) vi.findViewById(R.id.item_content);
        TextView authorText = (TextView) vi.findViewById(R.id.item_author);
        TextView dateText = (TextView) vi.findViewById(R.id.item_date);
        ImageView authorImageView = (ImageView) vi.findViewById(R.id.item_user_pic);

        String strDate="", title="", content="", author="";

        if (data.get(position) instanceof Article){
            Article item = (Article) data.get(position);
            strDate = item.getDate();
            title = item.getTitle();
            content = item.getContent();
            author = item.getAuthor();
        }else if (data.get(position) instanceof Comment){
            Comment item = (Comment) data.get(position);
            strDate = item.getDate();
            content = item.getContent();
            author = item.getAuthor();
        }

        dateText.setText(strDate);
        titleText.setText(title);
        contentText.setText(content);
        authorText.setText(author);

        return vi;
    }
}