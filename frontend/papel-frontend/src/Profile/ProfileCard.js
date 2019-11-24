import React, {useState} from 'react';
import './Profile.css';
import logo from "./logo.jpg";
import {useCookies} from 'react-cookie';
import { getFormattedAddress } from '../helpers/geocoder';

function ProfileCard() {
  const [cookies] = useCookies(['user']);
  const [formattedAddress, setFormattedAddress] = useState("");

  var user = cookies.user;
  var geocodeLocation = async function() {
    var response = await getFormattedAddress(user.location)
    if (response.status !== 'error') {
      setFormattedAddress(response.result)
      console.log(response.result)
    }
    else {
      setFormattedAddress("")
      console.log("Error: " + response.message)
    }
  }()

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
            {formattedAddress === "" ? "" : "📌 " +formattedAddress}
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
