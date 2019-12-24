import React from 'react';
import {useParams} from 'react-router-dom';
import $ from 'jquery';
import {Card} from 'react-bootstrap'
import CanvasJSReact from '../canvasjs/canvasjs.react';

import { useState } from 'react';
import {getRequest, postRequest} from '../helpers/request'
import {app_config} from "../config";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const url = app_config.api_url + "/";

function CurrencyCharts({currency}) {
  const [currencyRate, setCurrencyRate] = useState(0);
  if(!currencyRate){$.get(url+"currency/"+currency+"/last-month", (data) => {
    setCurrencyRate( data)  });
  }
  //console.log(currencyRate);
  var currencyLastValues = {};
  currencyLastValues = currencyRate.lastMonth;
  var key;
  var days = [], months=[], years=[];
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
      if(key.includes("4")){closeDayValues.push(parseFloat(values[i][key]) );
        //console.log(closeDayValues);
      }
    };
  }
  //<CurencyCh currency={code} year={years} month={months} day={days} value={closeDayValues}></CurencyCh >
  var data = [];
  for (let index = 0; index < years.length; index++) {
    data[index] = {x: new Date(years[index],months[index]-1,days[index]),	y: closeDayValues[index]}
    //console.log(data[index]);
  }

  const options = {
    theme: "light1", // "light1", "dark1", "dark2"
    animationEnabled: true,
    zoomEnabled: true,
    title: {
      text:"USD/"+currency
    },
    axisY: {
      includeZero: false
    },
    data: [{
      type: "area",
      color : "#3DA544",
      dataPoints: data
    }]
  }
    return (
      <Card>
        <div className="row">
            <CanvasJSChart options={options}/>
        </div>
      </Card>
    );
}

export default CurrencyCharts;
