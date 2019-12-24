import React, { useState } from 'react';
import $ from 'jquery';
import {app_config} from "../config";
import CurencyCh from "./CurrencyCh";

const url = app_config.api_url + "/";

function CurrencyTable({code,timeRange }) {
  const [currency, setCurrency] = useState(0);


  if(!currency){$.get(url+"currency/"+code+"/"+timeRange, (data) => {
    setCurrency( data)  });
  }

  var currencyLastValues = {};
  if(timeRange=="last-month"){
    currencyLastValues = currency.lastMonth;

    //console.log("deneme" + currency.lastMonth);
  }else if(timeRange=="last-week"){
    currencyLastValues = currency.lastWeek;
  }else if(timeRange=="last-100"){
    currencyLastValues = currency.dailyRates;
  }
  var key;
  var days = [], months=[],years=[];
  var values = [];
  var closeDayValues = [];
  for (key in currencyLastValues) {
    if (currencyLastValues.hasOwnProperty(key)) {


      var date = key;
      var day = date.split("-")[2],
      month =  date.split("-")[1],
      year =  date.split("-")[0];

      days.push(day);
      months.push(month);
      years.push(year);
      values.push(currencyLastValues[key]);

    }
  }

  //console.log(days)
  //console.log(months)
  //console.log(years)
  //console.log(currencyLastValues)
  var i;
  for (i = 0; i < values.length; i++) {
    for(key in values[i] ){
      if(key.includes("4")){closeDayValues.push(values[i][key] );}
    } ;
  }


 return (
    <CurencyCh currency={code} year={years} month={months} day={days} value={closeDayValues}></CurencyCh >


  );
}

export default CurrencyTable;
