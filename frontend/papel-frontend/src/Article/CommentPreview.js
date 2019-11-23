import React from 'react';
import {Row, Col, Button, Card, Form} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPlus,faThumbsUp,faThumbsDown, faUserCircle} from '@fortawesome/free-solid-svg-icons';

function CommentPreview({id, author, body, date, lastEditDate}) {
  return (

    <Card>
      <Card.Body>

        <Card.Title >
          <h6><FontAwesomeIcon name="UserCircle" icon={faUserCircle} />&nbsp; {author ? author : "Comments are loading..."}</h6>
        </Card.Title>
        
        <Card.Text >
          {body ? body : "Comments are loading..."}
        </Card.Text>
        
        <Row className="">

          <Col sm={{span: 2, offset: 0}} xs={{span: 12}}>
            
            <Button size="sm"  onClick={() => alert("impelement et")}>
              
              <FontAwesomeIcon name="Like" icon={faThumbsUp} />&nbsp;
              !15!
            </Button>

          </Col>

          <Col sm={{span: 2, offset: 0}} xs={{span: 12}}>
            
            <Button size="sm"  onClick={() => alert("implement et")}>
              <FontAwesomeIcon name="Dislike" icon={faThumbsDown} />&nbsp;        
              !5!
            </Button>
          </Col>
        </Row>    
      </Card.Body>
    </Card>
  );
}
export default CommentPreview;
