package com.papel.ui.articles;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

import com.papel.R;
import com.papel.data.Annotation;

public class ShowAnnotationActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_show_annotation);

        Intent intent = getIntent();
        Annotation annotation = intent.getParcelableExtra("Annotation");
        String annotatedText = intent.getStringExtra("AnnotatedText");

        TextView annotatedTextView = findViewById(R.id.annotatedText);
        annotatedTextView.setText(annotatedText);

    }
}
