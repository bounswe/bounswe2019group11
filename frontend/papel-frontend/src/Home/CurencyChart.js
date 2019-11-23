import React from 'react';
import {useParams} from 'react-router-dom';
import $ from 'jquery';
import {Card} from 'react-bootstrap'
import CanvasJSReact from '../canvasjs/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function CurencyChart({currency}) {
  
    const options = {
      animationEnabled: true,	
      title:{
        text: currency+"/TRY"
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
        name: "TRY",
        showInLegend: false,
        dataPoints: [
          {x: new Date(2019,11,22),	y: 6.2983},
          {x: new Date(2019,11,21),	y: 6.2992},
          {x: new Date(2019,11,20),	y: 6.3116},
          {x: new Date(2019,11,19),	y: 6.3139},
          {x: new Date(2019,11,18),	y: 6.3519},
          {x: new Date(2019,11,15),	y: 6.3498},
          {x: new Date(2019,11,14),	y: 6.3356},
          {x: new Date(2019,11,13),	y: 6.3183},
          {x: new Date(2019,11,12),	y: 6.3605},
          {x: new Date(2019,11,11),	y: 6.3697}
          
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




export default CurencyChart;
