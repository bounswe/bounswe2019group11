import React, {useState} from 'react';
import {Row, Col, Card, Modal, Button, Form, Table} from 'react-bootstrap';
import $ from 'jquery';
import {app_config} from "../config";
import {deleteRequest} from '../helpers/request';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faPlus, faTrash} from '@fortawesome/free-solid-svg-icons';
import './Portfolio.css';
import {useCookies} from 'react-cookie'

function Portfolio({portfolio, isMe}){
  const [cookies, setCookie, removeCookie] = useCookies(['userToken'])
  const [stocksShown, showStocks] = useState(false);
  const [stockAddShown, showStockAdd] = useState(false);
  const [newStock, setNewStock] = useState({});
  const [stockList, setStockList] = useState([]);
  const [addStockList, setAddStockList] = useState([]);
  const [searchbarText, setSearchbarText] = useState("");
  const [originalStockList, setOriginalStockList] = useState([]);

  var handleChange = function(event) {
    setNewStock({name: event.target.value});
  };
  var onAddSelected = function() {
    addStockList.map(stock => {
      const request_url = app_config.api_url + "/portfolio/" + portfolio._id + "/stock";
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
    $.get(app_config.api_url + "/stock", data => {
      setStockList(data);
      setOriginalStockList(data);
      setSearchbarText("");
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
  var handleSearchbarChange = function(event) {
    var searchbarNewText = event.target.value.toLowerCase();
    setSearchbarText(searchbarNewText);
    var list = originalStockList.filter(stock => stock.stockName.toLowerCase().includes(searchbarNewText));
    setStockList(list);
  }

  var deleteStock = function(stock) {
    var request_url = app_config.api_url + "/portfolio/" + portfolio._id + "/stock"
    deleteRequest({
      url: request_url,
      data: stock,
      success: () => window.location.reload(),
      authToken: cookies.userToken
    })
  }

  var portfolios = function(isMe) {
    if (isMe) {
      return portfolio.stocks.map(
        stock =>
        (<li key={stock._id}>
          <a href={"../stock/" + stock._id}>{stock.stockName.split(" - ")[0]}</a>
          <a href="#" onClick={() => deleteStock(stock)}><FontAwesomeIcon style={{float:"right"}} icon={faTrash}/></a>
        </li>)
      )
    }
    else {
      return portfolio.stocks.map(stock => (<a key={stock._id} href={"../stock/" + stock._id}><li>{stock.stockName.split(" - ")[0]}</li></a>))
    }
  }

  return (
    <Card className="portfolio">
      <Card.Body>
        <Card.Title>{portfolio.name}</Card.Title>
        <ul className="portfolio-stocks" hidden={!stocksShown}>
        { portfolios(isMe) }
        {
          isMe ?
          (<li>
            <div className="add-stock" onClick={addStockBtn} style={{width: "100%", textAlign: "center"}}>
              <FontAwesomeIcon icon={faPlus} />&nbsp;
              Add Stock
            </div>
          </li>)
          :
          ""
        }
        </ul>
        <Modal
          show={stockAddShown}
          onHide={() => showStockAdd(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Stock</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{height: 500}} className="myScroller">
            <Form>
              <Form.Control type="text" placeholder="Search" onChange={handleSearchbarChange} />
              <Table>
                <thead>
                  <tr><th></th><th>Symbol</th><th>Stock Name</th></tr>
                </thead>
                <tbody>
                {
                  stockList
                    .filter(s => portfolio.stocks.filter(o => o._id === s._id).length === 0)
                    .map(stock => (
                    <tr key={stock._id}>
                      <td>
                        <Form.Check
                          onChange={handleCheckbox}
                          type='checkbox'
                          id={stock._id}
                          value={stock}
                        />
                      </td>
                      <td xs={{span: 2}}>
                        {stock.stockSymbol}
                      </td>
                      <td xs={{span: 10}}>
                        {stock.stockName.split(" - ")[0]}
                      </td>
                    </tr>
                  ))
                }
                </tbody>
              </Table>
            </Form>
          </Modal.Body>
          <div onClick={onAddSelected} style={{textAlign: "center"}} className="add-stock">Add Selected</div>
        </Modal>

        <div className="drawer" hidden={stocksShown} onClick={()=> showStocks(!stocksShown)} style={{width: "100%", textAlign: "center"}}><FontAwesomeIcon icon={faAngleDown} /></div>
        <div className="drawer" hidden={!stocksShown} onClick={()=> showStocks(!stocksShown)} style={{width: "100%", textAlign: "center"}}><FontAwesomeIcon icon={faAngleUp} /></div>
      </Card.Body>
    </Card>
  );
}
export default Portfolio;
