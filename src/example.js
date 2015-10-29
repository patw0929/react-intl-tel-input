import React from 'react';
import ReactDOM from 'react-dom';
import IntlTelInput from 'react-intl-tel-input';
import 'file?name=libphonenumber.js!./libphonenumber.js';
import './styles/intlTelInput.scss';

var loadJSONP = function (url, callback) {
  var ref = window.document.getElementsByTagName('script')[0];
  var script = window.document.createElement('script');
  script.src = url + (url.indexOf('?') + 1 ? '&' : '?') + 'callback=' + callback;
  ref.parentNode.insertBefore(script, ref);
  script.onload = function () {
    this.remove();
  };
};

var lookup = function (callback) {
  loadJSONP('http://ipinfo.io', 'sendBack');
  window.sendBack = function (resp) {
    var countryCode = (resp && resp.country) ? resp.country : '';
    callback(countryCode);
  };
};

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

class DemoComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: ''
    }
  }

  componentWillMount() {
    this.deplayedChangeHandler = (...data) => {
      debounce(function () {
        this.changeHandler.apply(this, data);
      }.call(this), 250);
    };
  }

  changeHandler(isValid, value, countryData, number) {
    console.log(isValid, value, countryData, number);
    this.setState({
      phoneNumber: value
    });
  }

  render() {
    return (
      <div>
        <IntlTelInput onPhoneNumberChange={this.deplayedChangeHandler}
                      defaultCountry={"auto"}
                      geoIpLookup={lookup}
                      css={['intl-tel-input', 'form-control']}
                      utilsScript={'assets/libphonenumber.js'} />
        <div>Phone Number: {this.state.phoneNumber}</div>
      </div>
    );
  }
}

ReactDOM.render(<DemoComponent />, document.getElementById('content'));
