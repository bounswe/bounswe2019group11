import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';
import './Article.css';
import {useParams} from 'react-router-dom';
import $ from 'jquery';

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
        <button className="btn" onClick={this.onBoldClick.bind(this)}>Bold</button>
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
    this.state = {article: {}};
  }
  componentDidMount() {
    fetch('https://jsonplaceholder.typicode.com/posts/1')
      .then(response => response.json())
      .then(json => {
        console.log(json);
        this.setState({article: json});
      });
  }

  render() {
    var article = this.state.article;
    return (
      <div className="container">
        <div className="row">
          <div className="col-6 offset-3">
            <div className="row">
              <h3>{article.title}</h3>
            </div>
            <div className="row">
              <div className="article"> {article.body} </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Article;
