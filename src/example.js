import React from 'react';
import ReactDOM from 'react-dom';
import IntlTelInput from 'react-intl-tel-input';

import 'file?name=libphonenumber.js!./libphonenumber.js';
import './main.css';

const loadJSONP = (url, callback) => {
  const ref = window.document.getElementsByTagName('script')[0];
  const script = window.document.createElement('script');
  script.src = `${url + (url.indexOf('?') + 1 ? '&' : '?')}callback=${callback}`;
  ref.parentNode.insertBefore(script, ref);
  script.onload = () => {
    script.remove();
  };
};

const lookup = (callback) => {
  loadJSONP('http://ipinfo.io', 'sendBack');
  window.sendBack = (resp) => {
    const countryCode = (resp && resp.country) ? resp.country : '';
    callback(countryCode);
  };
};

class DemoComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone1: '',
      phone2: '',
    };
  }

  componentWillMount() {
    this.changePhone1 = this.changeHandler.bind(this, 'phone1');
    this.changePhone2 = this.changeHandler.bind(this, 'phone2');
  }

  changeHandler(name, isValid, value, countryData, number, ext) {
    /* eslint-disable */
    console.log(isValid, value, countryData, number, ext);
    /* eslint-enable */
    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <div>
        <IntlTelInput
          onPhoneNumberChange={this.changePhone1}
          defaultCountry={'auto'}
          value={this.state.phone1}
          geoIpLookup={lookup}
          css={['intl-tel-input', 'form-control']}
          utilsScript="assets/libphonenumber.js"
        />
        <div>Phone Number: {this.state.phone1}</div>

        <IntlTelInput
          onPhoneNumberChange={this.changePhone2}
          defaultCountry={'jp'}
          value={this.state.phone2}
          css={['intl-tel-input', 'form-control']}
          utilsScript="assets/libphonenumber.js"
        />
        <div>Phone Number: {this.state.phone2}</div>
      </div>
    );
  }
}

ReactDOM.render(<DemoComponent />, document.getElementById('content'));
