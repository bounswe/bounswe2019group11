import React from 'react';
import './style/Register.css';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: '', surname: '', email: '', password: '', location: '', id: null, iban: null};

    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
    this.toggleTraderOptions = this.toggleTraderOptions.bind(this);
  }
  componentDidMount() {
    const self = this;

    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 41.0848, lng: 29.051},
      zoom: 9
    });
    var geocoder = new window.google.maps.Geocoder;

    window.google.maps.event.addListener(map, 'click', function (event) {
      geocoder.geocode({'location': event.latLng}, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            self.setState({location: results[0].formatted_address});
          }
          else
            console.log('No results');
        }
        else console.log('Geocoding failed');
      });
    });
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  submit() {
    console.log("Current Data:");
    console.log(this.state);
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(response => response.json())
      .then(json => console.log(json))
  }

  toggleTraderOptions (event) {
    if (event.target.checked) {
      Array.from(document.getElementsByClassName("trader-option")).forEach((item) => { item.removeAttribute('hidden'); });
    }
    else {
      this.setState({id: null, iban: null});
      Array.from(document.getElementsByClassName("trader-option")).forEach((item) => {
        item.setAttribute('hidden', null);
        item.lastChild.lastChild.value = "";
      });
    }
  }

  render() {
    return (
      <div id="register-form" className="card container-fluid col-sm-10">
        <div className="row">
          <div id="form-inputs" className="col-sm-4">
                <div className="row">Name:</div>
                <div className="row"><input type="text" name="name" onChange={this.handleChange} /></div>

                <div className="row">Surname:</div>
                <div className="row"><input type="text" name="surname" onChange={this.handleChange} /></div>

                <div className="row">E-Mail:</div>
                <div className="row"><input type="text" name="email" onChange={this.handleChange} /></div>

                <div className="row">Password:</div>
                <div className="row"><input type="password" name="password" onChange={this.handleChange} /></div>

                <div className="row">Location: </div>
                <div className="row">{this.state.location}</div>

                <div className="row" >
                  <label>Register as Trader &nbsp;</label>
                  <div className="checkbox"><input type="checkbox" name="isTrader" onChange={this.toggleTraderOptions} /></div>
                </div>

              <div hidden className="trader-option">
                <div class="row">ID:</div>
                <div class="row"><input type="text" name="id" onChange={this.handleChange} /></div>
              </div>
              <div hidden className="trader-option">
                <div class="row">IBAN:</div>
                <div class="row"><input type="text" name="iban" onChange={this.handleChange} /></div>
              </div>
              <div class="row"><button className="btn" style={{width: '100%'}} type="button" name="button" onClick={this.submit}>Sign Up</button></div>
          </div>
          <div id="map-container" className="col-sm-8"> <div id="map" style={{height: 360}}></div></div>
        </div>
      </div>
    );
  }
}

export default Register;
