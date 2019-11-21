import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';
import './Article.css';
import {useParams} from 'react-router-dom';
import $ from 'jquery';
import {Row, Col, Button, Card, Form } from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPlus,faThumbsUp,faThumbsDown, faUserCircle} from '@fortawesome/free-solid-svg-icons';

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
  printID(id) {
    alert(id);
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
        <Col sm={{span: 10, offset: 1}} xs={{span: 12}} style={{marginBottom: 20}}>
          <Card>
            <Card.Body>
              <Card.Title><h1>{article.title}</h1></Card.Title>
                <a href="http://localhost:3000">{authorLine}</a>
              <hr />
              <Card.Text>{article.body}</Card.Text>
            </Card.Body>
            <hr/>
            <Row className="" >
                <Col sm={{span: 6, offset: 1}} xs={{span: 12}} style={{marginBottom: 20}}>
                 </Col>

                <Col sm={{span: 2, offset: 0}} xs={{span: 12}} style={{marginBottom: 20}}>
                    <Button size="sm"  onClick={() => alert("impelement et")}>
                      
                      <FontAwesomeIcon name="Like" icon={faThumbsUp} />&nbsp;
                      !15!
                    </Button>  
                </Col>

                <Col sm={{span: 2, offset: 0}} xs={{span: 12}}style={{marginBottom: 20}}>
                  <Button size="sm"  onClick={() => alert("implement et")}>
                    <FontAwesomeIcon name="Dislike" icon={faThumbsDown} />&nbsp;        
                    !5!
                  </Button>
                </Col>
          
              </Row>

          </Card>
          
        </Col>

        <Col sm={{span: 10, offset: 1}} xs={{span: 12}} style={{marginBottom: 20}}>
          <label for="commentEditor">You can share your opinion</label>
          <Form action="google.com">
            <textarea class="form-control" id="commentEditor" rows="4"></textarea>
            
            <Col  md={{span: 2, offset: 10}}
                style={{width: "20", marginTop: 5, marginBottom: 10 }}>
                <Button size="m" type="submit" onClick={() => alert("text")}>
                  <FontAwesomeIcon icon={faPlus} />&nbsp; Add 
                </Button>
            </Col>
          </Form>
        </Col>

      

        <Col sm={{span: 10, offset: 1}} xs={{span: 12}} style={{marginBottom: 20}}>
          <Card>
            <Card.Body>
              <Card.Title><h4>Comments</h4></Card.Title>
            
                <hr />

              <Card.Title >
                <h6><FontAwesomeIcon name="Like" icon={faUserCircle} />&nbsp; Burak Yılmaz</h6>
              </Card.Title>
              
              <Card.Text >
                This is a very nice place holder comment. Isn't it? :)
              </Card.Text>
              
              <Row className="">

                <Col sm={{span: 2, offset: 0}} xs={{span: 12}}>
                  
                  <Button size="sm"  onClick={() => alert("impelement et")}>
                    
                    <FontAwesomeIcon name="Like" icon={faThumbsUp} />&nbsp;
                    !15!
                  </Button>

                </Col>

                <Col sm={{span: 2, offset: 0}} xs={{span: 12}}>
                  
                  <Button size="sm"  onClick={() => alert("implement et")}>
                    <FontAwesomeIcon name="Dislike" icon={faThumbsDown} />&nbsp;        
                    !5!
                  </Button>

                  
                </Col>
          
              </Row>

            
              
            </Card.Body>
          </Card>
        </Col>

      </Row >
    );
  }
}
export default Article;
