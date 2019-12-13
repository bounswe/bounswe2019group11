import React from "react";
import EconEvent from "./EconEvent";
import {Row, Col, Card} from 'react-bootstrap';
import $ from 'jquery';
import {app_config} from "../config";
import EconEventPreview from './EconEventPreview';

class EconEvents extends React.Component{
  constructor(props){
    super(props);
    this.state = {loading: false, econevents: []};
  }
  componentDidMount() {
    const self = this;
    this.setState({loading: true});
    $.get(app_config.api_url +  "/event", (data) => {
      
      self.setState({econevents: data.reverse(), loading: false})
    })
  }
  render(){
    //if (this.state.loading) return <h3>Loading...</h3>
    return (
      <Row>
        <Col md={{span: 8, offset: 2}}>
          {
            this.state.econevents.map(econevent => (
              <EconEventPreview key={econevent._id} title={econevent.title} text={econevent.body} eventId={econevent._id} rank={econevent.rank} />
            ))
          }
        </Col>
      </Row>
    );
  }

}
export default EconEvents;
