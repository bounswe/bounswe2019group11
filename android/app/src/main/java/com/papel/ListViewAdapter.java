package com.papel;
import android.content.Context;
import android.graphics.Typeface;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RatingBar;
import android.widget.TextView;
import com.papel.data.Article;
import com.papel.data.Comment;
import com.papel.data.Event;
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
        TextView currency = (TextView) vi.findViewById(R.id.item_currency_textView);
        ImageView authorImageView = (ImageView) vi.findViewById(R.id.item_user_pic);
        RatingBar rankRatingBar = (RatingBar) vi.findViewById(R.id.event_rank_ratingBar);

        String strDate = "", title = "", content = "", author = "";
        double rank= 5 ;

        if (data.get(position) instanceof Article){
            Article item = (Article) data.get(position);
            title = item.getTitle();
            content = "\n" + item.getBody();
            author = item.getAuthorName();
            strDate = item.getDate();
        }else if (data.get(position) instanceof Comment){
            Comment item = (Comment) data.get(position);
            strDate = item.getDate();
            if(item.isEdited()){
                strDate = item.getLastEditDate();
            }
            content = item.getContent();
            title = item.getAuthorName();
            contentText.setTextSize(14);
        }else if(data.get(position) instanceof Event){
            Event item = (Event) data.get(position);
            strDate = item.getDate();
            content = item.getBody();
            title = item.getTitle();
            author = item.getCountry();
            rank = item.getRank();
            authorImageView.setVisibility(View.GONE);
            rankRatingBar.setRating((float)rank);
            rankRatingBar.setVisibility(View.VISIBLE);
            contentText.setVisibility(View.GONE);
            currency.setVisibility(View.VISIBLE);
            currency.setText(content);
        }

        dateText.setText(strDate);
        titleText.setText(title);
        contentText.setText(content);
        authorText.setText(author);

        return vi;
    }
}