import React from 'react';
import { Card } from 'react-bootstrap';

function ArticleListPreview({articleId, title, text}) {
  const path = "../article/" + articleId;
  return (
    <Card.Body>
      <Card.Title>
        <a href={path}><b><h6>{title? title : "Loading..."}</h6></b></a>
      </Card.Title>
      <Card.Text>
        {text.slice(0, 120)}{(text.length < 100) ? "" : "..."}
      </Card.Text>
      <hr/>
    </Card.Body>
  );
}

export default ArticleListPreview;
