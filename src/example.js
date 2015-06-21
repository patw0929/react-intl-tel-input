import React from 'react';
import IntlTelInput from 'react-intl-tel-input';
import 'file?name=libphonenumber.js!./libphonenumber.js';
import './styles/intlTelInput.scss';

React.render(<IntlTelInput css={['intl-tel-input', 'form-control']} utilsScript={'assets/libphonenumber.js'} />, document.getElementById('content')); // jshint ignore:line
