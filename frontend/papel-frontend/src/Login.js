import './style/bootstrap/css/bootstrap.min.css';
import React from 'react';
import './style/Login.css';

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

  submit() {
    console.log("Current Data:");
    console.log(this.state);
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(response => response.json())
      .then(json => console.log("Store token in cookies"))
  }
  render () {
    return (
      <div id="login-form">
          <div class="card container col-sm-4">
            <div class="row">
              <div class="col-sm-5">E-Mail: </div>
              <div class="col-sm-7"><input type="text" name="email" /></div>
            </div>
            <div class="row">
              <div class="col-sm-5">Password:</div>
              <div class="col-sm-7"><input type="password" name="password" /></div>
            </div>
            <div class="row">
              <div class="col-sm-4 offset-sm-4"><button class="btn">Login</button></div>
            </div>
        </div>
      </div>
    );
  }
}

export default Login;
