import React from "react";
import EconEvent from "./EconEvent";
import {Row, Col, Card} from 'react-bootstrap';
import $ from 'jquery';

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
          <Card.Title>{title}</Card.Title>
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

class EconEvents extends React.Component{
  constructor(props){
    super(props);
    this.state = {loading: false, econevents: []};
  }
  componentDidMount() {
    const self = this;
    this.setState({loading: true});
    $.get("http://ec2-18-197-152-183.eu-central-1.compute.amazonaws.com:3000/event", data => {
      console.log(data);
      self.setState({econevents: data, loading: false})
    })
  }
  render(){
    //if (this.state.loading) return <h3>Loading...</h3>
    return (
      <Row>
        <Col md={{span: 8, offset: 2}}>
          {
            this.state.econevents.map(econevent => (
              <EconEventPreview key={econevent._id} title={econevent.title} text={econevent.body} eventId={econevent._id} />
            ))
          }
        </Col>
      </Row>
    );
  }

}
export default EconEvents;
