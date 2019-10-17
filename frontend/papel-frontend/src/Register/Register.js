import React from 'react';
import './Register.css';
import $ from 'jquery';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: '', surname: '', email: '', password: '', location: '', id: null, iban: null, marker: null};

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
      if(self.state.marker !== null) self.state.marker.setMap(null);
      self.state.marker = new window.google.maps.Marker({
        position: event.latLng,
        map: map
      });
      map.panTo(event.latLng);

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
    var errors = "";
    const emailValid = !!this.state.email && this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    if (!emailValid){
      errors+=("Check e-mail.\n");
    }
    const nameValid = !!this.state.name && this.state.name.match(/^[a-zA-ZıİğĞçÇşŞüÜöÖ ]+$/i);
    if (!nameValid){
      errors+=("Check Name.\n\t•Name should contain only English and Turkish characters and the space character.\n");
    }
    const surnameValid = !!this.state.surname && this.state.surname.match(/^[a-zA-ZıİğĞçÇşŞüÜöÖ]+$/i);
    if (!surnameValid){
      errors+=("Check Surname.\n\t•Surname should contain only English and Turkish characters and the space character.\n");
    }
    const passwordValid = !!this.state.password && this.state.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/i);
    if (!passwordValid){
      errors+=("Check Password.\n\t•It should contain at least one upper and one lowercase letter, one  numeric and one special character.\n\t•It should be at least 8 characters long.");
    }
    if (errors != "") {

      alert(errors)
    }
    else {
      var user = {
        name: this.state.name,
        surname: this.state.surname,
        email: this.state.email,
        password: this.state.password,
        idNumber: this.state.id,
        iban: this.state.iban
      };
      $.post("https://papel-dev.herokuapp.com/auth/sign-up", user, (resp, data) => {
        console.log(resp);
        if (resp == 200) console.log(data);
      });
    }
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
                <div className="row">ID:</div>
                <div className="row"><input type="text" name="id" onChange={this.handleChange} /></div>
              </div>
              <div hidden className="trader-option">
                <div className="row">IBAN:</div>
                <div className="row"><input type="text" name="iban" onChange={this.handleChange} /></div>
              </div>
              <div className="row"><button className="btn" style={{width: '100%'}}  type="button" name="button" onClick={this.submit}>Sign Up</button></div>
          </div>
          <div id="map-container" className="col-sm-8"> <div id="map" style={{height: 360}}></div></div>
        </div>
      </div>
    );
  }
}

export default Register;
