import React from 'react';
import {useParams} from 'react-router-dom';
import $ from 'jquery';
import {Card} from 'react-bootstrap'
import CanvasJSReact from '../canvasjs/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function StockChart2({stock}) {
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
    return (
      <Card>
        <div className="row">
            <CanvasJSChart options={options}/>

        </div>
      </Card>
    );

}




export default StockChart2;
