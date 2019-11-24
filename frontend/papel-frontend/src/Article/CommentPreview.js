import React from 'react';
import {Row, Col, Button, Card, Form} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPlus,faThumbsUp,faThumbsDown, faUserCircle, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';
import {authorizedPost} from '../helpers/request';
import Article from './Article';
import { useCookies} from 'react-cookie';

function CommentPreview({id, userId, authorId, author, cookies, loggedIn, body, date, lastEditDate}) {
  var deleteBtn;
  
  if(loggedIn && (userId == authorId)){
    deleteBtn = <Col sm={{span: 3, offset: 5}} xs={{span: 12}}>
           
      <FontAwesomeIcon id="interactive" name="Delete" 
      
         icon={faTrashAlt} 
      />&nbsp;Delete Comment         

    </Col>
  }
  return (

    
      <Card.Body>
    
        <Card.Title id="interactive" >
          <h6><FontAwesomeIcon  name="UserCircle" icon={faUserCircle} />&nbsp; {author}</h6>
        </Card.Title>
        <Card.Text >
          {body ? body : "Comments are loading..."}
        </Card.Text>
        
        <Row className="">

          <Col sm={{span: 2, offset: 0}} xs={{span: 12}}>
              
              <FontAwesomeIcon id="interactive" name="Like" 
              onClick={
                function handleDelete(event) {
                  alert("attempt to like comment");
                  }
                } icon={faThumbsUp} 
              />&nbsp; xxx Likes
              
          </Col>

          <Col sm={{span: 2, offset: 0}} xs={{span: 12}}>
            
              <FontAwesomeIcon id="interactive" name="Dislike" 
              onClick={
                function handleDelete(event) {
                  alert("attempt to dislike comment");
                  }
                } icon={faThumbsDown} 
              />&nbsp; xxx Dislikes    
          
          </Col>
          
          {deleteBtn}

        </Row>    
        <hr/>
      </Card.Body>
    
  );
}
export default CommentPreview;
