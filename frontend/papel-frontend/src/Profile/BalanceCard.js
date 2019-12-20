import React, {useState} from 'react';
import './Profile.css';
import logo from "./logo.jpg";
import {useCookies} from 'react-cookie';
import {instanceOf} from 'prop-types'
import {withCookies, Cookies} from 'react-cookie';
import {useParams} from 'react-router-dom';
import {app_config} from "../config";
import $ from 'jquery';
import {Row, Col, Button, Card, Form} from 'react-bootstrap';
import {getRequest} from '../helpers/request';

function BalanceCard(props) {
  const [cookies] = useCookies(['user'])
  const [balance, setBalance] = useState(0);

  var user
  if (props.isMe)
    user = cookies.user
  else
    user = props.user
  console.log("a");
  getRequest({
    url: app_config.api_url + "/money",
    success: (data) => { setBalance(data) },
    authToken: user
    })


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
            {balance} {user.surname}
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


export default BalanceCard;
