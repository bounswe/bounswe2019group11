import './style/bootstrap/css/bootstrap.min.css';
import React from 'react';
import './style/Profile.css';
import logo from "./logo.jpg"

class ProfileCard extends React.Component {

  render () {

    return (
    <div id="profile-card" className="card container">

      <div className='row container'>
        <div className="col-sm-6">
          <img id="photo" src={logo} style = { {width: 150, height:150, borderRadius:400/2}} />
        </div>
        <div id= "profile-info" className="col-sm-6" >
          <div className="row">
            NAME SURNAME
          </div>
          <div className="row">
            📌 LOCATION / LOCATION
          </div>
          <div className="row">
            emailaddress@mail.com
          </div>
        </div>
      </div>
    </div>
    );
  }
}


export default ProfileCard;
