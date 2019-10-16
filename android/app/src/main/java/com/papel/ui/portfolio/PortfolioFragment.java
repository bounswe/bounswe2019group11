package com.papel.ui.portfolio;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProviders;

import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.papel.R;
import com.papel.data.Portfolio;

import java.util.ArrayList;

public class PortfolioFragment extends Fragment {

    private ArrayList<Portfolio> portfolios = new ArrayList<>();
    private PortfolioListViewAdapter portfolioListViewAdapter;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             final ViewGroup container, Bundle savedInstanceState) {

        View root = inflater.inflate(R.layout.fragment_portfolio, container, false);

        ListView portfolioListView = root.findViewById(R.id.portfolio_list);
        FloatingActionButton addPortfolio = root.findViewById(R.id.add_portfolio);


        Portfolio portfolio1 = new Portfolio("First Portfolio");
        Portfolio portfolio2 = new Portfolio("Second Portfolio");
        portfolios.add(portfolio1);
        portfolios.add(portfolio2);

        portfolioListViewAdapter = new PortfolioListViewAdapter(container.getContext(), portfolios);
        portfolioListView.setAdapter(portfolioListViewAdapter);

        final Intent intent = new Intent(getActivity(), PortfolioDetailActivity.class);


        portfolioListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                Log.d("Portfolio", i + " is clicked");
                intent.putExtra("PortfolioName", portfolioListViewAdapter.getItem(i).getName());
                startActivity(intent);
            }
        });

        portfolioListView.setOnItemLongClickListener(new AdapterView.OnItemLongClickListener() {
            @Override
            public boolean onItemLongClick(AdapterView<?> adapterView, View view, int i, long l) {
                Log.d("Portfolio", i + " is long clicked");
                showUpdateDialog(container.getContext(), i);
                // Return true to indicate that we have consumed the event.
                return true;
            }
        });


        addPortfolio.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d("Portfolio", "Add portfolio");
                showInputDialog(container.getContext());
            }
        });

        return root;
    }

    private void showUpdateDialog(Context context, final int index) {
        AlertDialog.Builder dialogBuilder = new AlertDialog.Builder(context);
        dialogBuilder.setTitle("Update portfolio");
        dialogBuilder.setMessage("Type new name of the portfolio");
        final EditText nameInput = new EditText(context);
        nameInput.setPadding(getResources().getDimensionPixelOffset(R.dimen.dialog_padding), 0,
                getResources().getDimensionPixelOffset(R.dimen.dialog_padding), 0);
        nameInput.setText(portfolioListViewAdapter.getItem(index).getName());
        dialogBuilder.setView(nameInput);
        dialogBuilder.setNeutralButton("Update", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                String portfolioName = nameInput.getText().toString();

                Log.d("Dialog", "Update button is pressed.Name: " + portfolioName);

                portfolioListViewAdapter.getItem(index).setName(portfolioName);

                portfolioListViewAdapter.notifyDataSetChanged();
            }
        });

        AlertDialog dialog = dialogBuilder.create();
        dialog.show();
    }


    private void showInputDialog(Context context) {
        AlertDialog.Builder dialogBuilder = new AlertDialog.Builder(context);
        dialogBuilder.setTitle("Add portfolio");
        dialogBuilder.setMessage("Type name of the porfolio");
        final EditText nameInput = new EditText(context);
        nameInput.setPadding(getResources().getDimensionPixelOffset(R.dimen.dialog_padding), 0,
                getResources().getDimensionPixelOffset(R.dimen.dialog_padding), 0);
        dialogBuilder.setView(nameInput);
        dialogBuilder.setNeutralButton("Add", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                Log.d("Dialog", "Add button is pressed.Name: " + nameInput.getText().toString());

                String portfolioName = nameInput.getText().toString();
                Portfolio p = new Portfolio(portfolioName);
                portfolios.add(p);

                portfolioListViewAdapter.notifyDataSetChanged();
            }
        });


        AlertDialog dialog = dialogBuilder.create();
        dialog.show();

    }
}