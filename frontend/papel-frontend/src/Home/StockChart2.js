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

function StockChart2({stock, stockName}) {
  //console.log(stock)
  //var stock_id = "5df7b5adf29d0356042b862"
  const [stockInfo, setStockInfo] = useState(0);
  const [stockInfoReceived, setStockInfoReceived] = useState(false);
  if(!stockInfoReceived){
    getRequest({
      url: app_config.api_url + "/stock/" + stock[0],
      success: (data) => {
        setStockInfo(data);
        setStockInfoReceived(true);
      }
      })
  }
  //console.log("here1")
  //console.log(stockInfo);
  //console.log("here2")
  var stockLastValues = {};
  stockLastValues = stockInfo.monthlyPrice;
  //console.log(stockLastValues)
  //console.log("here3")
  var key;
  var days = [], months=[], years=[];
  var values = [];
  var closeDayValues = [];
  for (key in stockLastValues) {
    if (stockLastValues.hasOwnProperty(key)) {
      var date = key;
      var day = date.split("-")[2],
      month =  date.split("-")[1],
      year =  date.split("-")[0];
      days.push(day);
      months.push(month);
      years.push(year);
      values.push(stockLastValues[key]);
    }
  }
  //console.log(days)
  //console.log(months)
  //console.log(years)
  //console.log(stockLastValues)
  var i;
  for (i = 0; i < values.length; i++) {
    for(key in values[i] ){
      if(key.includes("4")){closeDayValues.push(parseFloat(values[i][key]) );}
    } ;
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
    zoomEnabled: false,
    title: {
      text:stock[2]
    },
    axisY: {
      title: "value (in USD)",
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



export default StockChart2;
