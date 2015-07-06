'use strict';

import React from 'react';
import IntlTelInput from 'react-intl-tel-input';
import 'file?name=libphonenumber.js!./libphonenumber.js';
import './styles/intlTelInput.scss';

var DemoComponent = React.createClass({
  getInitialState () {
    return { phoneNumber: '' };
  },
  changeHandler (isValid, value, country) {
    this.setState({ phoneNumber: value });
  },
  render () {
    return (
      <div>
        <IntlTelInput value={this.state.phoneNumber} onPhoneNumberChange={this.changeHandler} css={['intl-tel-input', 'form-control']} utilsScript={'assets/libphonenumber.js'} />
        <div>Phone Number: {this.state.phoneNumber}</div>
      </div>
    );
  }
});

React.render(<DemoComponent />, document.getElementById('content'));
