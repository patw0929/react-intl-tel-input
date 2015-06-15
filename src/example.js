import React from 'react';
import IntlTelInput from './components/IntlTelInput';

React.render(<IntlTelInput css={['intl-tel-input', 'form-control']} utilsScript={'assets/libphonenumber.js'} />, document.getElementById('content')); // jshint ignore:line
