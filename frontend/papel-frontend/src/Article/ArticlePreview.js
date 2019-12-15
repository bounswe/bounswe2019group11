import React from 'react';
import { Card } from 'react-bootstrap';

function ArticlePreview({articleId, title, text, fixedHeight}) {
  const path = "../article/" + articleId;
  var height = fixedHeight ||"auto";

  return (
    <a href={path}>
      <Card style={{width: "100%", marginBottom: 10, height: height}}>
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>{text.slice(0, 100)}{(text.length < 100) ? "" : "..."}</Card.Text>
        </Card.Body>
      </Card>
    </a>
  );
}

export default ArticlePreview;
