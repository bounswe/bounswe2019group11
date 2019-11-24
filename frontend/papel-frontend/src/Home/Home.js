import React from 'react';
import USD from "./USD";
import CurencyChart from "./CurencyChart"
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
    this.state = {loading: false, redirect: false, articles: [], previewer1article:"active",previewer1event:"",previewer2USD:"active",previewer2EUR:""};
    this.handleArticleClick=this.handleArticleClick.bind(this);
    this.handleEventClick=this.handleEventClick.bind(this);
    this.handleUSDClick=this.handleUSDClick.bind(this);
    this.handleEURClick=this.handleEURClick.bind(this);

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

            <div  className="card-body">
            <div  className="ArticleSection">
                <h5 className="card-title">3 Newest Articles</h5>
                <hr/>
                <div className="card-text">
                  {

                    this.state.articles ? this.state.articles.map(article => (
                      <ArticleListPreview key={article._id} articleId={article._id} title={article.title} text={article.body}  />
                    )) : "loading..."
                  }
                </div>
              </div>
              <div  hidden className="EventSection">
                <h5 className="card-title">3 Newest Events</h5>
                <hr/>
                <div className="card-text">
                  {
                    this.state.articles.map(article => (
                      <ArticleListPreview key={article._id} articleId={article._id} title={article.title} text={article.body}  />
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col md={{span: 6}}>
          <div name="v2" className="card text-center">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item" >
                  <a className={"nav-link "+this.state.previewer2USD} onClick={this.handleUSDClick} href="#">USD</a>
                </li>
                <li className="nav-item">
                  <a className={"nav-link "+this.state.previewer2EUR}  onClick={this.handleEURClick} href="#">EUR</a>
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
      </Row>
    );
  }
}
export default Home;
