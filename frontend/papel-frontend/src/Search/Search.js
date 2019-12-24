import React, { useState } from 'react';
import { useCookies, CookiesProvider } from 'react-cookie';
import { app_config } from "../config";
import { postRequest as post } from '../helpers/request';
import { Dropdown, Badge, Row, Col, Button, FormControl, Form, InputGroup } from 'react-bootstrap';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import $ from 'jquery';

function Search() {
    let [value, setValue] = useState("");
    let [result, setResult] = useState("");

    var _url = app_config.api_url + "/";
    if (!(value == "")) {
        $.get(
            _url + "search/" + value,
            (data) => { setResult(data) }
        );
    }
    let onChange = (e) => {
        setValue(e.target.value);

        console.log(result)
    }
    
    let onClick = (e) => {
        window.location.replace("../search-results/"+value) 
    }
    let searchBox = <div>
       
        <InputGroup className="mb-3">
            <FormControl placeholder="Search" onChange={onChange} />
            <InputGroup.Append>
                <Button variant="outline-secondary" onClick={onClick}>
                    <FontAwesomeIcon name="Search-Icon" icon={faSearch} />
                </Button>
            </InputGroup.Append>
        </InputGroup>
    </div>;
    return (
        searchBox
    );
} export default Search; 