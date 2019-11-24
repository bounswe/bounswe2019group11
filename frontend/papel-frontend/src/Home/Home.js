import React from 'react';
import USD from "./USD";
import CurencyChart from "./CurencyChart"
import StockChart1 from "./StockChart1";
import StockChart2 from "./StockChart2";
import {Editor, EditorState, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';
import './Home.css';
import ArticleListPreview from "./ArticleListPreview"
import {useParams} from 'react-router-dom';
import $ from 'jquery';
import {Row, Col, Button, Card} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPlus,faThumbsUp,faThumbsDown } from '@fortawesome/free-solid-svg-icons';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: false, redirect: false, articles: [], previewer1article:"active",previewer1event:"",previewer2USD:"active",previewer2EUR:"",previewer3stock1:"active",previewer3stock2:""};
    this.handleArticleClick=this.handleArticleClick.bind(this);
    this.handleEventClick=this.handleEventClick.bind(this);
    this.handleUSDClick=this.handleUSDClick.bind(this);
    this.handleEURClick=this.handleEURClick.bind(this);
    this.handleStock1Click=this.handleStock1Click.bind(this);
    this.handleStock2Click=this.handleStock2Click.bind(this);

  }
  componentDidMount() {
    const self = this;
    this.setState({loading: true});
    $.get("http://ec2-18-197-152-183.eu-central-1.compute.amazonaws.com:3000/article", (data) => {
      self.setState({articles: [data[0],data[1],data[2  ]], loading: false});
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

        <Col md={{span: 6 ,offset:0}}  style ={{marginTop:0,
  marginBottom: 0,
  marginRight: 0,
  marginLeft: 0}}>
          <div name="v1" class="card text-center">
            <div class="card-header">
              <ul class="nav nav-tabs card-header-tabs">
                <li class="nav-item" >
                  <a class={"nav-link "+this.state.previewer1article} onClick={this.handleArticleClick} href="#">Articles</a>
                </li>
                <li class="nav-item">
                  <a class={"nav-link "+this.state.previewer1event}  onClick={this.handleEventClick} href="#">Events</a>
                </li>
              </ul>
            </div>

            <div  class="card-body">
            <div  className="ArticleSection">
                <h5 class="card-title">3 Newest Articles</h5>
                <hr/>
                <p class="card-text">
                  {

                    this.state.articles ? this.state.articles.map(article => (
                      <ArticleListPreview key={article._id} articleId={article._id} title={article.title} text={article.body}  />
                    )) : "loading..."
                  }
                </p>
              </div>
              <div  hidden className="EventSection">
                <h5 class="card-title">3 Newest Events</h5>
                <hr/>
                <p class="card-text">
                  {
                    this.state.articles.map(article => (
                      <ArticleListPreview key={article._id} articleId={article._id} title={article.title} text={article.body}  />
                    ))
                  }
                </p>
              </div>
            </div>
          </div>
        </Col>
        <Col md={{span: 6 ,offset:0}}style ={{marginTop:0,
  marginBottom: 0,
  marginRight: 0,
  marginLeft: 0}}>
          <div name="v2" class="card text-center">
            <div class="card-header">
              <ul class="nav nav-tabs card-header-tabs">
                <li class="nav-item" >
                  <a class={"nav-link "+this.state.previewer2USD} onClick={this.handleUSDClick} href="#">USD</a>
                </li>
                <li class="nav-item">
                  <a class={"nav-link "+this.state.previewer2EUR}  onClick={this.handleEURClick} href="#">EUR</a>
                </li>
              </ul>
            </div>

            <div  class="card-body">
              <div  className="USDSection">

                <USD currency={"USD"}></USD >
              </div>
              <div  hidden className="EURSection">

                <p class="card-text">
                <CurencyChart currency={"EUR"}></CurencyChart >
                </p>
              </div>
            </div>
          </div>

          <div name="v3" class="card text-center">
            <div class="card-header">
              <ul class="nav nav-tabs card-header-tabs">
                <li class="nav-item" >
                  <a class={"nav-link "+this.state.previewer3stock1} onClick={this.handleStock1Click} href="#">EMB</a>
                </li>
                <li class="nav-item">
                  <a class={"nav-link "+this.state.previewer3stock2}  onClick={this.handleStock2Click} href="#">DIS</a>
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
