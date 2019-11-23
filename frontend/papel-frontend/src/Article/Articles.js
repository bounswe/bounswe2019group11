import React from 'react';
import './Article.css';
import $ from 'jquery';
import ArticlePreview from './ArticlePreview';
import {Row, Col, Card, Person, ButtonToolbar, Button, Modal, Form} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


class Articles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: false, redirect: false, articles: []};
  }
  componentDidMount() {
    const self = this;
    this.setState({loading: true});
    $.get("http://ec2-18-197-152-183.eu-central-1.compute.amazonaws.com:3000/article", (data) => {
      self.setState({articles: data, loading: false});
    });
  }

  render() {

    return (
      <Col md={{span: 8, offset: 2}}>
        <Col md={{span: 3}}style={{width: "20",marginLeft: -16, marginBottom: 10}}>
          
          <Button size="sm"  onClick={() => alert("Not implemented yet")}>
            <FontAwesomeIcon icon={faPlus} />&nbsp;
            Add Article
          </Button>
          
        </Col>

      
        <Row>
          <Col md={{span: 12}}>
            {
              this.state.articles.map(article => (
                <ArticlePreview key={article._id} articleId={article._id} title={article.title} text={article.body}  />
              ))
            }
          </Col>
        </Row>
      </Col>


    );
  }
}
export default Articles;