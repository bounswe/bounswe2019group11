import React, {useState} from 'react';
import {Row, Col, Card, Modal, Button, Form} from 'react-bootstrap';
import $ from 'jquery';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faPlus} from '@fortawesome/free-solid-svg-icons';
import './Portfolio.css';


function Portfolio({portfolio}){
  const [stocksShown, showStocks] = useState(false);
  const [stockAddShown, showStockAdd] = useState(false);
  const [newStock, setNewStock] = useState({});
  const [stockList, setStockList] = useState([]);
  const [addStockList, setAddStockList] = useState([]);

  var handleChange = function(event) {
    setNewStock({name: event.target.value});
  };
  var onAddSelected = function() {
    addStockList.map(stock => {
      const request_url = "http://ec2-18-197-152-183.eu-central-1.compute.amazonaws.com:3000/portfolio/" + portfolio._id + "/stock";
      var index = -1;
      for (var i = 0; i < stockList.length; i++) {
        if (stockList[i]._id == stock) {
          index = i;
          break;
        }
      }
      if (index > -1)
        $.post(request_url, stockList[index], (resp, data) => {
          console.log(resp);
          console.log(data);
          showStockAdd(false);
          window.location.replace("../profile");
        });
    });
  };
  var addStockBtn = function() {
    $.get("http://ec2-18-197-152-183.eu-central-1.compute.amazonaws.com:3000/stock", data => {
      setStockList(data);
      showStockAdd(true);
    });
  };
  var handleCheckbox = function(event) {
    console.log(addStockList);
    if (event.target.checked) {
      var arr = addStockList;
      arr.push(event.target.id);
      setAddStockList(arr);
    }
    else {
      var index = addStockList.indexOf(event.target.id);
      if ( index > -1) {
        var arr = addStockList;
        arr.splice(index, 1);
        setAddStockList(arr);
      }
    }
  };
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
          <li>
            <div className="add-stock" onClick={addStockBtn} style={{width: "100%", textAlign: "center"}}>
              <FontAwesomeIcon icon={faPlus} />&nbsp;
              Add Stock
            </div>
          </li>
        </ul>
        <Modal
          show={stockAddShown}
          onHide={() => showStockAdd(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Stock</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
            {
              stockList
                .filter(s => portfolio.stocks.filter(o => o._id === s._id).length === 0)
                .map(stock => (
                <Form.Check
                  onChange={handleCheckbox}
                  key={stock._id}
                  type='checkbox'
                  id={stock._id}
                  label={stock.stockName.split(" - ")[0]}
                  value={stock}
                />
              ))
            }
              <div onClick={onAddSelected} style={{textAlign: "center"}} className="add-stock">Add Selected</div>
            </Form>
          </Modal.Body>
        </Modal>

        <div className="drawer" hidden={stocksShown} onClick={()=> showStocks(!stocksShown)} style={{width: "100%", textAlign: "center"}}><FontAwesomeIcon icon={faAngleDown} /></div>
        <div className="drawer" hidden={!stocksShown} onClick={()=> showStocks(!stocksShown)} style={{width: "100%", textAlign: "center"}}><FontAwesomeIcon icon={faAngleUp} /></div>
      </Card.Body>
    </Card>
  );
}
export default Portfolio;
