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
    this.remove();
  };
};

const lookup = (callback) => {
  loadJSONP('http://ipinfo.io', 'sendBack');
  window.sendBack = (resp) => {
    const countryCode = (resp && resp.country) ? resp.country : '';
    callback(countryCode);
  };
};

const debounce = (func, wait, immediate) => {
  let timeout;
  let args;
  let context;
  let timestamp;
  let result;

  const later = () => {
    const last = new Date().getTime() - timestamp;

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
    const callNow = immediate && !timeout;

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
      phoneNumber: '',
    };
  }

  componentWillMount() {
    this.deplayedChangeHandler = (...data) => {
      debounce(() => {
        this.changeHandler.apply(this, data);
      }, 250);
    };
  }

  changeHandler(isValid, value, countryData, number) {
    /* eslint-disable */
    console.log(isValid, value, countryData, number);
    /* eslint-enable */
    this.setState({
      phoneNumber: value,
    });
  }

  render() {
    return (
      <div>
        <IntlTelInput onPhoneNumberChange={this.deplayedChangeHandler}
          defaultCountry={"auto"}
          geoIpLookup={lookup}
          css={['intl-tel-input', 'form-control']}
          utilsScript={'assets/libphonenumber.js'}
        />
        <div>Phone Number: {this.state.phoneNumber}</div>
      </div>
    );
  }
}

ReactDOM.render(<DemoComponent />, document.getElementById('content'));
