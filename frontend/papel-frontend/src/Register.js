import React from 'react';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: '', surname: '', email: '', password: '', location: ''};

    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
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
  }

  render() {
    return (
      <div>
        <div style={{ width: 320, height: 180 }} id="map"></div>
        <table>
          <tbody>
            <tr>
              <td>Location: </td>
              <td>{this.state.location}</td>
            </tr>
            <tr>
              <td>Name:</td>
              <td><input type="text" name="name" onChange={this.handleChange} /></td>
            </tr>
            <tr>
              <td>Surname:</td>
              <td><input type="text" name="surname" onChange={this.handleChange} /></td>
            </tr>
            <tr>
              <td>E-Mail:</td>
              <td><input type="text" name="email" onChange={this.handleChange} /></td>
            </tr>
            <tr>
              <td>Password:</td>
              <td><input type="password" name="password" onChange={this.handleChange} /></td>
            </tr>
            <tr>
              <td></td>
              <td><button style={{width: '100%'}} type="button" name="button">Signup</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Register;
