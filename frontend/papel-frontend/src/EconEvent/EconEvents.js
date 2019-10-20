import React from "react";
import EconEvent from "./EconEvent";
import {Row, Col, Card} from 'react-bootstrap';

function EconEventPreview({onClick, title, text, star}) {
    return (
      <Card style={{width: "100%", marginBottom: 10}} onClick={onClick}>
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>{text.slice(0, 100)}{(text.length < 100) ? "" : "..."}</Card.Text>
        </Card.Body>
      </Card>
    );
  }
  
class EconEvents extends React.Component{
    constructor(props){
        super(props);
        this.state = {loading: false, econevents: []};
    }
    componentDidMount() {
        this.setState({loading: true});
        fetch('https://jsonplaceholder.typicode.com/posts')
          .then(response => response.json())
          .then(json => this.setState({econevents: json, loading: false}));
    }
    render(){
        return (
            <Row>
              <Col md={{span: 8, offset: 2}}>
                {
                  this.state.econevents.map(econevent => (
                    <EconEventPreview key={econevent.id} title={econevent.title} text={econevent.body} onClick={() => alert("Wow!" + econevent.id)} />
                  ))
                }
              </Col>
            </Row>
        );
    }

}
export default EconEvents;
