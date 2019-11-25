import React, {useState} from 'react';
import Logo from './logo-green-small.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Home from './Home/Home';
import Login from './Login/Login';
import Register from './Register/Register';
import Profile from './Profile/Profile';
import UserProfile from './Profile/UserProfile';
import TradingEquipment from './Trading/TradingEquipment';
import Article from './Article/Article';
import Articles from './Article/Articles';
import AddArticle from './Article/AddArticle';
import EconEvent from './EconEvent/EconEvent';
import EconEvents from './EconEvent/EconEvents';
import Validation from './Register/Validation';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import { useCookies, CookiesProvider } from 'react-cookie';
import { faBell,faExclamation, faPlus,faThumbsUp,faThumbsDown,faSignInAlt, faSignOutAlt, faUser, faNewspaper, faCalendarWeek, faHome} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {Dropdown, Badge, Row, Col} from 'react-bootstrap';


function NavBar(props) {
  const [cookies, setCookie, removeCookie] = useCookies(['user', 'userToken'])

  var profileBtn, logoutBtn,notificationBtn, registerBtn, loginBtn;

  const [loggedIn, login] = useState(!!cookies.userToken);

  const logout = function () {
    console.log(cookies);
    removeCookie('userToken');
    removeCookie('user');
    login(false);
  }
  if(!!loggedIn) {
  profileBtn = <li><Link to="/profile"> <FontAwesomeIcon name="User Icon" icon={faUser} />&nbsp;
  Profile</Link></li>
    logoutBtn = <li><Link to="/" onClick={() => logout()}><FontAwesomeIcon name="Log Out Icon" icon={faSignOutAlt} />&nbsp;Log Out</Link></li>;
  
  notificationBtn = <li><Link > 
    
  <Dropdown >
    <Dropdown.Toggle id="dropDown" style={{color:"black" ,fontWeight:"bold"}}>
    <FontAwesomeIcon name="Bell Icon" icon={faBell} />&nbsp;<Badge >9</Badge>
    <span className="sr-only">unread messages</span>
    </Dropdown.Toggle>

    <Dropdown.Menu>
      <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
      <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
      <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>

  
  </Link></li>
  


  }
  
  else {
    loginBtn = <li><Link to="/login" style={{paddingLeft:0}}><FontAwesomeIcon name="Login Icon" icon={faSignInAlt} />&nbsp;Login</Link></li>;
    
  }
  return (
  <Router>
    
    <ul id="menu">
      <Row>
      <Col md={{span:7, offset:1}}>
      <Link to="/">
        <img id="logo-green-small" className="menu-logo" src={Logo} style = { { borderright: "2px solid rgba(0, 0, 0, 0.151)", width: 390/3, height: 135/3}} />
      </Link>
      <li><Link to="/#"><FontAwesomeIcon name="Article Icon" icon={faHome} />&nbsp;Home</Link></li>
      {loginBtn}
      {registerBtn}

      <li><Link to="/articles"><FontAwesomeIcon name="Article Icon" icon={faNewspaper} />&nbsp;Articles</Link></li>
      <li><Link to="/events"><FontAwesomeIcon name="Events Icon" icon={faCalendarWeek} />&nbsp;Events</Link></li>
      </Col><Col md={{span:4}}>
      {notificationBtn}
      {profileBtn}
      {logoutBtn}
      </Col>
      </Row>
    </ul>
    
    <CookiesProvider>
      <div className="container">
        <Switch>
          <Route exact path="/"><Home /></Route>
          <Route path="/login"><Login login={login} /></Route>
          <Route path="/register"><Register /></Route>
          <Route path="/profile"><Profile /></Route>
          <Route path="/stock/:id" component={TradingEquipment}/>
          <Route path="/article/:id" component={Article} />
          <Route path="/event/:id" component={EconEvent} />
          <Route path="/validation"><Validation /></Route>
          <Route path="/articles"><Articles /></Route>
          <Route path="/addarticle"><AddArticle /></Route>
          <Route path="/events"><EconEvents /></Route>
          <Route path="/user/:id" component={UserProfile} />
        </Switch>
      </div>
    </CookiesProvider>
  </Router>);
}

function App() {
  let [cookies, setCookie, removeCookie] = useCookies(['user', 'userToken']);


  return (
    <NavBar />
  );
}

export default App;
