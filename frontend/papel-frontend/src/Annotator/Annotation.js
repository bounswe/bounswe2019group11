import React from 'react';
import {instanceOf} from 'prop-types'
import {withCookies, Cookies} from 'react-cookie';
import {useParams} from 'react-router-dom';
import {app_config} from "../config";
import $ from 'jquery';
import {Row, Col, Button, Card,OverlayTrigger, Popover} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPlus,faThumbsUp,faThumbsDown, faUserCircle, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {postRequest} from '../helpers/request';



class Annotation extends React.Component {
    



    render(){

        return(

            <html>
            <head>
            <title>Page Title</title>
            </head>
            <body>

            <h1>This is a Heading</h1>
            <p>This is a paragraph.</p>

            </body>
            <script>
                


            </script>
            </html>
        );
    }
} export default Annotation;