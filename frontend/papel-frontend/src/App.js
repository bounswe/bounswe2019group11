import React from 'react';
import ReactDOM from 'react-dom';
import Logo from './logo-green-small.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Home from './Home/Home';
import Login from './Login/Login';
import Register from './Register/Register';
import Profile from './Profile/Profile';
import TradingEquipment from './Trading/TradingEquipment';
import Article from './Article/Article';
import Articles from './Article/Articles';
import EconEvent from './EconEvent/EconEvent';
import EconEvents from './EconEvent/EconEvents';
import Validation from './Register/Validation';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  
  render() {
    return (
      <Router>
        <ul id="menu">
            
          <Link to="/">
            <img id="logo-green-small" classname="menu-logo" src={Logo} style = { { borderright: "2px solid rgba(0, 0, 0, 0.151)", width: 390/4, height: 135/4}} />
          </Link>
          <li><Link to="/login" style={{paddingLeft:0}}>Login</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/articles">Articles</Link></li>
          <li><Link to="/events">Events</Link></li>
        </ul>
        <div className="container">
          <Switch>
            <Route exact path="/"><Home /></Route>
            <Route path="/login"><Login /></Route>
            <Route path="/register"><Register /></Route>
            <Route path="/profile"><Profile /></Route>
            <Route path="/currency/:id"><TradingEquipment /></Route>
            <Route path="/article/:id"><Article /></Route>
            <Route path="/event/:id"><EconEvent /></Route>
            <Route path="/validation"><Validation /></Route>
            <Route path="/articles"><Articles /></Route>
            <Route path="/events"><EconEvents /></Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
