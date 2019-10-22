import React from 'react';
import './Article.css';
import {Row, Col, Card} from 'react-bootstrap';
import $ from 'jquery';

function ArticlePreview({articleId, title, text}) {
  const path = "../article/" + articleId;
  return (
    <a href={path}>
      <Card style={{width: "100%", marginBottom: 10}}>
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>{text.slice(0, 100)}{(text.length < 100) ? "" : "..."}</Card.Text>
        </Card.Body>
      </Card>
    </a>
  );
}

class Articles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: false, redirect: false, articles: []};
  }
  componentDidMount() {
    const self = this;
    this.setState({loading: true});
    $.get("http://localhost:3000/article", (data) => {
      self.setState({articles: data, loading: false});
    });
  }
  goToArticle(id) {
    console.log(this);
  }
  render() {
    return (
      <Row>
        <Col md={{span: 8, offset: 2}}>
          {
            this.state.articles.map(article => (
              <ArticlePreview key={article._id} articleId={article._id} title={article.title} text={article.body} onClick={this.goToArticle(article.name)} />
            ))
          }
        </Col>
      </Row>
    );
  }
}
export default Articles;
