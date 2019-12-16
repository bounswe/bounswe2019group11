package com.papel.data;

import java.util.ArrayList;

public class UserInvestments {

    private String id;
    private ArrayList<Investment> investments;

    public UserInvestments(String id, ArrayList<Investment> investments) {
        this.id = id;
        this.investments = investments;
    }

    public ArrayList<Investment> getInvestments() {
        return investments;
    }

    public void setInvestments(ArrayList<Investment> investments) {
        this.investments = investments;
    }
}
