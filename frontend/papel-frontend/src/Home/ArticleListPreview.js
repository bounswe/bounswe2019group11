import React from 'react';
import { Card } from 'react-bootstrap';

function ArticleListPreview({articleId, title, text}) {
  const path = "../article/" + articleId;
  return (
    
        <Card.Body>
          <Card.Title><a href={path}>{title} </a></Card.Title>
          <Card.Text>{text.slice(0, 120)}{(text.length < 100) ? "" : "..."}<hr/></Card.Text>
          

        </Card.Body>
      
   
  );
}

export default ArticleListPreview;
