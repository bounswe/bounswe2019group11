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
import EconEvent from './EconEvent/EconEvent';
import EconEvents from './EconEvent/EconEvents';
import Validation from './Register/Validation';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import { useCookies, CookiesProvider } from 'react-cookie';
import { faBell,faExclamation, faPlus,faThumbsUp,faThumbsDown,faSignInAlt, faSignOutAlt, faUser, faNewspaper, faCalendarWeek, faHome, faCheck, faTimes} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {postRequest as post} from './helpers/request';
import {Dropdown, Badge, Row, Col, Button} from 'react-bootstrap';


function NavBar(props) {
  const [cookies, setCookie, removeCookie] = useCookies(['user', 'userToken', 'pendingRequests'])

  var profileBtn, logoutBtn,notificationBtn, registerBtn, loginBtn;

  const [loggedIn, login] = useState(!!cookies.userToken);
  const [notificationCount, setNotificationCount] = useState(0);

  const {acceptFollowRequest, rejectFollowRequest} = props;

  const logout = function () {
    console.log(cookies);
    removeCookie('userToken');
    removeCookie('user');
    removeCookie('pendingRequests');
    login(false);
  }
  if(!!loggedIn) {
  profileBtn = <li><Link to="/profile"> <FontAwesomeIcon name="User Icon" icon={faUser} />&nbsp;
  Profile</Link></li>
    logoutBtn = <li><Link to="/" onClick={() => logout()}><FontAwesomeIcon name="Log Out Icon" icon={faSignOutAlt} />&nbsp;Log Out</Link></li>;

    if (!cookies.pendingRequests) setCookie('pendingRequests', []);

  notificationBtn =
  (<li>
    <Dropdown >
      <Dropdown.Toggle id="dropDown" style={{color:"black" ,fontWeight:"bold"}}>
      <FontAwesomeIcon name="Bell Icon" icon={faBell} />&nbsp;<Badge >{cookies.pendingRequests?cookies.pendingRequests.length : 0}</Badge>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {
          cookies.pendingRequests? cookies.pendingRequests.map(user => (
          <Dropdown.Item className="pending">
            {user.name} {user.surname} wants to follow you
            <br/>
            <Row>
              <Col xs={{span: 4}} onClick={() => acceptFollowRequest(user._id)}>
                <FontAwesomeIcon icon={faCheck} className="clickable success" />
                {" Accept"}
              </Col>
              <Col xs={{span: 4, offset: 2}} onClick={() => rejectFollowRequest(user._id)}>
                <FontAwesomeIcon icon={faTimes} className="clickable danger" />
                {" Reject"}
              </Col>
            </Row>
          </Dropdown.Item>
          ))
          :
          ""
        }
      </Dropdown.Menu>
    </Dropdown>
  </li>)



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
          <Route path="/events"><EconEvents /></Route>
          <Route path="/user/:id" component={UserProfile} />
        </Switch>
      </div>
    </CookiesProvider>
  </Router>);
}

function App() {
  let [cookies, setCookie, removeCookie] = useCookies(['user', 'userToken', 'pendingRequests']);

  function acceptFollow(id) {
    if(!!cookies.userToken) {
      let requestUrl = "http://ec2-18-197-152-183.eu-central-1.compute.amazonaws.com:3000/profile/other/" + id + "/accept"
      post({
        url: requestUrl,
        success: (data) => {
          var pending = cookies.user.followerPending || []
          setCookie('pendingRequests', [])
        },
        authToken: cookies.userToken
      })
    }
    else {
      console.log("Cannot accept before logging in")
    }
  }
  function rejectFollow(id) {
    if(!!cookies.userToken) {
      let requestUrl = "http://ec2-18-197-152-183.eu-central-1.compute.amazonaws.com:3000/profile/other/" + id + "/decline"
      post({
        url: requestUrl,
        success: (data) => {
          setCookie('pendingRequests', cookies.user.followerPending)
        },
        authToken: cookies.userToken
      })
    }
    else {
      console.log("Cannot reject before logging in")
    }
  }

  return (
    <NavBar acceptFollowRequest={acceptFollow} rejectFollowRequest={rejectFollow}/>
  );
}

export default App;
