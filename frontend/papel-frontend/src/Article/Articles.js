import React from 'react';
import './Article.css';
import $ from 'jquery';
import {app_config} from "../config";
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
    $.get(app_config.api_url + "/article", (data) => {
      self.setState({articles: data.reverse(), loading: false});
    });
    
  }
  handleAddArticle(){
    window.location.replace("./AddArticle")
  }

  render() {
    
    return (
      <Col md={{span: 8, offset: 2}}>
        <Col md={{span: 3}}style={{width: "20",marginLeft: -16, marginBottom: 10}}>
          
          <Button size="sm"  onClick={this.handleAddArticle}>
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