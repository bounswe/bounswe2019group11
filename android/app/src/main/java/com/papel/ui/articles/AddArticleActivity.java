package com.papel.ui.articles;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import java.util.Calendar;
import java.util.Date;
import com.papel.R;

public class AddArticleActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_article);
        final EditText titleEditText = findViewById(R.id.article_title_edittext);
        final EditText contentEditText = findViewById(R.id.article_content_edittext);
        Button addArticleButton = findViewById(R.id.article_add_button);

        addArticleButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //TODO: Add article
                String title = titleEditText.getText().toString();
                String content = contentEditText.getText().toString();

                if(title.isEmpty()){
                    Toast.makeText(getApplicationContext(), R.string.title_empty_error, Toast.LENGTH_SHORT).show();
                    return;
                }else if(content.isEmpty()){
                    Toast.makeText(getApplicationContext(), R.string.content_empty_error, Toast.LENGTH_SHORT).show();
                    return;
                }
                Date currentTime = Calendar.getInstance().getTime();
                final Intent intent = new Intent(getApplicationContext(), ArticlesFragment.class);
                startActivity(intent);
            }
        });
    }
}
