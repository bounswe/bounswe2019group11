import React from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { app_config } from '../config'
import { getRequest as get, postRequest as post } from '../helpers/request'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faArrowUp, faArrowDown, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import './Alert.css'

class Alert extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      alert: {direction: "", rate: ""},
      secondHidden: true,
      thirdHidden: true,
      above: true
    }
    this.setAlert = this.setAlert.bind(this)
    this.handleValueChange = this.handleValueChange.bind(this)
  }

  setAlert() {
    const code = this.props.code
    const authToken = this.props.authToken
    const request_url = app_config.api_url + "/currency/" + code + "/alert"
    const alert = this.state.alert
    post({
      url: request_url,
      data: alert,
      success: (resp) => console.log("Alert set successfuly"),
      authToken: authToken
    })
  }

  handleSecond(text) {
    this.setState({thirdHidden: false, above: (text === "above")})
  }

  handleValueChange(event) {
    const direction = this.state.above === "above" ? 1 : -1
    const value = parseFloat(event.target.value)
    this.setState({alert: {direction: direction, rate: value}})
  }

  render() {
    return (
      <Row className="alert-row">
        <Col
        onMouseLeave={() => this.setState({secondHidden: true, thirdHidden: true})}
        >
          <Row>
            <Col
            sm={{span: 2}}
            className="alert-first"
            onMouseEnter={() => this.setState({secondHidden: false})}
            >
            <FontAwesomeIcon name="SetAlert" icon={faBell}/>&nbsp;
            Alert me!
            </Col>
            <Col sm={{span: 4}}>
            <div className="alert-second" hidden={this.state.secondHidden}>
              if..&nbsp;
              <span style={{color: "#ada", cursor: "pointer"}} onClick={() => this.handleSecond("above")}>
              <FontAwesomeIcon name="Above" icon={faArrowUp}/>above
              </span>&nbsp;
              <span style={{color: "#daa", cursor: "pointer"}} onClick={() => this.handleSecond("below")}>
              <FontAwesomeIcon name="Above" icon={faArrowDown}/>below
              </span>
            </div>
            </Col>
            <Col>
              <div className="alert-second" hidden={this.state.thirdHidden}>
                <Row>
                  <Col xs={{span:  2}}>
                  {
                    this.state.above ?
                    <span style={{color: "#ada"}}>
                    <FontAwesomeIcon name="gt" icon={faAngleRight}/>
                    </span> :
                    <span style={{color: "#daa"}}>
                    <FontAwesomeIcon name="lt" icon={faAngleLeft}/>
                    </span>
                  }
                  </Col>
                  <Col xs={{span: 5}}>
                    <Form.Control style={{height: 24, padding: 0, margin: 0}} onChange={this.handleValueChange} type="text"/>
                  </Col>
                  <Col >
                    <div style={{cursor: "pointer", color: "#ddd"}} onClick={this.setAlert}>Set</div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Col>


      </Row>
    )
  }
}

export default Alert
