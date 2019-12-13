import React from "react";
import "./EconEvent.css";
import {useParams} from 'react-router-dom';
import $ from 'jquery';
import {app_config} from "../config";
import {Row, Col, Card} from 'react-bootstrap'

class EconEvent extends React.Component{
  constructor(props){
    super(props);
    this.state = {id: this.props.match.params.id, loading: false, econevent:{}, star:{}};
    
  }
  componentDidMount(){
    console.log(this.state.id)
    const self = this
    const url = app_config.api_url + "/event/" + this.state.id;
    this.setState({loading: true});
    $.get(url, data => {
      console.log(data)
      self.setState({loading: false, econevent: data})
    })
  }
  createStars(){
    let temp=0 ;
    var ar = ["star-outline","star-outline","star-outline"];
    for (let i = 0; i < temp; i++) {
        ar[i] = "star";
    }
  }
    render(){
        var econevent = this.state.econevent;
        if (this.state.loading) {
          return (
            <Row>
              <Col sm={{span: 10, offset: 1}} xs={{span: 12}}>
                <Card>
                  <Card.Body>
                    <Card.Title>Loading...</Card.Title>
                    <hr />
                    <Card.Text></Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )
        }
        else {
          return (
            <div className="container">
              <div className="row">
                <div className="col-6 offset-3">
                  <div className="row">
                    <h3>{econevent.title}</h3>
                  </div>
                  <div className="row">
                    <div className="econevent"> {econevent.body} </div>
                  </div>
                  <div className="row">
                    <ion-icon name = {this.state.star[0]}></ion-icon>
                    <ion-icon name = {this.state.star[1]}></ion-icon>
                    <ion-icon name = {this.state.star[2]}></ion-icon>
                  </div>
                </div>
              </div>
            </div>
        )
      }
    }
}
export default EconEvent;
