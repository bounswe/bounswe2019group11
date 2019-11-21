import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';
import './Home.css';
import {useParams} from 'react-router-dom';
import $ from 'jquery';
import {Row, Col, Button, Card} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPlus,faThumbsUp,faThumbsDown } from '@fortawesome/free-solid-svg-icons';

class Home extends React.Component {
  render() {
  
    return (
      <Row className="">
        <Col sm={{span: 4, offset: 0}} xs={{span: 12}}>
          <Card>
            <Button size="sm"  onClick={() => alert()}>
              <FontAwesomeIcon name="Dislike" icon={faThumbsDown} />&nbsp;        
            </Button>
          </Card>
        </Col>

        <Col sm={{span: 4, offset: 0}} xs={{span: 12}}>
          <Card>
            <Button size="sm"  onClick={() => alert()}>
              <FontAwesomeIcon name="Dislike" icon={faThumbsDown} />&nbsp;        
            </Button>
          </Card>
        </Col>
        
      </Row>

      
    );
  }
}
export default Home;
