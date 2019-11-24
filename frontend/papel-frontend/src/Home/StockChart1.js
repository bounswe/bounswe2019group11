import React from 'react';
import {useParams} from 'react-router-dom';
import $ from 'jquery';
import {Card} from 'react-bootstrap'
import CanvasJSReact from '../canvasjs/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function StockChart1({stock}) {
    const options = {
      animationEnabled: true,
      title:{
        text: "iShares J.P. Morgan USD Emerging Markets Bond ETF"
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
        name: "Stock1",
        showInLegend: false,
        dataPoints: [
          {x: new Date(2019,10,22),	y: 112.27},
          {x: new Date(2019,10,21),	y: 111.97},
          {x: new Date(2019,10,20),	y: 111.96},
          {x: new Date(2019,10,19),	y: 111.77},
          {x: new Date(2019,10,18),	y: 112.015},
          {x: new Date(2019,10,15),	y: 112.55},
          {x: new Date(2019,10,14),	y: 112.46},
          {x: new Date(2019,10,13),	y: 111.87},
          {x: new Date(2019,10,12),	y: 112.04},
          {x: new Date(2019,10,11),	y: 112.27}
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




export default StockChart1;
