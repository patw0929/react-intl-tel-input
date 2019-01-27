import React, { Component } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/styles/prism';

import { log, lookup } from '../../helpers/helpers';
import IntlTelInput from '../../../src/components/IntlTelInputApp';
import '../../../example/main.css';

const codeString = `\
  import IntlTelInput from 'react-intl-tel-input';
  import 'react-intl-tel-input/dist/main.css';

  const lookup = callback => {
    const request = new XMLHttpRequest();

    request.addEventListener('load', () => {
      callback(JSON.parse(request.responseText).country_code);
    });

    request.open('GET', 'https://api.ipdata.co/?api-key=test');
    request.send();
  };

  export default App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        phone1: '',
        phone2: '',
      };
      this.changePhone1 = this.changeHandler.bind(this, 'phone1');
      this.changePhone2 = this.changeHandler.bind(this, 'phone2');
      this.blurHandler1 = this.blurHandler.bind(this, 'phone1');
      this.blurHandler2 = this.blurHandler.bind(this, 'phone2');
      this.selectFlagHandler1 = this.selectFlagHandler.bind(this, 'phone1');
      this.selectFlagHandler2 = this.selectFlagHandler.bind(this, 'phone2');
    }

    blurHandler = (name, isValid, value, countryData, number, ext, event) => {
      console.log(isValid, value, countryData, number, ext, event.type);
    };

    changeHandler(name, isValid, value, countryData, number, ext) {
      console.log(isValid, value, countryData, number, ext);
      this.setState({
        [name]: value,
      });
    }

    selectFlagHandler(
      name,
      currentNumber,
      selectedCountryData,
      fullNumber,
      isValid
    ) {
      console.log(currentNumber, selectedCountryData, fullNumber, isValid);
      this.setState({
        [name]: currentNumber,
      });
    }

    render() {
      return (
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

        <IntlTelInput
          onPhoneNumberChange={this.changePhone2}
          onPhoneNumberBlur={this.blurHandler2}
          onSelectFlag={this.selectFlagHandler2}
          defaultCountry="jp"
          value={this.state.phone2}
          css={['intl-tel-input', 'form-control']}
        />
      );
    }
  }
`;


export default class Multiple extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone1: '',
      phone2: '',
    };
    this.changePhone1 = this.changeHandler.bind(this, 'phone1');
    this.changePhone2 = this.changeHandler.bind(this, 'phone2');
    this.blurHandler1 = this.blurHandler.bind(this, 'phone1');
    this.blurHandler2 = this.blurHandler.bind(this, 'phone2');
    this.selectFlagHandler1 = this.selectFlagHandler.bind(this, 'phone1');
    this.selectFlagHandler2 = this.selectFlagHandler.bind(this, 'phone2');
  }

  blurHandler = (name, isValid, value, countryData, number, ext, event) => {
    log(isValid, value, countryData, number, ext, event.type);
  };

  changeHandler(name, isValid, value, countryData, number, ext) {
    log(isValid, value, countryData, number, ext);
    this.setState({
      [name]: value,
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
      <div className="story">
        <h1 className="title">Multiple Components</h1>

        <div className="demo">
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
          <div className="preview">
            Phone Number: {this.state.phone1}
          </div>

          <IntlTelInput
            onPhoneNumberChange={this.changePhone2}
            onPhoneNumberBlur={this.blurHandler2}
            onSelectFlag={this.selectFlagHandler2}
            defaultCountry="jp"
            value={this.state.phone2}
            css={['intl-tel-input', 'form-control']}
          />
          <div className="preview">
            Phone Number: {this.state.phone2}
          </div>

          <div
            id="debug"
            className="code pre-scrollable"
          />
        </div>

        <h2>Code</h2>

        <SyntaxHighlighter
          language="jsx"
          style={xonokai}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    );
  }
};
