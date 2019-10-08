import React from 'react';
import './style/Profile.css';
import ProfileCard from './ProfileCard'
import logo from "./logo.jpg"


  console.log(logo);

class Profile extends React.Component {

  render () {
    return (
      <div>
      <ProfileCard/>
      </div>
    );
  }
}

export default Profile;
