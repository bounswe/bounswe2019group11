import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';
import './Article.css';
import {useParams} from 'react-router-dom';
import $ from 'jquery';
import {Row, Col, Card} from 'react-bootstrap';

class ArticleEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
  }

  onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'BOLD'
    ));
  }

  render() {
    return (
      <div id="content">
        <h4>Edit Article:</h4>
        <div className="editor">
          <Editor editorState={this.state.editorState} onChange={this.onChange} />
        </div>
      </div>
    );
  }
}

class Article extends React.Component {
  constructor(props) {
    super(props);
    this.state = {id: this.props.match.params.id, article: {}, articleLoading: true, authorLoading: true, author: {}};
  }
  componentDidMount() {
    const self = this;
    const request_url = "http://ec2-18-197-152-183.eu-central-1.compute.amazonaws.com:3000/article/" + this.state.id;
    this.setState({articleLoading: true});
    $.get(request_url, data => {
      this.setState({articleLoading: false, article: data, authorLoading: true});
      const request_url = "http://ec2-18-197-152-183.eu-central-1.compute.amazonaws.com:3000/user/" + data.authorId;
      $.get(request_url, user => {
        this.setState({author: user, authorLoading: false})
      })
    })
  }

  render() {
    var article = this.state.article;
    var author = this.state.author;
    var authorLine;
    if (this.state.authorLoading)
      authorLine = <p style={{color: "gray"}}>author not found</p> ;
    else
      authorLine = <p style={{color: "gray"}}>by {author.name} {author.surname}</p> ;
    return (
      <Row className="article">
        <Col sm={{span: 10, offset: 1}} xs={{span: 12}}>
          <Card>
            <Card.Body>
              <Card.Title><h1>{article.title}</h1></Card.Title>
              {authorLine}
              <hr />
              <Card.Text>{article.body}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }
}
export default Article;
