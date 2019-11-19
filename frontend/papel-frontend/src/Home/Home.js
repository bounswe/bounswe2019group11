import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';
import './Home.css';
import {useParams} from 'react-router-dom';
import $ from 'jquery';
import {Row, Col, Card} from 'react-bootstrap';


class Home extends React.Component {
  render() {
  
    return (
      <Row className="">
        <Col sm={{span: 4, offset: 0}} xs={{span: 12}}>
          <Card>
            <Card.Body>
              <Card.Title><h5>Currencies</h5></Card.Title>
              <hr />
              <Card.Text>
                Dolar : value <br/> 
                Euro : value <br/>
                Yen : value <br/>
                .... : value <br/>
                .... : value <br/>
      
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={{span: 4, offset: 0}} xs={{span: 12}}>
          <Card>
            <Card.Body>
              <Card.Title><h5>DENEME</h5></Card.Title>
              <hr />
              <Card.Text>DENEMEIKI</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col sm={{span: 4, offset: 0}} xs={{span: 12}}>
          <Card>
            <Card.Body>
              <Card.Title><h5>DENEME</h5></Card.Title>
              <hr />
              <Card.Text>DENEMEIKI</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      
    );
  }
}
export default Home;
