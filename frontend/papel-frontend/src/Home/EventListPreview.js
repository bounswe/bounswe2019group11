import React from 'react';
import { Card } from 'react-bootstrap';

function EventListPreview({ eventId, title, text}) {
  var path = "../events";
  return (
    
        <Card.Body>
          <Card.Title><a href={path}><b><h6>{title? title : "Loading..."}</h6></b></a></Card.Title>
          <Card.Text>{text.slice(0, 120)}{(text.length < 100) ? "" : "..."}<hr/></Card.Text>
          

        </Card.Body>
      
   
  );
}

export default EventListPreview;
