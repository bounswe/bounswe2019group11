import React from 'react';
import './Profile.css';
import ProfileCard from './ProfileCard';
import Portfolio from './Portfolio';
import logo from "./logo.jpg";
import {instanceOf} from 'prop-types'
import {withCookies, Cookies} from 'react-cookie';
import {Row, Col, Card} from 'react-bootstrap';
import $ from 'jquery';

class Profile extends React.Component {
  static propTypes = {cookies: instanceOf(Cookies).isRequired};
  constructor(props) {
    super(props);
    const {cookies} = props;
    const loggedIn = !!cookies.get('userToken');
    this.state = {loggedIn: loggedIn, portfolios: []};
  }

  componentDidMount() {
    const {cookies} = this.props;
    const self = this;
    if (this.state.loggedIn) {
      const request_url = "http://localhost:3000/portfolio/user/" + cookies.get('user')._id;
      $.get(request_url , (data) => {
        console.log(data);
        self.setState({portfolios: data});
      });
    }
  }

  render () {
    if (this.state.loggedIn) {
      return (
        <>
          <Row>
            <Col md={{span: 6}}>
              <ProfileCard/>
            </Col>
            <Col md={{span: 6}}>
              <h3>Portfolios: </h3>
              <Row>
                <Col md={{span: 8, offset: 2}}>
                {
                  this.state.portfolios.map (
                    portfolio =>
                    <Portfolio key={portfolio._id} portfolio={portfolio} />
                  )
                }
                </Col>
              </Row>

            </Col>
          </Row>
          <Row>

          </Row>
        </>
      );
    }
    else {
      return (
        <Card><h3 style={{color: "red"}}>Please log in to access profile.</h3></Card>
      );
    }
  }
}

export default withCookies(Profile);
