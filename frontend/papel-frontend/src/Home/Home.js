import React from 'react';
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
    this.state = {loading: false, redirect: false, articles: [], previewer1article:"active",previewer1event:""};
    this.handleArticleClick=this.handleArticleClick.bind(this);
    this.handleEventClick=this.handleEventClick.bind(this);
    
  }
  componentDidMount() {
    const self = this;
    this.setState({loading: true});
    $.get("http://ec2-18-197-152-183.eu-central-1.compute.amazonaws.com:3000/article", (data) => {
      self.setState({articles: [data[0],data[1],data[2  ]], loading: false});
    });
  }
  handleArticleClick(event) {
    this.setState({previewer1event:""});
    this.setState({previewer1article:"active"});
    Array.from(document.getElementsByClassName("ArticleSection")).forEach((item) => { item.removeAttribute('hidden'); });
    Array.from(document.getElementsByClassName("EventSection")).forEach((item) => { 
      item.setAttribute('hidden', null);
      item.lastChild.lastChild.value = ""; });    
  }
  handleEventClick(event) {
    this.setState({previewer1article:""});
    this.setState({previewer1event:"active"});
    Array.from(document.getElementsByClassName("ArticleSection")).forEach((item) => { 
      item.setAttribute('hidden', null);
      item.lastChild.lastChild.value = ""; });
    Array.from(document.getElementsByClassName("EventSection")).forEach((item) => { item.removeAttribute('hidden'); });
    
  }

  render() {
  
    return (
      <Row >

        <Col sm={{span: 6 ,offset:0}} xs={{span: 12}}>
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
                    
                    this.state.articles.map(article => (
                      <ArticleListPreview key={article._id} articleId={article._id} title={article.title} text={article.body}  />
                    ))
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

      </Row>
      
    );
  }
}
export default Home;
