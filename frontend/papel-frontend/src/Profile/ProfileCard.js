import React from 'react';
import './Profile.css';
import logo from "./logo.jpg"

class ProfileCard extends React.Component {

  render () {

    return (
    <div className="container">
      <div id="profile-card" className="card">
        <div className='row'>
          <div className="col-sm-6">
            <img id="photo" src={logo} style = { {width: 150, height:150, borderRadius:150}} />
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
    </div>

    );
  }
}


export default ProfileCard;
