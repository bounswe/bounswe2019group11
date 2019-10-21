import React from 'react';
import './Profile.css';
import ProfileCard from './ProfileCard';
import logo from "./logo.jpg";
import {instanceOf} from 'prop-types'
import {withCookies, Cookies} from 'react-cookie';
import {Card} from 'react-bootstrap';
import $ from 'jquery';

class Profile extends React.Component {
  static propTypes = {cookies: instanceOf(Cookies).isRequired};
  constructor(props) {
    super(props);
    const {cookies} = props;
    const loggedIn = !!cookies.get('userToken');
    this.state = {loggedIn: loggedIn};
  }

  componentDidMount() {
    const {cookies} = this.props;
    $.get("http://localhost:3000/portfolio", (data) => {
      console.log(data);
    });
  }

  render () {
    if (this.state.loggedIn) {
      return (
        <ProfileCard/>
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
