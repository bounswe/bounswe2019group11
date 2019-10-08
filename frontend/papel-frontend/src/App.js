import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './style/App.css';
import Login from './Login';
import Register from './Register';
import Profile from './Profile'
import asyncComponent from './asyncComponent';

class App extends React.Component {
  constructor(props) { super(props); }

  menuItemOnClick(event) {
    const container = document.getElementById('container');

    switch (event.target.innerHTML) {

      case 'Register':
        ReactDOM.render(<Register />, container);
        break;
      case 'Login':
        ReactDOM.render(<Login />, container);
        break;
      case 'Profile':
        ReactDOM.render(<Profile />, container);
        break;

    }
  }
  render() {
    return (
      <div>
        <ul id="menu">
          <li onClick={this.menuItemOnClick}><strong>Login</strong></li>
          <li onClick={this.menuItemOnClick}><strong>Register</strong></li>
          <li onClick={this.menuItemOnClick}><strong>Profile</strong></li>
        </ul>
        <div id="container"><Profile /></div>
      </div>
    );
  }
}

export default App;
