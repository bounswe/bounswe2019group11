import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import $ from 'jquery';
const url = "http://ec2-18-197-152-183.eu-central-1.compute.amazonaws.com:3000/";

function CurrencyTable({code,timeRange }) {
  const [currency, setCurrency] = useState(0);
  
  if(!currency){$.get(url+"currency/"+code+"/"+timeRange, (data) => {
    setCurrency( data)  });
  }
 
  var key, key1;
  var days = [];
  var temp = [];
  var values = [];
  var cloeses = [];
  for (key in currency.lastWeek) {
    if (currency.lastWeek.hasOwnProperty(key)) {
      
      days.push(key)
      var counter=0;
      values.push(currency.lastWeek[key])
    
    }
  }

  console.log(days)
  console.log(values)
  var i;
  for (i = 0; i < values.length; i) {
    for(key in values[i]){
      cloeses.push(values[i][key] );
    } ;
  }
  console.log(cloeses)


 return (
      <Card.Title style={{textAlign:"center"}}>
            <hr/>
            <Card.Title><b>{code } </b></Card.Title>
            <Card.Text>{currency.name}</Card.Text>
        </Card.Title>
      
  );
}

export default CurrencyTable;

