import React from 'react';
import IntlTelInput from 'react-intl-tel-input';
import 'file?name=libphonenumber.js!./libphonenumber.js';
import './styles/intlTelInput.scss';

var debounce = function (func, wait, immediate) {
  var timeout, args, context, timestamp, result;

  var later = () => {
    var last = new Date().getTime() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) {
          context = args = null;
        }
      }
    }
  };

  return () => {
    context = this;
    args = arguments;
    timestamp = new Date().getTime();
    var callNow = immediate && !timeout;
    if (!timeout) {
      timeout = setTimeout(later, wait);
    }
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
};

var DemoComponent = React.createClass({
  getInitialState () {
    return { phoneNumber: '' };
  },
  componentWillMount () {
    this.deplayedChangeHandler = (...data) => {
      debounce(function () {
        this.changeHandler.apply(this, data);
      }.call(this), 250);
    };
  },
  changeHandler (isValid, value, countryData) {
    console.log(isValid, value, countryData);
    this.setState({
      phoneNumber: value
    });
  },
  render () {
    return (
      <div>
        <IntlTelInput onPhoneNumberChange={this.deplayedChangeHandler}
                      css={['intl-tel-input', 'form-control']}
                      utilsScript={'assets/libphonenumber.js'} />
        <div>Phone Number: {this.state.phoneNumber}</div>
      </div>
    );
  }
});

React.render(<DemoComponent />, document.getElementById('content'));
