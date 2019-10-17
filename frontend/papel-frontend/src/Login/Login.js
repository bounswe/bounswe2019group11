import React from 'react';
import './Login.css';
import $ from 'jquery';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {email: '', password: ''}

    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
  }
  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  async submit() {
    console.log("Current Data:");
    console.log(this.state);
    /*
    const response = await fetch('localhost:3000/auth/login', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify()
    });
    const status = await response.status;
    if (status == 200) console.log(response.json())
    else console.log(status);*/
    $.post("https://papel-dev.herokuapp.com/auth/login", this.state, function(resp, data) {
      console.log(resp);
      if (resp == 200) console.log(data);
    });
  }
  render () {
    return (
      <div id="login-form">
          <div className="card container col-sm-4">
            <div className="row">
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
        </div>
      </div>
    );
  }
}

export default Login;
