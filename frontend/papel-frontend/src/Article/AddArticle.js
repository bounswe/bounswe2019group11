import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';
import './Article.css';
import {instanceOf} from 'prop-types'
import {withCookies, Cookies} from 'react-cookie';
import {useParams} from 'react-router-dom';
import $ from 'jquery';
import {Row, Col, Button, Card, Form} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPlus,faThumbsUp,faThumbsDown, faUserCircle} from '@fortawesome/free-solid-svg-icons';
import CommentPreview from './CommentPreview';
import {postRequest} from '../helpers/request';

class AddArticle extends React.Component {
  static propTypes = {cookies: instanceOf(Cookies).isRequired};
  constructor(props) {
    super(props);
    const {cookies} = props;
    const loggedIn = !!cookies.get('userToken');
    var userId ="";
    if(loggedIn) {console.log(cookies.get("userToken"));
     userId = cookies.get('user')._id?cookies.get('user')._id:"check get user id";
    }
    else {console.log("not logged");} 
    this.state = {loggedIn: loggedIn, userId:userId, article:{title:"", body:""}};
    
    
    this.handleArticleTitleChange = this.handleArticleTitleChange.bind(this);
    this.handleArticleBodyChange = this.handleArticleBodyChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    
  }

  handleArticleTitleChange(event) {
    this.setState({article:{title: event.target.value}});
  }

  handleArticleBodyChange(event) {
    this.setState({article: {body: event.target.value}});
  }

  handleSubmit(event) {
      const {cookies} = this.props;
      if (!this.state.loggedIn) {
        alert("To add an comment please log in.");
      }
      else{
        event.preventDefault();
        alert("henüz yazılmadı post atma");
    }
  }
 
  render() {
    
    return (
      <Row className="article">
      
        <Col sm={{span: 10, offset: 1}} xs={{span: 12}} style={{marginBottom: 20}}>
          <label htmlFor="ArticleEditor"></label>

            <form className="span6" onSubmit={this.handleSubmit}>

              <textarea id="articleEditor title" 
                value={this.state.article.title} 
                onChange={this.handleArticleTitleChange} 
                className="form-control"  
                placeholder="Select a title for your article" 
                rows="1"
                style={{marginBottom:10,
                        height:45,
                        minHeight:45,
                        maxHeight:90,
                        fontWeight :  "bold",
                        fontSize: 20  }}>
              </textarea>
  
              <textarea id="articleEditor body" 
                value={this.state.article.body} 
                onChange={this.handleArticleBodyChange} 
                className="form-control"   
                placeholder="Text..." 
                rows="20"
                style={{
                  fontSize:18
                }}>
              </textarea>

              <Col  md={{span: 2, offset: 10}}style={{width: "20", marginTop: 5, marginBottom: 10 }}>
              
                  <Button size="sm" type="submit" >
                     Submit
                  </Button>
              </Col>

            </form>
        </Col>

      </Row >
    );
  }
}
export default withCookies(AddArticle);
