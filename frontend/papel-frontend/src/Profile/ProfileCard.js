import React, {useState} from 'react';
import './Profile.css';
import logo from "./logo.jpg";
import {useCookies} from 'react-cookie';
import SimpleReactFileUpload from "./FileUpload";

function ProfileCard(props) {
  const [cookies] = useCookies(['user'])
  const [location, setLocation] = useState({})

  var user

  if (props.isMe){
      user = cookies.user
     // user.avatar = props.user.avatar
  }
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

      <div className="ui card">
          <div className="image">
              <img src={user.avatar}/>
              <SimpleReactFileUpload authToken={cookies.userToken}/>
          </div>
          <div className="content">
              <div className="header">{user.name} {user.surname}</div>
              <div className="meta">{user.privacy}</div>
              <div className="description">{user.bio}</div>
          </div>
          <div className="extra content">

              <a>
                  <i aria-hidden="true" className="user icon"></i>
                  {user.following?.length||0} Following
              </a>

          </div>
          <div className="extra content">
              <a>
                  <i aria-hidden="true" className="user icon"></i>
                  {user.followers?.length||0} Followers
              </a>

          </div>
      </div>
  )
/*
  return (

    <>
      <div className='row'>
        <div className="col-sm-6">
          <img id="photo" src={user.avatar} style = { {width: 150, height:150, borderRadius:150}} />
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
*/
}


export default ProfileCard;
