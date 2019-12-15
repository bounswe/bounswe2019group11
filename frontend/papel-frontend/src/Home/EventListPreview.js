import React from 'react';
import { Card } from 'react-bootstrap';

function EventListPreview({ eventId, title, text, rank, country, date}) {
  var path = "../events";
  
  var stars = ["star-outline","star-outline","star-outline"];
  for (let i = 0; i < rank; i++) {
      stars[i] = "star";
  }
  return (
    
        <Card.Body>
          <Card.Title>
          <b><h6>
            {title? title : "Loading..."}
          </h6></b>
            
          <ion-icon name = {stars[0]}></ion-icon>
            <ion-icon name = {stars[1]}></ion-icon>
            <ion-icon name = {stars[2]}></ion-icon>
          </Card.Title>
          
          <Card.Text style={{fontSize:10}}>{date.slice(11, 16)+" "+date.slice(0, 10)+ " " + country}</Card.Text>
          
          <Card.Text>{text}</Card.Text>
          <hr/>
        </Card.Body>
      
   
  );
}

export default EventListPreview;
