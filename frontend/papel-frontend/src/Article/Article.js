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

class Article extends React.Component {
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
    this.state = {loggedIn: loggedIn, userId:userId, commentText:"", id: this.props.match.params.id, article: {}, articleLoading: true, authorLoading: true, author: {}};
    this._article={};
    this._article_vote_type=0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCommentEditorChange = this.handleCommentEditorChange.bind(this);
    this.handleCommentEditorSubmit = this.handleCommentEditorSubmit.bind(this);
  }
  componentDidMount() {
    const {cookies} = this.props;
    const self = this;
    const request_url = "http://ec2-18-197-152-183.eu-central-1.compute.amazonaws.com:3000/article/" + this.state.id;
    this.setState({articleLoading: true});
    $.get(request_url, data => {
      self.setState({articleLoading: false, article: data, authorLoading: true});
      const request_url = "http://ec2-18-197-152-183.eu-central-1.compute.amazonaws.com:3000/user/" + data.authorId;
      $.get(request_url, user => {this.setState( {author: user, authorLoading: false} ) } );
      self._article=this.state.article;
      }
    )
  }

  handleCommentEditorChange(event) {
    this.setState({commentText: event.target.value});
  }

  handleCommentEditorSubmit(event) {
    const {cookies} = this.props;
    if (!this.state.loggedIn) {
      alert("To add a comment please log in.");
    }
    else{
      event.preventDefault();
      var comment = {body : this.state.commentText};
      // $.ajax({
      //   type: "POST",
      //   url: "http://ec2-18-197-152-183.eu-central-1.compute.amazonaws.com:3000/article/"+this.state.id+"/comment",
      //   dataType: 'json',
      //   async: true,
      //   data: comment,
      //   success: () => console.log("Wow! It's a response: "),
      //   beforeSend: (xhr) => xhr.setRequestHeader("Authorization", "Bearer " + cookies.get('userToken'))
      // })
      postRequest({
        url: "http://ec2-18-197-152-183.eu-central-1.compute.amazonaws.com:3000/article/"+this.state.id+"/comment",
        data: comment,
        success: function() { console.log("Comment sent!") },
        authToken: cookies.get('userToken')
      })
    }
  }
  /*this.setState({article:{ voteCount:voteCount+1, title:article.title}})*/
  handleSubmit(event) {
    if(this._article_vote_type==1){
      this.setState({
        article: {
          ...this.state.article,
          voteCount: this.state.article ? this.state.article.voteCount + 1 : 0,
        }
      });
    }
    if(this._article_vote_type==2){
      this.setState({
        article: {
          ...this.state.article,
          voteCount: this.state.article ? this.state.article.voteCount - 1 : 0,
        }
      });
    }
  }
  render() {
    var article = this.state.article;
    var author = this.state.author;
    var authorLine;
    var voteCount = this.state.article.voteCount;
    var comments = this.state.article.comments;
    var userId = this.state.userId;
    console.log(userId);
    var loggedIn = this.state.loggedIn;

    if (this.state.authorLoading)
      authorLine = <p style={{color: "gray"}}>author not found</p> ;
    else
      authorLine = <a href={"../user/" + author._id} style={{color: "gray"}}>by {author.name} {author.surname}</a> ;
    return (
      <Row className="article">
        <Col sm={{span: 10, offset: 1}} xs={{span: 12}} style={{marginBottom: 20}}>
          <Card>
            <Card.Body>
              <Card.Title><h1>{article.title}</h1></Card.Title>
              {authorLine}
              <hr />
              <Card.Text>{article.body}</Card.Text>
              <hr/>
            </Card.Body>
            <Row className="" >
                <Col sm={{span: 4, offset: 1}} xs={{span: 12}} style={{marginBottom: 20}}>
                 </Col>

                 <Col sm={{span: 2, offset: 0}} xs={{span: 12}} style={{marginBottom: 20}}>
                     &#8593;
                     {this.state.article.voteCount}
                 </Col>

                <Col sm={{span: 2, offset: 0}} xs={{span: 12}} style={{marginBottom: 20}}>
                    <Button size="sm"  onClick={() => {this._article_vote_type=1; this.handleSubmit();}}>
                      <FontAwesomeIcon name="Like" icon={faThumbsUp} />&nbsp;
                    </Button>
                </Col>

                <Col sm={{span: 2, offset: 0}} xs={{span: 12}} style={{marginBottom: 20}}>
                    <Button size="sm"  onClick={() => {this._article_vote_type=2; this.handleSubmit();} }>
                      <FontAwesomeIcon name="Dislike" icon={faThumbsDown} />&nbsp;
                  </Button>
                </Col>

              </Row>

          </Card>

        </Col>

        <Col sm={{span: 10, offset: 1}} xs={{span: 12}} style={{marginBottom: 20}}>
          <label htmlFor="commentEditor"></label>

            <form className="span6" onSubmit={this.handleCommentEditorSubmit}>
              <textarea id="commentBox" value={this.state.commentText} onChange={this.handleCommentEditorChange} className="form-control" id="commentEditor" placeholder="You can share your opinion by adding a comment." rows="4"></textarea>

              <Col  md={{span: 2, offset: 10}}
                  style={{width: "20", marginTop: 5, marginBottom: 10 }}>
                  <Button size="sm" type="submit" >
                    <FontAwesomeIcon icon={faPlus} />&nbsp; Add
                  </Button>
              </Col>
            </form>
        </Col>

        <Col sm={{span: 10, offset: 1}} xs={{span: 12}} style={{marginBottom: 20}}>

          <Card>
            <Card.Body>
              <Card.Title><h4>Comments</h4></Card.Title>
              <hr/>
              { comments ? (comments.map(comment => (
                <CommentPreview key={comment._id} id={comment._id} articleId={this.state.id} authorId={comment.authorId} author={comment.author[0].name +" "+comment.author[0].surname } body={comment.body} date={comment.date} lastEditDate={comment.lastEditDate}  />
              ))) : "Comments are loading" }

            </Card.Body>
          </Card>
        </Col>
      </Row >
    );
  }
}
export default withCookies(Article);
