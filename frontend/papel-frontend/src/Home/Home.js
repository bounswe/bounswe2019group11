import React from 'react';
import USD from "./USD";
import CurencyChart from "./CurencyChart"
import StockChart1 from "./StockChart1";
import StockChart2 from "./StockChart2";
import {Editor, EditorState, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';
import './Home.css';
import ArticleListPreview from "./ArticleListPreview"
import EventListPreview from "./EventListPreview"
import {useParams} from 'react-router-dom';
import $ from 'jquery';
import {app_config} from "../config";
import {Row, Col, Button, Card} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPlus,faThumbsUp,faThumbsDown } from '@fortawesome/free-solid-svg-icons';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: false, redirect: false, articles: [], events: [], previewer1article:"active",previewer1event:"",previewer2USD:"active",previewer2EUR:"",previewer3stock1:"active",previewer3stock2:""};
    this.handleArticleClick=this.handleArticleClick.bind(this);
    this.handleEventClick=this.handleEventClick.bind(this);
    this.handleUSDClick=this.handleUSDClick.bind(this);
    this.handleEURClick=this.handleEURClick.bind(this);

    this.handleStock1Click=this.handleStock1Click.bind(this);
    this.handleStock2Click=this.handleStock2Click.bind(this);


  }
  
  componentDidMount() {
    var emptyEvent = {
      "title": "No Title Found",
      "body": " No event to show :(",
      "comment": [
        "No comment"
      ],
      "date": "No date",
      "rank": 0,
      "country": "No country"
    };
    var emptyArticle = {
      "_id": "",
      "title": "No article to show",
      "body": "No article",
      "authorId": "",
      "voteCount": "",
      "date": "",
      "author": {
        "name": "",
        "surname": ""
      },
      "userVote": 0,
      "comments": []
    }
    const self = this;
    this.setState({loading: true});
    $.get(app_config.api_url + "/article", (data) => {
      data.reverse();
      self.setState({articles: [
        data[0]?data[0]:emptyArticle,
        data[1]?data[1]:emptyArticle,
        data[2]?data[2]:emptyArticle,
        data[3]?data[3]:emptyArticle,
        data[4]?data[4]:emptyArticle],
         loading: false});
    });
    $.get(app_config.api_url + "/event", (data) => {
      data.reverse();
      self.setState({events: [
        data[0]?data[0]:emptyEvent,
        data[1]?data[1]:emptyEvent,
        data[2]?data[2]:emptyEvent,
        data[3]?data[3]:emptyEvent,
        data[4]?data[4]:emptyEvent],
         loading: false});
    });
  }

  handleEventClick(event) {
    this.setState({previewer1article:""});
    this.setState({previewer1event:"active"});
    Array.from(document.getElementsByClassName("ArticleSection")).forEach((item) => {
      item.setAttribute('hidden', null);
       });
    Array.from(document.getElementsByClassName("EventSection")).forEach((item) => { item.removeAttribute('hidden'); });

  }
  handleArticleClick(event) {
    this.setState({previewer1event:""});
    this.setState({previewer1article:"active"});
    Array.from(document.getElementsByClassName("ArticleSection")).forEach((item) => { item.removeAttribute('hidden'); });
    Array.from(document.getElementsByClassName("EventSection")).forEach((item) => {
      item.setAttribute('hidden', null);
       });
  }

  handleUSDClick(event) {
    this.setState({previewer2EUR:""});
    this.setState({previewer2USD:"active"});
    Array.from(document.getElementsByClassName("USDSection")).forEach((item) => { item.removeAttribute('hidden'); });
    Array.from(document.getElementsByClassName("EURSection")).forEach((item) => {
      item.setAttribute('hidden', null);
       });
  }
  handleEURClick(event) {
    this.setState({previewer2EUR:"active"});
    this.setState({previewer2USD:""});
    Array.from(document.getElementsByClassName("EURSection")).forEach((item) => { item.removeAttribute('hidden'); });
    Array.from(document.getElementsByClassName("USDSection")).forEach((item) => {

      item.setAttribute('hidden', null);
      });
  }
  handleStock1Click(event) {
    this.setState({previewer3stock1:"active"});
    this.setState({previewer3stock2:""});
    Array.from(document.getElementsByClassName("Stock1")).forEach((item) => { item.removeAttribute('hidden'); });
    Array.from(document.getElementsByClassName("Stock2")).forEach((item) => {
      item.setAttribute('hidden', null);
      });
  }
  handleStock2Click(event) {
    this.setState({previewer3stock1:""});
    this.setState({previewer3stock2:"active"});
    Array.from(document.getElementsByClassName("Stock2")).forEach((item) => { item.removeAttribute('hidden'); });
    Array.from(document.getElementsByClassName("Stock1")).forEach((item) => {

      item.setAttribute('hidden', null);
      });
  }
  render() {

    return (
      <Row >

        <Col md={{span: 6}}>
          <div name="v1" className="card text-center">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item" >
                  <a className={"nav-link "+this.state.previewer1article} onClick={this.handleArticleClick} href="#">Articles</a>
                </li>
                <li className="nav-item">
                  <a className={"nav-link "+this.state.previewer1event}  onClick={this.handleEventClick} href="#">Events</a>

                </li>
              </ul>
            </div>

            <div id="a" class="card-body">
            <div  className="ArticleSection">
                <h5 class="card-title">The Newest {this.state.articles.length} Articles</h5>
                <hr/>
                <p className="card-text">
                  {
                    this.state.articles ? this.state.articles.map(article => (
                      <ArticleListPreview key={article._id} articleId={article._id} title={article.title} text={article.body}  />
                    )) : "loading..."
                  }
                </p>
                <a href={"../articles"}>See All...</a>
              
              </div>
              <div  hidden className="EventSection">
                <h5 class="card-title">The Newest {this.state.events.length} Events</h5>

                <hr/>
                <p className="card-text">
                  {
                    this.state.events.map(event => (
                      <EventListPreview key={event._id} articleId={event._id} title={event.title} text={event.body} rank={event.rank} date={event.date} country={event.country}/>
                    ))
                  }
                </p>
                <a href={"../events"}>See All...</a>

              </div>
            </div>
          </div>
        </Col>

        <Col md={{span: 6 ,offset:0}}style ={{marginTop:0,
  marginBottom: 10,
  marginRight: 0,
  marginLeft: 0}}>
          <div name="v2" class="card text-center">
            <div class="card-header">
              <ul class="nav nav-tabs card-header-tabs">
                <li class="nav-item" >
                  <a class={"nav-link "+this.state.previewer2USD} onClick={this.handleUSDClick} >USD</a>
                </li>
                <li class="nav-item">
                  <a class={"nav-link "+this.state.previewer2EUR}  onClick={this.handleEURClick} >EUR</a>

                </li>
              </ul>
            </div>

            <div  className="card-body">
              <div  className="USDSection">
                <USD currency={"USD"}></USD >
              </div>
              <div  hidden className="EURSection">
                <div className="card-text">

                <CurencyChart currency={"EUR"}></CurencyChart >
                </div>
              </div>
            </div>
          </div>
          </Col>
          <Col md={{span: 6 ,offset:0}}style ={{marginTop:0,
  marginBottom: 10,
  marginRight: 0,
  marginLeft: 0}}>
      
          <div name="v3" class="card text-center">
            <div class="card-header">
              <ul class="nav nav-tabs card-header-tabs">
                <li class="nav-item" >
                  <a class={"nav-link "+this.state.previewer3stock1} onClick={this.handleStock1Click} >EMB</a>
                </li>
                <li class="nav-item">
                  <a class={"nav-link "+this.state.previewer3stock2}  onClick={this.handleStock2Click} >DIS</a>
                </li>
              </ul>
            </div>

            <div  class="card-body">
              <div  className="Stock1">

                <StockChart1 stock={"EMB"}></StockChart1 >
              </div>
              <div  hidden className="Stock2">

                <p class="card-text">
                <StockChart2 stock={"DIS"}></StockChart2 >
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Row>

    );
  }
}
export default Home;
