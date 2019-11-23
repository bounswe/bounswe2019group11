import React from "react";
import EconEvent from "./EconEvent";
import {Row, Col, Card} from 'react-bootstrap';
import $ from 'jquery';
import EconEventPreview from './EconEventPreview';

class EconEvents extends React.Component{
  constructor(props){
    super(props);
    this.state = {loading: false, econevents: []};
  }
  componentDidMount() {
    const self = this;
    this.setState({loading: true});
    $.get("http://ec2-18-197-152-183.eu-central-1.compute.amazonaws.com:3000/event", (data) => {
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
