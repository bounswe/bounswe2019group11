import React from 'react';
import { Card } from 'react-bootstrap';


function EconEventPreview({eventId, title, text}) {
  var temp = Math.floor(Math.random() * 5)+1 ;
      var star = ["star-outline","star-outline","star-outline","star-outline","star-outline"];
      for (let i = 0; i < temp; i++) {
          star[i] = "star";
  }
  const path = "../event/" + eventId;
  return (
      <a href={path}>
        <Card style={{width: "100%", marginBottom: 10}}>
          <Card.Body>
            <Card.Title>Deneme{title}</Card.Title>
            <Card.Text>{text.slice(0, 100)}{(text.length < 100) ? "" : "..."}</Card.Text>

            <ion-icon name = {star[0]}></ion-icon>
            <ion-icon name = {star[1]}></ion-icon>
            <ion-icon name = {star[2]}></ion-icon>
            <ion-icon name = {star[3]}></ion-icon>
            <ion-icon name = {star[4]}></ion-icon>

          </Card.Body>
        </Card>
      </a>
    );
  }

export default EconEventPreview;
