import React from 'react';
import {useParams} from 'react-router-dom';
import $ from 'jquery';
import {Card} from 'react-bootstrap'
import CanvasJSReact from '../canvasjs/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function USD({currency}) {
  
    const options = {
      animationEnabled: true,	
      title:{
        text: currency+"/TRY"
      },
      axisY : {
        title: "USD",
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
        name: "TRY",
        showInLegend: false,
        dataPoints: [
          {x:new Date(2019,11,22),	y: 5.7132},
          {x:new Date(2019,11,21),	y: 5.6966},
          {x:new Date(2019,11,20),	y: 5.6997},
          {x:new Date(2019,11,19),	y: 5.6990},
          {x:new Date(2019,11,18),	y: 5.7369},
          {x:new Date(2019,11,15),	y: 5.7453},
          {x:new Date(2019,11,14),	y: 5.7477},
          {x:new Date(2019,11,13),	y: 5.7403},
          {x:new Date(2019,11,12),	y: 5.7776},
          {x:new Date(2019,11,11),	y: 5.7733},
          {x:new Date(2019,10,31),	y: 5.7130},
          {x:new Date(2019,10,30),	y: 5.7020},
          {x:new Date(2019,10,29),	y: 5.7373},
          {x:new Date(2019,10,28),	y: 5.7312},
          {x:new Date(2019,10,25),	y: 5.7748},
          {x:new Date(2019,10,24),	y: 5.7647},
          {x:new Date(2019,10,23),	y: 5.7351}
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




export default USD;
