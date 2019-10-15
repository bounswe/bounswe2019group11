package com.papel.ui.articles;

import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ListView;
import android.widget.Toast;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.google.android.material.snackbar.Snackbar;
import com.papel.ListViewAdapter;
import com.papel.R;
import com.papel.data.Article;

import java.util.ArrayList;

public class ArticlesViewModel extends ViewModel {

    private MutableLiveData<String> mText;

    public ArticlesViewModel() {
        mText = new MutableLiveData<>();
        mText.setValue("Welcome to Papel");

    }
    public LiveData<String> getText() {
        return mText;
    }
}