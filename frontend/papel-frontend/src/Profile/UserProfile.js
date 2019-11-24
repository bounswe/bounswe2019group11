import React, { useState } from 'react'
import ProfileCard from './ProfileCard'
import {Row, Col, Card} from 'react-bootstrap'
import {withCookies, Cookies} from 'react-cookie'
import {getRequest as get} from '../helpers/request'
import ArticlePreview from '../Article/ArticlePreview'
import './UserProfile.css'
import Portfolio from './Portfolio'

class UserProfile extends React.Component {
  // const [cookies, setCookie, removeCookie] = useCookies('user', 'userToken')
  // const [user, setUser] = useState({name: "e", surname: "", location: {latitude: 0, longitude: 0}, email: ""})
  constructor(props) {
    super(props)
    this.state = {
      userId: props.match.params.id,
      user: {name: "", surname: "", location: {latitude: 0, longitude: 0}, email: ""},
      articles: [],
      portfolios: [],
      loading: false
    }
  }

  componentDidMount() {
    let requestUrl = "http://ec2-18-197-152-183.eu-central-1.compute.amazonaws.com:3000/profile/" + this.state.userId
    this.setState({loading: true})
    get({
      url: requestUrl,
      success: (data) => {
        console.log(data)
        this.setState({user: data, articles: data.articles, portfolios: data.portfolios})
        this.setState({loading: false})
      }
    })
  }
  render() {
    return (
    <>
      <Row>
        <Col md={{span: 6}}>
          <ProfileCard isMe={false} user={this.state.user}/>
        </Col>
        <Col md={{span: 6}}>
          <h3>Porfolios:</h3>
          <Row>
            <Col>
              {this.state.portfolios.map(portfolio => (
                <Portfolio key={portfolio._id} portfolio={portfolio} />
              ))}
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card  >
            <Card.Title style={{textAlign: "center"}}>
              <h3>My Articles</h3>
              <hr/>
            </Card.Title>
            <Card.Body className="my-articles container-fluid">
              <Row className="flex-row flex-nowrap">
                {this.state.articles.map(article => (
                  <Col key={article._id} sm={{span: 6}} style={{float: "left"}}>
                  <ArticlePreview articleId={article._id} title={article.title} text={article.body} fixedHeight={240} />
                  </Col>
                ))}
              </Row>
            </Card.Body>

          </Card>
        </Col>
      </Row>
    </>
    )
  }
}
export default withCookies(UserProfile)
