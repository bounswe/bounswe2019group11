import React, {useState} from 'react';
import {Row, Col, Card} from 'react-bootstrap';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import './Portfolio.css';


function Portfolio({portfolio}){
  const [stocksShown, showStocks] = useState(false);
  return (
    <Card className="portfolio">
      <Card.Body>
        <Card.Title>{portfolio.name}</Card.Title>
        <ul className="portfolio-stocks" hidden={!stocksShown}>
        { portfolio.stocks.map(
          stock =>
          <a key={stock._id} href={"../stock/" + stock._id}><li>{stock.name.split(" ")[0]}</li></a>
          )
        }
        </ul>
        <div hidden={stocksShown} onClick={()=> showStocks(!stocksShown)} style={{width: "100%", textAlign: "center"}}><FontAwesomeIcon icon={faAngleDown} /></div>
        <div hidden={!stocksShown} onClick={()=> showStocks(!stocksShown)} style={{width: "100%", textAlign: "center"}}><FontAwesomeIcon icon={faAngleUp} /></div>
      </Card.Body>
    </Card>
  );
}
export default Portfolio;
