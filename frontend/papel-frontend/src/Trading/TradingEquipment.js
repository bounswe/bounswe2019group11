import React from 'react';
import {useParams} from 'react-router-dom';

function TradingEquipment() {
//  fetch().then.then.catch.ohno.whatishappening
  let {id} = useParams();
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-4">
          <h1>{id}</h1>
        </div>
        <div className="col-sm-2">Change</div>
        <div className="col-sm-2">% Change</div>
      </div>
      <div className="row">
        <div className="col-sm-4">Buy: price</div>
        <div className="col-sm-4">Sell: price</div>
        <div className="col-sm-4">Previous Close: price</div>
      </div>
      <div className="row">
        <div className="graphic" style={{height: 300}}>
          This is a cool chart
        </div>
      </div>
      <div className="row">
        <div className="col-sm-2"><div className="btn">Bullish</div></div>
        <div className="col-sm-2"><div className="btn">Bearish</div></div>
      </div>

    </div>
  );
}
export default TradingEquipment;
