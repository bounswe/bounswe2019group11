import React from "react";
import PropTypes from "prop-types"
import $ from 'jquery';
import { app_config } from "../config";
import { Row, Col, Nav, Button, Card, Form, Tabs, Tab } from 'react-bootstrap';
import CurrencyView from "./CurrencyView"
import CurrencyTable from "./CurrencyTable"
import Prediction from "./Prediction"
const url = app_config.api_url + "/";
var template =
{
  "_id": "not loaded",
  "code": "not loaded",
  "name": "not loaded",
  "rate": 0
}
class Currencies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false, redirect: false, currencies: [{ _id: "0", code: "XXX", name: "namex", rate: "0.00" }, { _id: "0", code: "XXX", name: "namex", rate: "0.00" },
      { _id: "0", code: "XXX", name: "namex", rate: "0.00" },
      { _id: "0", code: "XXX", name: "namex", rate: "0.00" },
      { _id: "0", code: "XXX", name: "namex", rate: "0.00" },
      { _id: "0", code: "XXX", name: "namex", rate: "0.00" }]
    };
    this.handleClick1 = this.handleClick1.bind(this);
    this.handleClick2 = this.handleClick2.bind(this);
    this.handleClick3 = this.handleClick3.bind(this);
    this.handleClick4 = this.handleClick4.bind(this);
    this.handleClick5 = this.handleClick5.bind(this);
    this.handleClick6 = this.handleClick6.bind(this);
  }

  componentDidMount() {
    const self = this;
    this.setState({ loading: true });
    $.get(url + "currency", (data) => {
      this.state.currencies.map(currency => (console.log(currency)))
      self.setState({ currencies: data, loading: false });
      template = this.state.currencies
    });


  }

  handleClick0(event) {
    document.getElementById("1").setAttribute("hidden", null)
    document.getElementById("2").setAttribute("hidden", null)
    document.getElementById("3").setAttribute("hidden", null)
    document.getElementById("4").setAttribute("hidden", null)
    document.getElementById("5").setAttribute("hidden", null)
    document.getElementById("0").removeAttribute("hidden")
  }
  handleClick1(event) {
    document.getElementById("0").setAttribute("hidden", null)
    document.getElementById("1").setAttribute("hidden", null)
    document.getElementById("2").setAttribute("hidden", null)
    document.getElementById("3").setAttribute("hidden", null)
    document.getElementById("4").setAttribute("hidden", null)
    document.getElementById("5").setAttribute("hidden", null)
    document.getElementById("1").removeAttribute("hidden")
  }
  handleClick2(event) {
    document.getElementById("0").setAttribute("hidden", null)
    document.getElementById("1").setAttribute("hidden", null)
    document.getElementById("2").setAttribute("hidden", null)
    document.getElementById("3").setAttribute("hidden", null)
    document.getElementById("4").setAttribute("hidden", null)
    document.getElementById("5").setAttribute("hidden", null)
    document.getElementById("2").removeAttribute("hidden")
  }
  handleClick3(event) {
    document.getElementById("0").setAttribute("hidden", null)
    document.getElementById("1").setAttribute("hidden", null)
    document.getElementById("2").setAttribute("hidden", null)
    document.getElementById("3").setAttribute("hidden", null)
    document.getElementById("4").setAttribute("hidden", null)
    document.getElementById("5").setAttribute("hidden", null)
    document.getElementById("3").removeAttribute("hidden")

  }
  handleClick4(event) {
    document.getElementById("0").setAttribute("hidden", null)
    document.getElementById("1").setAttribute("hidden", null)
    document.getElementById("2").setAttribute("hidden", null)
    document.getElementById("3").setAttribute("hidden", null)
    document.getElementById("4").setAttribute("hidden", null)
    document.getElementById("5").setAttribute("hidden", null)
    document.getElementById("4").removeAttribute("hidden")

  }
  handleClick5(event) {
    document.getElementById("0").setAttribute("hidden", null)
    document.getElementById("1").setAttribute("hidden", null)
    document.getElementById("2").setAttribute("hidden", null)
    document.getElementById("3").setAttribute("hidden", null)
    document.getElementById("4").setAttribute("hidden", null)
    document.getElementById("5").setAttribute("hidden", null)
    document.getElementById("5").removeAttribute("hidden")

  }
  handleClick6(event) {

  }
  render() {
    var [c0, c1, c2, c3, c4] = ["loading", "loading", "loading", "loading", "loading"];
    var component = "loading";
    if (!this.state.loading) {
      c0 = this.state.currencies[0];
      c1 = this.state.currencies[1];
      c2 = this.state.currencies[2];
      c3 = this.state.currencies[3];
      c4 = this.state.currencies[4];

    }
    return (
      <Col md={{ span: 12 }}>
        <Card>
          <Card.Header>
            <Nav variant="pills" defaultActiveKey="#first">
              <Nav.Item>
                <Nav.Link href="#first" onClick={this.handleClick0}>Rates</Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link href="#second" onClick={this.handleClick1}>{c0.code}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#third" onClick={this.handleClick2}>{c1.code}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#fourth" onClick={this.handleClick3}>
                  {c2.code}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#fifth" onClick={this.handleClick4}>
                  {c3.code}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#sixth" onClick={this.handleClick5}>
                  {c4.code}
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body id="0">
            <Prediction code={c0.code}></Prediction>
            <CurrencyView code={c0.code} name={c0.name} rate={c0.rate} comments={c0.comments} predictions={c0.predictions} userPredictions={c0.userPredictions}></CurrencyView>
            <CurrencyView code={c1.code} name={c1.name} rate={c1.rate} comments={c1.comments} predictions={c1.predictions} userPredictions={c1.userPredictions}></CurrencyView>
            <CurrencyView code={c2.code} name={c2.name} rate={c2.rate} comments={c2.comments} predictions={c2.predictions} userPredictions={c2.userPredictions}></CurrencyView>
            <CurrencyView code={c3.code} name={c3.name} rate={c3.rate} comments={c3.comments} predictions={c3.predictions} userPredictions={c3.userPredictions}></CurrencyView>
            <CurrencyView code={c4.code} name={c4.name} rate={c4.rate} comments={c4.comments} predictions={c4.predictions} userPredictions={c4.userPredictions}></CurrencyView>
          </Card.Body>

          <Card.Body hidden id="1">
            <Row>

              <Col md={{ span: 6 }}>

                <CurrencyTable code={c0.code} timeRange={"last-100"}></CurrencyTable>
              </Col>
              <Col md={{ span: 6 }}>
                <CurrencyView code={c0.code} name={c0.name} rate={c0.rate} comments={c0.comments} predictions={c0.predictions} userPredictions={c0.userPredictions}></CurrencyView>
              </Col>
            </Row>

          </Card.Body>

          <Card.Body hidden id="2">
            <Row>

              <Col md={{ span: 6 }}>

                <CurrencyTable code={c1.code} timeRange={"last-100"}></CurrencyTable>
              </Col>
              <Col md={{ span: 6 }}>
                <CurrencyView code={c1.code} name={c1.name} rate={c1.rate} comments={c1.comments} predictions={c1.predictions} userPredictions={c1.userPredictions}></CurrencyView>
              </Col>
            </Row>
          </Card.Body>

          <Card.Body hidden id="3">
            <Row>

              <Col md={{ span: 6 }}>

                <CurrencyTable code={c2.code} timeRange={"last-100"}></CurrencyTable>
              </Col>
              <Col md={{ span: 6 }}>
                <CurrencyView code={c2.code} name={c2.name} rate={c2.rate} comments={c2.comments} predictions={c2.predictions} userPredictions={c2.userPredictions}></CurrencyView>
              </Col>
            </Row>

          </Card.Body>

          <Card.Body hidden id="4">
            <Row>

              <Col md={{ span: 6 }}>

                <CurrencyTable code={c3.code} timeRange={"last-100"}></CurrencyTable>
              </Col>
              <Col md={{ span: 6 }}>
                <CurrencyView code={c3.code} name={c3.name} rate={c3.rate} comments={c3.comments} predictions={c3.predictions} userPredictions={c3.userPredictions}></CurrencyView>
              </Col>
            </Row>

          </Card.Body>

          <Card.Body hidden id="5">
            <Row>

              <Col md={{ span: 6 }}>

                <CurrencyTable code={c4.code} timeRange={"last-100"}></CurrencyTable>
              </Col>
              <Col md={{ span: 6 }}>
                <CurrencyView code={c4.code} name={c4.name} rate={c4.rate} comments={c4.comments} predictions={c4.predictions} userPredictions={c4.userPredictions}></CurrencyView>
              </Col>
            </Row>

          </Card.Body>

        </Card>
      </Col>

    );

  }
}
export default Currencies;