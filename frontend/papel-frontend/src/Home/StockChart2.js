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

function StockChart2({stock}) {
  const [currency, setCurrency] = useState(0);
  if(!currency){$.get(url+"currency/EUR/last-month", (data) => {
    setCurrency( data)  });
  }
  console.log(currency);
  var currencyLastValues = {};
  currencyLastValues = currency.lastMonth;
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
  console.log(days)
  console.log(months)
  console.log(years)
  console.log(currencyLastValues)
  var i;
  for (i = 0; i < values.length; i++) {
    for(key in values[i] ){
      if(key.includes("4")){closeDayValues.push(parseFloat(values[i][key]) ); console.log(closeDayValues);}
    } ;
  }
  //<CurencyCh currency={code} year={years} month={months} day={days} value={closeDayValues}></CurencyCh >
  var data = [];
  for (let index = 0; index < years.length; index++) {
    data[index] = {x: new Date(years[index],months[index]-1,days[index]),	y: closeDayValues[index]}
    console.log(data[index]);
  }

  const options = {
    theme: "light1", // "light1", "dark1", "dark2"
    animationEnabled: true,
    zoomEnabled: true,
    title: {
      text:"USD/EUR"
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
  /*
    const options = {
      animationEnabled: true,
      title:{
        text: "Walt Disney Company (The) Common Stock"
      },
      axisY : {
        title: stock+"/USD",
        includeZero: false
      },
      axisX : {
        title: "Date",
        includeZero: false
      },
      toolTip: {
        shared: true
      },
      data: [{
        type: "area",
        color : "#3DA544",
        name: "Stock2",
        showInLegend: false,
        dataPoints: [
          {x: new Date(2019,10,22),	y: 148.29},
          {x: new Date(2019,10,21),	y: 146.9},
          {x: new Date(2019,10,20),	y: 146.93},
          {x: new Date(2019,10,19),	y: 148.38},
          {x: new Date(2019,10,18),	y: 147.65},
          {x: new Date(2019,10,15),	y: 144.67},
          {x: new Date(2019,10,14),	y: 147.15},
          {x: new Date(2019,10,13),	y: 148.72},
          {x: new Date(2019,10,12),	y: 138.58},
          {x: new Date(2019,10,11),	y: 136.74}
        ]
      }]
    };
    */
    return (
      <Card>
        <div className="row">
            <CanvasJSChart options={options}/>
        </div>
      </Card>
    );
}



export default StockChart2;
