import React from 'react';
import {useParams} from 'react-router-dom';
import $ from 'jquery';
import {Card} from 'react-bootstrap'
import CanvasJSReact from '../canvasjs/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function CurencyCh({currency, year,month,day, value}) {
    
  const options = {
      animationEnabled: true,
      title:{
        text:"USD/"+ currency
      },
      axisY : {
        title: currency,
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
        name: {currency},
        showInLegend: false,
        dataPoints: [
          {x: new Date(year[0],month[0],day[0]),	y: parseFloat(value[0])},
          {x: new Date(year[1],month[1],day[1]),	y: parseFloat(value[1])},
          {x: new Date(year[2],month[2],day[2]),	y: parseFloat(value[2])},
          {x: new Date(year[3],month[3],day[3]),	y: parseFloat(value[3])},
          {x: new Date(year[4],month[4],day[4]),	y: parseFloat(value[4])},
          {x: new Date(year[5],month[5],day[5]),	y: parseFloat(value[5])},
          {x: new Date(year[6],month[6],day[6]),	y: parseFloat(value[6])}
          
        ]
      }]
  };
    return (
      <Card>
        <div className="row">
            <CanvasJSChart options={options}/>

        </div>
      </Card>
    );

}




export default CurencyCh;
