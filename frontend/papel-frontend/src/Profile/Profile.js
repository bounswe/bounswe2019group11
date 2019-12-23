import React from 'react';
import './Profile.css';
import ProfileCard from './ProfileCard';
import BalanceCard from './BalanceCard';
import Portfolio from './Portfolio';
import {instanceOf} from 'prop-types'
import {withCookies, Cookies} from 'react-cookie';
import {Row, Col, Card, Button, Modal, Form} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import ArticlePreview from '../Article/ArticlePreview'
import {getRequest, postRequest} from '../helpers/request'
import {getFormattedAddress} from '../helpers/geocoder'
import {app_config} from "../config";

class Profile extends React.Component {
  static propTypes = {cookies: instanceOf(Cookies).isRequired};
  constructor(props) {
    super(props);
    const {cookies} = props;
    const loggedIn = !!cookies.get('userToken');
    this.state = {loggedIn: loggedIn, balance:0, amount:0, portfoliosLoaded: false, portfolios: [], showNewPortfolioDialog: false, newPortfolio: {}, articles: [], formattedAddress: ""};

    this.createPortfolio = this.createPortfolio.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.geocodeLocation = this.geocodeLocation.bind(this);
    this.depositMoney = this.depositMoney.bind(this);
    this.withdrawMoney = this.withdrawMoney.bind(this);
    this.getAmount = this.getAmount.bind(this);
  }

  componentDidMount() {
    const {cookies} = this.props
    const userToken = cookies.get('userToken')
    if (!!userToken) {
      const userId = cookies.get('user')._id
      let requestUrl = app_config.api_url + "/profile/myprofile"
      getRequest({
        url: requestUrl,
        success: (data) => {
          this.setState({articles: data.articles, portfolios: data.portfolios})
          cookies.set('pendingRequests', data.followerPending)
        },
        authToken: userToken
      })
      getRequest({
        url: app_config.api_url + "/money",
        success: (data) => {
          this.setState({balance:data})
          console.log(data)
          console.log(this.state.balance)
        },
        authToken: userToken
        })
      this.geocodeLocation(cookies.get('user').location)
    }
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

  handleChange(event) {
    this.setState({newPortfolio: {name: event.target.value}});
  }
  onCreate() {
    this.setState({showNewPortfolioDialog: false});
    this.createPortfolio();
  }

  createPortfolio() {
    const {cookies} = this.props;
    var portfolio = {name: "", userId: "", stocks: []};
    portfolio.name = this.state.newPortfolio.name;
    portfolio.userId = cookies.get('user')._id;
    postRequest({
      url: app_config.api_url + "/portfolio",
      data: portfolio,
      success: (resp, data) => {
        this.setState({portfoliosLoaded: false});
        const request_url = app_config + "/portfolio/user/" + cookies.get('user')._id;
        getRequest({
          url: request_url,
          success: portfolios => {
            this.setState({portfolios: portfolios, portfoliosLoaded: true});
          }
        });
      },
      authToken: cookies.get("userToken")
    });
  }

  depositMoney() {
    const {cookies} = this.props;
    postRequest({
      url: app_config.api_url + "/money/deposit/"  + this.state.amount,
      success: function() {console.log("dgn");
      },
      authToken: cookies.get("userToken")
    });
    //window.location.reload();
  }
  withdrawMoney() {
    const {cookies} = this.props;
    postRequest({
      url: app_config.api_url + "/money/withdraw/" + this.state.amount,
      success: function() {console.log("dgn");
      },
      authToken: cookies.get("userToken")
    });
    //window.location.reload();
  }
  getAmount(event){
    this.setState({amount:event.target.value});
    console.log(event.target.value);
  }

  render () {
    if (this.state.loggedIn) {
      return (
        <>
          <Row>
            <Col md={{span: 6}}>
              <ProfileCard isMe={true} address={this.state.formattedAddress}/>
            </Col>
            <Col md={{span: 6}}>
              <h3>Portfolios: </h3>
              <Row>
                <Col>
                {
                  this.state.portfolios.map (
                    portfolio =>
                    <Portfolio key={portfolio._id} portfolio={portfolio} isMe={true} />
                  )
                }
                  <Modal
                    show={this.state.showNewPortfolioDialog}
                    onHide={() => this.setState({showNewPortfolioDialog: false})}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>New Portfolio</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form.Control onChange={this.handleChange} name="newPortfolio" type="text" placeholder="Enter a name for the portfolio" />
                      <Button onClick={this.onCreate} style={{marginTop: 10}}>Create</Button>
                    </Modal.Body>
                  </Modal>
                  <Button onClick={() => this.setState({showNewPortfolioDialog: true})}>
                    <FontAwesomeIcon icon={faPlus} />&nbsp;
                    Create New Portfolio
                  </Button>
                </Col>
              </Row>

            </Col>
          </Row>
          <Row style={{marginTop: 10}} m={{span:5}}>
            <Col>
              <h3>My Balance: {this.state.balance.money} &#36;
              </h3>
            </Col>
          </Row>
          <br></br>
          <Row className="justify-content-md-center">
            <Col xs={4}>
              <Button onClick={this.depositMoney}>
                <FontAwesomeIcon icon={faPlus} />&nbsp;
                Deposit Money
                </Button>
            </Col>
            <Col xs={3}>
              <form>
                <input type="number" name="amount" onChange={this.getAmount} /> &emsp; &#36;
              </form>
            </Col>
            <Col xs={4}>
              <Button onClick={this.withdrawMoney}>
                <FontAwesomeIcon icon={faMinus} />&nbsp;
                Withdraw Money
              </Button>
            </Col>
          </Row>
              <br></br>
              <center><i>To see the change, please refresh the page after deposit/withraw of money.</i></center>
              <br></br>
          <Row style={{marginTop: 10}}>
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
      );
    }
    else {
      return (
        <Card><h3 style={{color: "red"}}>Please log in to access profile.</h3></Card>
      );
    }
  }
}

export default withCookies(Profile);
