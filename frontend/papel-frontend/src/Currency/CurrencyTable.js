import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import $ from 'jquery';
import CurencyCh from "./CurencyCh";
const url = "http://ec2-18-197-152-183.eu-central-1.compute.amazonaws.com:3000/";

function CurrencyTable({code,timeRange }) {
  const [currency, setCurrency] = useState(0);
  
  if(!currency){$.get(url+"currency/"+code+"/"+timeRange, (data) => {
    setCurrency( data)  });
  }
 
  var key, key1;
  var days = [], months=[],years=[];
  var temp = [];
  var values = [];
  var closeDayValues = [];
  for (key in currency.lastWeek) {
    if (currency.lastWeek.hasOwnProperty(key)) {
      
     
      var date = key;
      var day = date.split("-")[2],
      month =  date.split("-")[1],
      year =  date.split("-")[0]; var counter=0;
      
      days.push(day);
      months.push(month);
      years.push(year);
      values.push(currency.lastWeek[key]);
    
    }
  }

  console.log(days)
  console.log(months)
  console.log(years)
  var i;
  for (i = 0; i < values.length; i++) {
    for(key in values[i] ){
      if(key.includes("4")){closeDayValues.push(values[i][key] );}
    } ;
  }
  

 return (
 /*
 <div>       </div>
*/<div><CurencyCh currency={code} year={years} month={months} day={days} value={closeDayValues}></CurencyCh >
             </div>
  );
}

export default CurrencyTable;

