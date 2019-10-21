import React from 'react';
import './Profile.css';
import logo from "./logo.jpg";
import {useCookies} from 'react-cookie';

function ProfileCard() {
  const [cookies] = useCookies(['user']);
  var user = cookies.user;

  return (
    <>
      <div className='row'>
        <div className="col-sm-6">
          <img id="photo" src={logo} style = { {width: 150, height:150, borderRadius:150}} />
        </div>
        <div id= "profile-info" className="col-sm-6" >
          <div className="row">
            {user.name} {user.surname}
          </div>
          <div className="row">
            📌 Lat: {user.location.latitude.toString().slice(0,5)} Lng: {user.location.longitude.toString().slice(0, 5)}
          </div>
          <div className="row">
            {user.email}
          </div>
        </div>
      </div>
    </>
  );

}


export default ProfileCard;
