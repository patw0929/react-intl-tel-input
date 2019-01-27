import React, { Component } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/styles/prism';

import './styles.scss';
import { log } from '../../helpers/helpers';
import IntlTelInput from '../../../src/components/IntlTelInputApp';
import '../../../example/main.css';

const codeString = `\
  import IntlTelInput from 'react-intl-tel-input';
  import 'react-intl-tel-input/dist/main.css';
  import './styles.scss';

  export default App extends React.Component {
    state = {
      value: '',
    };

    handleChange = (isValid, value, countryData, number, ext) => {
      console.log(isValid, value, countryData, number, ext);

      this.setState({
        value,
      });
    };

    render() {
      return (
        <IntlTelInput
          defaultCountry="tw"
          css={['intl-tel-input tel-wrapper', 'form-control tel-input']}
          value={this.state.value}
          onPhoneNumberChange={this.handleChange}
          format
        />
      );
    }
  }
`;


export default class CustomCSS extends Component {
  state = {
    value: '',
  };

  handleChange = (isValid, value, countryData, number, ext) => {
    log(isValid, value, countryData, number, ext);

    this.setState({
      value,
    });
  };

  render() {
    return (
      <div className="story">
        <h1 className="title">CustomCSS</h1>

        <div className="demo">
          <IntlTelInput
            defaultCountry="tw"
            css={['intl-tel-input tel-wrapper', 'form-control tel-input']}
            value={this.state.value}
            onPhoneNumberChange={this.handleChange}
            format
          />

          <div className="preview">
            Phone Number: {this.state.value}
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
