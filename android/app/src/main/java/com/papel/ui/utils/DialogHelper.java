package com.papel.ui.utils;

import android.app.AlertDialog;
import android.content.Context;

public class DialogHelper {
    public static void showBasicDialog(Context context,String title, String message) {
        AlertDialog.Builder dialogBuilder = new AlertDialog.Builder(context);
        dialogBuilder.setTitle(title);
        dialogBuilder.setMessage(message);
        dialogBuilder.setNeutralButton("Ok",null);

        AlertDialog dialog = dialogBuilder.create();
        dialog.show();
    }
}
