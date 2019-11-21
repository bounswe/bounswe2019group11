import React from 'react';
import {useParams} from 'react-router-dom';
import $ from 'jquery';
import './TradingEquipment.css';
import {Card} from 'react-bootstrap'
import CanvasJSReact from '../canvasjs/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class TradingEquipment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {id: this.props.match.params.id, stock: {}, dailyPrice: {}, monthlyPrice: {}, isMonthly: true, requests: []};

  }

  componentDidMount() {
    var stockId;
    $.get(`http://ec2-18-197-152-183.eu-central-1.compute.amazonaws.com:3000/stock/${this.state.id}`, (data) => {
      this.setState({stock: data, dailyPrice: data.dailyPrice, monthlyPrice: data.monthlyPrice});
    });
  }

  render() {
    var data = [];
    var stateData = this.state.isMonthly ? this.state.monthlyPrice : this.state.dailyPrice;
    if (!!stateData) {
      data = Object.keys(stateData)
        .map((date) => {return {x: new Date(date.split(" ").join("T")), y: Object.values(stateData[date]).slice(0, 4).map((s) => parseFloat(s))}});
      data = data.slice(0, 10);
    }
    var options = {
      animationEnabled: true,
    	theme: "light2", // "light1", "light2", "dark1", "dark2"
    	exportEnabled: true,
    	axisY: {
    		includeZero: false,
    		prefix: "$",
    		title: "Price"
    	},
    	toolTip: {
    		content: "Date: {x}<br /><strong>Price:</strong><br />Open: {y[0]}, Close: {y[3]}<br />High: {y[1]}, Low: {y[2]}"
    	},
    	data: [{
    		type: "candlestick",
    		yValueFormatString: "$##0.00",
    		dataPoints: data
    	}]
    };
    return (
      <Card>
        <div className="row">
          <div className="col-sm-3">
            <h1>{this.state.stock.stockSymbol}</h1>
          </div>
          <div className="col-sm-9">
            <h3>{this.state.stock.stockName}</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-3">
            <h3>Price: {this.state.stock.price}</h3>
          </div>
          <div className="graphic col-sm-9 ">
            <CanvasJSChart options={options}/>
          </div>
        </div>
      </Card>
    );
  }
}




export default TradingEquipment;
