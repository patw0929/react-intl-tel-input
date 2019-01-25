import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import IntlTelInput from 'react-intl-tel-input'; // eslint-disable-line import/no-extraneous-dependencies

const lookup = callback => {
  const request = new XMLHttpRequest();

  request.addEventListener('load', () => {
    callback(JSON.parse(request.responseText).country_code);
  });

  request.open('GET', 'https://api.ipdata.co/?api-key=test');
  request.send();
};

function log(...args) {
  const logger = document.querySelector('#debug');

  if (typeof args === 'object') {
    logger.innerHTML += `${(JSON && JSON.stringify ? JSON.stringify(args) : args)}<br />`;
  } else {
    logger.innerHTML += `${args}<br />`;
  }

  logger.scrollTop = logger.scrollHeight;
}

class DemoComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone1: '',
      phone2: '',
      phone3: '',
      phoneNumber3: '',
    };
    this.changePhone1 = this.changeHandler.bind(this, 'phone1', 'phoneNumber1');
    this.changePhone2 = this.changeHandler.bind(this, 'phone2', 'phoneNumber2');
    this.changePhone3 = this.changeHandler.bind(this, 'phone3', 'phoneNumber3');
    this.blurHandler1 = this.blurHandler.bind(this, 'phone1');
    this.blurHandler2 = this.blurHandler.bind(this, 'phone2');
    this.blurHandler3 = this.blurHandler.bind(this, 'phone3');
    this.selectFlagHandler1 = this.selectFlagHandler.bind(this, 'phone1');
    this.selectFlagHandler2 = this.selectFlagHandler.bind(this, 'phone2');
    this.selectFlagHandler3 = this.selectFlagHandler.bind(this, 'phone3');
  }

  blurHandler = (name, isValid, value, countryData, number, ext, event) => {
    log(isValid, value, countryData, number, ext, event.type);
  };

  changeHandler(name, nameNumber, isValid, value, countryData, number, ext) {
    log(isValid, value, countryData, number, ext);
    this.setState({
      [name]: value,
      [nameNumber]: number,
    });
  }

  selectFlagHandler(
    name,
    currentNumber,
    selectedCountryData,
    fullNumber,
    isValid
  ) {
    log(currentNumber, selectedCountryData, fullNumber, isValid);
    this.setState({
      [name]: currentNumber,
    });
  }

  render() {
    return (
      <div>
        <IntlTelInput
          onPhoneNumberChange={this.changePhone1}
          onPhoneNumberBlur={this.blurHandler1}
          onSelectFlag={this.selectFlagHandler1}
          defaultCountry="auto"
          value={this.state.phone1}
          geoIpLookup={lookup}
          css={['intl-tel-input', 'form-control']}
          format
        />
        <div>
          Phone Number:
          {this.state.phone1}
        </div>

        <IntlTelInput
          onPhoneNumberChange={this.changePhone2}
          onPhoneNumberBlur={this.blurHandler2}
          onSelectFlag={this.selectFlagHandler2}
          defaultCountry="jp"
          value={this.state.phone2}
          css={['intl-tel-input', 'form-control']}
        />

        <div>
          Phone Number:
          {this.state.phone2}
        </div>

        <IntlTelInput
          onPhoneNumberChange={this.changePhone3}
          onPhoneNumberBlur={this.blurHandler3}
          onSelectFlag={this.selectFlagHandler3}
          defaultCountry="auto"
          value={this.state.phoneNumber3}
          geoIpLookup={lookup}
          css={['intl-tel-input', 'form-control']}
          formatFull
        />

        <div>
          Phone Number:
          {this.state.phone3}
        </div>

        <hr />

        <div
          id="debug"
          className="code pre-scrollable"
        />
      </div>
    );
  }
}

ReactDOM.render(<DemoComponent />, document.getElementById('root'));
