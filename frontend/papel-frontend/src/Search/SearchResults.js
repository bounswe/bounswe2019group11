import React from 'react';
import { app_config } from "../config";
import $ from 'jquery';
import { Card, Row, Col } from 'react-bootstrap';

import {getRequest as get, postRequest as post} from '../helpers/request'

class SearchResults extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            searchValue: props.match.params.value,
            "articles":[],"currencies":[],events:[],stocks:[],users:[],
        

            results:"loading",
            loading: false
        }
    }

    componentDidMount() {
        
        const self = this;
        let requestUrl = app_config.api_url + "/search/" + this.state.searchValue;

        get({
            url: requestUrl,
            success: (data) => {
                console.log(data)
                this.setState({
                "articles": data.articles,
                currencies:data.currencies,
                events: data.events,
                stocks: data.stocks,
                users: data.users
              })

            }
          })

          

    }


    render() {
        var articles = this.state.articles?this.state.articles:"article loading"
        var line = <br/>
        console.log(articles)
        return (
        
        
            <Card>
            <Row>
                <Col style={{marginLeft:10}}>
                    <Card.Title>
                    Search Results
                    </Card.Title>
                </Col>
            </Row>
            <Card.Body>

            {articles.map(article => (
               <a href= {"../article/" + article._id}>

               <Card.Body>{article.title} 
               </Card.Body>
               </a> 
            
               ))
            }    Nothing found for "{articles.title}" :(
            </Card.Body>

        </Card>    
            )
    }

} export default SearchResults