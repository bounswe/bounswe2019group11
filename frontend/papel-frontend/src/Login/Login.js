import React, {useState} from 'react';
import {instanceOf} from 'prop-types';
import './Login.css';
import Logo from '../logo-white.png';
import $ from 'jquery';
import {withCookies, Cookies } from 'react-cookie';
import {Redirect} from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';

class Login extends React.Component {
  static propTypes = {cookies: instanceOf(Cookies).isRequired};

  constructor(props) {
    super(props);
    const {cookies} = props;
    this.state = {email: '', password: '', redirect: false, showError: false, errorMessage: ""}
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
  }
  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  async submit() {
    const {cookies} = this.props;
    var self = this;
    $.post("http://ec2-18-197-152-183.eu-central-1.compute.amazonaws.com:3000/auth/login", {email: this.state.email, password: this.state.password },
    data => {
      cookies.set('userToken', data.token);
      cookies.set('user', data.user);
      self.props.login(true);
      self.setState({redirect: true});
    })
      .fail(obj => {
        const error = obj.responseJSON;
        if (!!error) {
          console.log(error);
          this.setState({showError: true, errorMessage: error.message});
        }
      });
  }
  render () {
    if (this.state.redirect) {
      return <Redirect to="/profile" />;
    }
    return (
      <div id="login-form">

        <Modal
          show={this.state.showError}
          onHide={() => this.setState({showError: false})}
        >
          <Modal.Header closeButton>
            <Modal.Title>Login Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{this.state.errorMessage}</p>
          </Modal.Body>
        </Modal>

        <div className="card container col-sm-4">
            
          <div className="row">
          <img id="logo-white" src={Logo} style = { { margin: "auto", width: "100%", height:"80%"}} />
            
            <div className="col-sm-5">E-Mail: </div>
            <div className="col-sm-7"><input type="text" name="email" onChange={this.handleChange}/></div>
          </div>
          <div className="row">
            <div className="col-sm-5">Password:</div>
            <div className="col-sm-7"><input type="password" name="password" onChange={this.handleChange} /></div>
          </div>
          <div className="row">
            <div className="col-sm-4 offset-sm-4"><button className="btn" onClick = {this.submit}>Login</button></div>
          </div>
          <hr/>
          <div className="row">
            <div className="col-sm-12 offset-sm-1">Not registered yet? <a href="../register">Create an account.</a></div>
          </div>
          
        
        </div>
      </div>
    );
  }
}

export default withCookies(Login);
