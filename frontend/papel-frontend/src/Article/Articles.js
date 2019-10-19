import React from 'react';
import './Article.css';
import {Row, Col, Card} from 'react-bootstrap';

function ArticlePreview({onClick, title, text}) {
  return (
    <Card style={{width: "100%", marginBottom: 10}} onClick={onClick}>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{text.slice(0, 100)}{(text.length < 100) ? "" : "..."}</Card.Text>
      </Card.Body>
    </Card>
  );
}

class Articles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: false, articles: []};
  }
  componentDidMount() {
    this.setState({loading: true});
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(json => this.setState({articles: json, loading: false}));
  }
  render() {
    return (
      <Row>
        <Col md={{span: 8, offset: 2}}>
          {
            this.state.articles.map(article => (
              <ArticlePreview key={article.id} title={article.title} text={article.body} onClick={() => alert("Wow!" + article.id)} />
            ))
          }
        </Col>
      </Row>
    );
  }
}
export default Articles;
