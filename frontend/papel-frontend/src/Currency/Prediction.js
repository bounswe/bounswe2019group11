import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Currencies from "./Currencies"
import $ from 'jquery';
import { app_config } from "../config";
import { Card, Row, Column, Col, Button, Badge, Spinner } from 'react-bootstrap'
import { faArrowUp, faLongArrowAltUp, faArrowDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    
var _url = app_config.api_url + "/";
    const [currency, setCurrency] = useState(0);
    if (!currency) {
        $.get(
            _url + "currency/" + code,
            (data) => { setCurrency(data) }
        );
    }
    template = currency ? currency : template
    var upCount = template.predictions[1]?template.predictions[1].count:0;
    var downCount = template.predictions[0]?template.predictions[0].count:0;
    
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
                    <Button variant="primary">
                        <FontAwesomeIcon name="UP" style={{ fontSize: 30, outlineBorder: 10 }} icon={faArrowUp} />&nbsp;
                    <Badge variant="light">{upCount}</Badge>
                        <span className="sr-only">unread messages</span>
                    </Button>

                </Col>

                <Col md={{ span: 6 }} >
                    <Button variant="primary" >
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
