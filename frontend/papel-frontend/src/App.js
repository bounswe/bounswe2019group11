import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Home from './Home/Home';
import Login from './Login/Login';
import Register from './Register/Register';
import Profile from './Profile/Profile';
import TradingEquipment from './Trading/TradingEquipment';
import Article from './Article/Article';
import Articles from './Article/Articles';
import Validation from './Register/Validation';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
/*    this.state = { showPopup: false }; */
  }

  
  render() {
    return (
      <Router>
        <ul id="menu">
          <li><Link to="/">HOME</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
        <div className="container">
          <Switch>
            <Route exact path="/"><Home /></Route>
            <Route path="/login"><Login /></Route>
            <Route path="/register"><Register /></Route>
            <Route path="/profile"><Profile /></Route>
            <Route path="/currency/:id"><TradingEquipment /></Route>
            <Route path="/article/:id"><Article /></Route>
            <Route path="/validation"><Validation /></Route>
            <Route path="/articles"><Articles /></Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
