import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import $ from 'jquery';
import {app_config} from "../config";
import { Card } from 'react-bootstrap'

const url = app_config.api_url + "/";
function Prediction({ code }) {
    const [currency, setCurrency]=useState(0);
    if(!currency)
    {  
        $.get(
            url+"currency/"+code, 
            (data) => { setCurrency(data)}
        ); 
    }
    {console.log(currency)}
    
    return (
        <div>deneme</div>
        
    );

}




export default Prediction;
