import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './style/App.css';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import Popup from './Popup';
import TradingEquipment from './TradingEquipment';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
/*    this.state = { showPopup: false }; */
  }

  /*togglePopup() {
    this.setState({
    showPopup: !this.state.showPopup
    });
  }
*/
  render() {
    return (
      <Router>
        <ul id="menu">
          <li><Link to="/">HOME</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
        <Switch>
          <Route exact path="/"><Home /></Route>
          <Route path="/login"><Login /></Route>
          <Route path="/register"><Register /></Route>
          <Route path="/profile"><Profile /></Route>
          <Route path="/currency/:id"><TradingEquipment /></Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
