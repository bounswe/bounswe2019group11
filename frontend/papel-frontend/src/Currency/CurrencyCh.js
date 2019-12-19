import React from 'react';
import {useParams} from 'react-router-dom';
import $ from 'jquery';
import {Card} from 'react-bootstrap'
import CanvasJSReact from '../canvasjs/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function CurrencyCh({currency, year,month,day, value}) {
  var data = [];
  for (let index = 0; index < year.length; index++) {
     data[index] = {x: new Date(year[index],month[index],day[index]),	y: parseFloat(value[index])}
    
  }
  
  const options = {
    theme: "light1", // "light1", "dark1", "dark2"
    animationEnabled: true,
    zoomEnabled: true,
    title: {
      text:"USD/"+ currency
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
            <CanvasJSChart options={options}/>

    );

}




export default CurrencyCh;
