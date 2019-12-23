import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Currencies from "./Currencies"
import $ from 'jquery';
import { app_config } from "../config";
import { Card, Row, Column, Col, Button, Badge, Spinner } from 'react-bootstrap'
import { faArrowUp, faLongArrowAltUp, faArrowDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {instanceOf} from 'prop-types'
import {withCookies, Cookies} from 'react-cookie';
import {postRequest} from '../helpers/request';
import { useCookies, CookiesProvider } from 'react-cookie';

var template = {
    "_id": "",
    "code": "",
    "name": "",
    "rate": "",
    "comments": [
        {
            "_id": "",
            "authorId": "",
            "body": "",
            "date": "",
            "edited": "",
            "lastEditDate": "",
            "author": {
                "name": "",
                "surname": ""
            }
        }
    ],
    "predictions": [
        {
            "prediction": "-1",
            "count": <Spinner animation="border" size="sm" />
        }, {
            "prediction": "1",
            "count": <Spinner animation="border" size="sm" />
        }

    ],
    "userPrediction": ""
}
function Prediction({ code }) {
    const [cookies, setCookie, removeCookie] = useCookies(['user', 'userToken', 'pendingRequests'])
    var _url = app_config.api_url + "/";
    const [currency, setCurrency] = useState(0);
    const [upCount, setUpCount] = useState(0);
    const [downCount, setDownCount] = useState(0);
    if (!currency) {
        $.get(
            _url + "currency/" + code,
            (data) => { setCurrency(data) }
        );
    }
    console.log("currency")
    console.log(currency)
    console.log("template")
    console.log(template)
    template = currency ? currency : template

    //var upCount
    //var downCount

    if(template.predictions){
      if(template.predictions[0]){
        if(template.predictions[0].prediction == "1"){
          setUpCount(template.predictions[0].count);
          if(template.predictions[1]){
            setDownCount(emplate.predictions[1].count);
          }
        }
        else{
          setDownCount(template.predictions[0].count);
          if(template.predictions[1]){
            setUpCount(template.predictions[1].count);
          }
        }
      }
    }
    //var upCount = template.predictions[1]?template.predictions[1].count:0;
    //var downCount = template.predictions[0]?template.predictions[0].count:0;

    function predictUp(event){
      console.log("VOTE up")
      postRequest({
        url: app_config.api_url + "/currency/"+ code + "/predict-increase",
        success: function()  {
        },
        authToken: cookies.userToken
      });
      //window.location.reload();
    }
    function predictDown(event){
      console.log("VOTE down")
      postRequest({
        url: app_config.api_url + "/currency/"+ code + "/predict-decrease",
        success: (data) => {console.log("VOTE DOWN")
        },
        authToken: cookies.userToken
      });
      //window.location.reload();
    }
    return (

        <Col>
            <Row>

                <Col md={{ span: 12 }} >
                    <Card.Title >
                        <h5>
                            Predictions
                    </h5>
                    </Card.Title>

                </Col>
            </Row>
            <Row>

                <Col md={{ span: 6 }} >
                    <Button variant="primary" onClick={predictUp}>
                        <FontAwesomeIcon name="UP" style={{ fontSize: 30, outlineBorder: 10 }} icon={faArrowUp} />&nbsp;
                    <Badge variant="light">{upCount}</Badge>
                        <span className="sr-only">unread messages</span>
                    </Button>

                </Col>

                <Col md={{ span: 6 }} >
                    <Button variant="primary" onClick={predictDown}>
                        <FontAwesomeIcon name="UP" style={{ fontSize: 30, outlineBorder: 10 }} icon={faArrowDown} />&nbsp;
                    <Badge variant="light">{downCount}</Badge>
                        <span className="sr-only">unread messages</span>
                    </Button>

                </Col>
            </Row>
        </Col>


    );

}




export default Prediction;
