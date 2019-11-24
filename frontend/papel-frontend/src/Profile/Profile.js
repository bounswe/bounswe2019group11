import React from 'react';
import './Profile.css';
import ProfileCard from './ProfileCard';
import Portfolio from './Portfolio';
import {instanceOf} from 'prop-types'
import {withCookies, Cookies} from 'react-cookie';
import {Row, Col, Card, Button, Modal, Form} from 'react-bootstrap';
import $ from 'jquery';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


class Profile extends React.Component {
  static propTypes = {cookies: instanceOf(Cookies).isRequired};
  constructor(props) {
    super(props);
    const {cookies} = props;
    const loggedIn = !!cookies.get('userToken');
    this.state = {loggedIn: loggedIn, portfoliosLoaded: false, portfolios: [], showNewPortfolioDialog: false, newPortfolio: {}};

    this.createPortfolio = this.createPortfolio.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onCreate = this.onCreate.bind(this);
  }

  componentDidMount() {
    const {cookies} = this.props;
    const self = this;
    if (this.state.loggedIn) {
      this.setState({portfoliosLoaded: false});
      const request_url = "http://ec2-18-197-152-183.eu-central-1.compute.amazonaws.com:3000/portfolio/user/" + cookies.get('user')._id;
      $.get(request_url , (data) => {
        console.log(data);
        self.setState({portfolios: data, portfoliosLoaded: true});
      });
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
    $.post("http://ec2-18-197-152-183.eu-central-1.compute.amazonaws.com:3000/portfolio", portfolio, (resp, data) => {
      this.setState({portfoliosLoaded: false});
      const request_url = "http://ec2-18-197-152-183.eu-central-1.compute.amazonaws.com:3000/portfolio/user/" + cookies.get('user')._id;
      $.get(request_url , portfolios => {
        this.setState({portfolios: portfolios, portfoliosLoaded: true});
      });
    });
  }

  render () {
    if (this.state.loggedIn) {
      return (
        <>
          <Row>
            <Col md={{span: 6}}>
              <ProfileCard/>
            </Col>
            <Col md={{span: 6}}>
              <h3>Portfolios: </h3>
              <Row>
                <Col md={{span: 10, offset: 1}}>

                {
                  this.state.portfolios.map (
                    portfolio =>
                    <Portfolio key={portfolio._id} portfolio={portfolio} />
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
          <Row>

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
