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
    this.state = {id: this.props.match.params.id, article: {}};
  }
  componentDidMount() {
    var request_url = "http://localhost:3000/article/" + this.state.id;
    $.get(request_url, data => {
      this.setState({article: data});

    })
  }

  render() {
    var article = this.state.article;
    return (
      <Row className="article">
        <Col sm={{span: 10, offset: 1}} xs={{span: 12}}>
          <Card>
            <Card.Body>
              <Card.Title><h1>{article.title}</h1></Card.Title>
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
