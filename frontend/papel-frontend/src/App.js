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
import { faPlus,faThumbsUp,faThumbsDown,faSignInAlt, faSignOutAlt, faUser, faNewspaper, faCalendarWeek, faHome} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';


function NavBar(props) {
  const [cookies, setCookie, removeCookie] = useCookies(['name', 'user', 'userToken'])
  var profileBtn, logoutBtn, registerBtn, loginBtn;
  const [loggedIn, login] = useState(!!cookies.userToken);

  const logout = function () {
    console.log(cookies);
    removeCookie('userToken');
    removeCookie('user');
    removeCookie('name');
    login(false);
  }
  if(!!loggedIn) {
  profileBtn = <li><Link to="/profile"> <FontAwesomeIcon name="User Icon" icon={faUser} />&nbsp;
  Profile</Link></li>
    logoutBtn = <li><Link to="/" onClick={() => logout()}><FontAwesomeIcon name="Login Icon" icon={faSignOutAlt} />&nbsp;Logout</Link></li>;
  }
  else {
    loginBtn = <li><Link to="/login" style={{paddingLeft:0}}><FontAwesomeIcon name="Login Icon" icon={faSignInAlt} />&nbsp;Login</Link></li>;
    
  }
  return (
  <Router>
    <ul id="menu">
      <Link to="/">
        <img id="logo-green-small" className="menu-logo" src={Logo} style = { { borderright: "2px solid rgba(0, 0, 0, 0.151)", width: 390/3, height: 135/3}} />
      </Link>
      <li><Link to="/#"><FontAwesomeIcon name="Article Icon" icon={faHome} />&nbsp;Home</Link></li>
      {loginBtn}
      {registerBtn}
      {profileBtn}
      <li><Link to="/articles"><FontAwesomeIcon name="Article Icon" icon={faNewspaper} />&nbsp;Articles</Link></li>
      <li><Link to="/events"><FontAwesomeIcon name="Events Icon" icon={faCalendarWeek} />&nbsp;Events</Link></li>

      {logoutBtn}

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
  let [cookies, setCookie, removeCookie] = useCookies(['user', 'userToken']);


  return (
    <NavBar />
  );
}

export default App;
