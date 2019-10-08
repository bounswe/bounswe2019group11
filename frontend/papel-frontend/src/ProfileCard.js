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
            SEMİH AKGÜL
          </div>
          <div className="row">
            📌Ataşehir/İSTANBUL
          </div>
          <div className="row">
            semih6014@gmail.com
          </div>
        </div>
      </div>
    </div>
    );
  }
}


export default ProfileCard;
