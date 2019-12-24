import React from 'react';
import { app_config } from "../config";
import $ from 'jquery';
import { Card, Row, Col } from 'react-bootstrap';

import { getRequest as get, postRequest as post } from '../helpers/request'

class SearchResults extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            searchValue: props.match.params.value,
            "articles": [], "currencies": [], "events": [], "stocks": [], "users": [],


            results: "loading",
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
                    currencies: data.currencies,
                    events: data.events,
                    stocks: data.stocks,
                    users: data.users
                })

            }
        })



    }


    render() {
        var articles = this.state.articles ? this.state.articles : false
        var currencies = this.state.currencies ? this.state.currencies : false
        var users = this.state.users ? this.state.users : false
        var stocks = this.state.stocks ? this.state.stocks : false
        var events = this.state.events ? this.state.events : false
        var articleSection, currencySection, userSection, stockSection, eventSection;


        articleSection =
            <Card.Body>

                ARTICLES<br /><hr />
                
                {articles.length>0? articles.map(article => (
                    <a href={app_config.frontend_url+"/article/" + article._id}>

                        <Card.Body>{article.title}
                        </Card.Body>
                    </a>

                )) : "No article found for this search"
                }
            </Card.Body>
        currencySection =
            <Card.Body>
                CURRENCIES<br /><hr />
                {currencies.length>0?currencies.map(currency => (
                    <a href={app_config.frontend_url+"/currencies/"}>

                        <Card.Body>{currency.code}
                        </Card.Body>
                    </a> 

                )): "No currency found for this search"
                }
            </Card.Body>

        eventSection =
        <Card.Body>
                    EVENTS<br /><hr />
                    {events.length>0 ? events.map(event => (
                        <a href={app_config.frontend_url+ "/events"}>

                            <Card.Body>{event.title + " - " + event.country}
                            </Card.Body>
                        </a>

                    ))
                    : "No event found for this search"}
                </Card.Body>


                        
            userSection =    <Card.Body>
                USERS <br /><hr />
                {users.length>0 ? users.map(user => (
                    <a href={app_config.frontend_url+ "/user/"+user._id}>

                        <Card.Body>{user.name + " " + user.surname}
                        </Card.Body>
                    </a>

                )) : "No user found for this search"
                }
            </Card.Body>

            stockSection = <Card.Body>
                STOCKS <br /><hr />
                {stocks.length>0 ? stocks.map(stock => (
                    <a href={app_config.frontend_url+ "/stock/"+stock._id}>

                        <Card.Body>{stock.stockSymbol}
                        </Card.Body>
                    </a>

                )) : "No stock found for this search"
                }
            </Card.Body>

        console.log(articles)
        return (


            <Card>
                <Row>
                    <Col style={{ marginLeft: 10 }}>
                        <Card.Title>
                            Search Results
                    </Card.Title>
                    </Col>
                </Row>
                {articleSection}
                {currencySection}
                {eventSection}
                {userSection}
                {stockSection}
                
            </Card>
        )
    }

} export default SearchResults