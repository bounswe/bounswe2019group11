import React, { useState } from 'react'
import ProfileCard from './ProfileCard'
import {Row, Col, Card, Button} from 'react-bootstrap'
import {instanceOf} from 'prop-types'
import {withCookies, Cookies} from 'react-cookie'
import {getRequest as get, postRequest as post} from '../helpers/request'
import ArticlePreview from '../Article/ArticlePreview'
import './UserProfile.css'
import Portfolio from './Portfolio'
import { getFormattedAddress } from '../helpers/geocoder'
import {Redirect} from 'react-router-dom'
import {app_config} from "../config";

class UserProfile extends React.Component {
  // const [cookies, setCookie, removeCookie] = useCookies('user', 'userToken')
  // const [user, setUser] = useState({name: "e", surname: "", location: {latitude: 0, longitude: 0}, email: ""})
  static propTypes = {cookies: instanceOf(Cookies).isRequired}
  constructor(props) {
    super(props)
    this.state = {
      userId: props.userId || props.match.params.id,
      user: {name: "", surname: "", location: {latitude: 0, longitude: 0}, email: ""},
      articles: [],
      portfolios: [],
      formattedAddress: "",
      privacy: "public",
      inMyNetwork: false,
      isMe: false,
      loading: false
    }
    this.geocodeLocation = this.geocodeLocation.bind(this)
    this.follow = this.follow.bind(this)
  }

  async geocodeLocation(loc) {
    var response = await getFormattedAddress(loc)
    if (response.status !== 'error') {
      this.setState({formattedAddress: response.result})
    }
    else {
      this.setState({formattedAddress: ""})
      console.log("Error: " + response.message)
    }
  }

  componentDidMount() {
    const {cookies} = this.props
    const userToken = cookies.get('userToken')
    let requestUrl = app_config.api_url + "/profile/other/" + this.state.userId
    this.setState({loading: true})
    get({
      url: requestUrl,
      success: (data) => {
        if (data.isMe) {
          this.setState({isMe: true})
        }
        else {
          this.setState({
            user: data,
            articles: data.articles,
            portfolios: data.portfolios,
            privacy: data.privacy,
            inMyNetwork: data.isInMyNetwork
          })
          this.setState({loading: false})
          this.geocodeLocation(data.location)
        }
      },
      authToken: userToken
    })
  }

  follow() {
    const {cookies} = this.props
    const userToken = cookies.get('userToken')
    const user = cookies.get('user')
    if (!userToken) {
      alert("You must be logged in to follow other users");
    }
    else {
      let requestUrl = app_config.api_url + "/profile/other/" + this.state.userId + "/follow"
      post({
        url: requestUrl,
        success: (resp) => {
          console.log(resp)
          this.setState({inMyNetwork: true})
        },
        authToken: userToken
      })
    }
  }

  render() {
    if (this.state.isMe) {
      return <Redirect to="/profile"/>
    }
    else
      return (
    <>
      <Row>
        <Col md={{span: 6}}>
          <ProfileCard isMe={false} user={this.state.user} address={this.state.formattedAddress}/>
          <Button style={{marginLeft: 10, width: 120}} onClick={() => this.follow()}>
          {
            this.state.inMyNetwork === "true" ? "Unfollow" : "Follow"
          }
          </Button>
        </Col>
        <Col md={{span: 6}}>
          {
            this.state.privacy === "public" ?
            <>
            <h3>Porfolios:</h3>
            <Row>
              <Col>
                {this.state.portfolios.map(portfolio => (
                  <Portfolio key={portfolio._id} portfolio={portfolio} />
                ))}
              </Col>
            </Row>
            </>
            :
            <div>
              <h3 style={{color: "blue"}}>User is Private</h3>
              <p>Follow the user to see their full profile</p>
            </div>
          }
        </Col>
      </Row>
      <Row style={{marginTop: 10}}>
        <Col>
          <Card  >
            <Card.Title style={{textAlign: "center"}}>
              <h3>User Articles</h3>
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
