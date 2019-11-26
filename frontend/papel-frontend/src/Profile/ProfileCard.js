import React, {useState} from 'react';
import './Profile.css';
import logo from "./logo.jpg";
import {useCookies} from 'react-cookie';

function ProfileCard(props) {
  const [cookies] = useCookies(['user'])
  const [location, setLocation] = useState({})
  var user
  if (props.isMe)
    user = cookies.user
  else
    user = props.user


  // async function please() {
  //   await geocodeLocation()
  //   if (formattedAddress === "")
  //     geocodeLocation()
  //   else
  //     console.log("i cry")
  // }
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
            {props.address === "" ? "" : "📌 " +props.address}
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
