import React, { Component } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/styles/prism';

import { log } from '../../helpers/helpers';
import IntlTelInput from '../../../src/components/IntlTelInputApp';
import '../../../example/main.css';

const codeString = `\
  import IntlTelInput from 'react-intl-tel-input';
  import 'react-intl-tel-input/dist/main.css';

  export default App extends React.Component {
    state = {
      value: '',
      disabled: true,
    };

    handleChange = (isValid, value, countryData, number, ext) => {
      console.log(isValid, value, countryData, number, ext);

      this.setState({
        value,
      });
    };

    toggleStatus = () => {
      this.setState(prevState => {
        return {
          disabled: !prevState.disabled,
        };
      });
    };

    render() {
      return (
        <IntlTelInput
          defaultCountry="tw"
          css={['intl-tel-input', 'form-control']}
          value={this.state.value}
          onPhoneNumberChange={this.handleChange}
          disabled={this.state.disabled}
          format
        />

        <button
          type="button"
          onClick={this.toggleStatus}
        >
          Toggle Status
        </button>
      );
    }
  }
`;


export default class Disabled extends Component {
  state = {
    value: '',
    disabled: true,
  };

  handleChange = (isValid, value, countryData, number, ext) => {
    log(isValid, value, countryData, number, ext);

    this.setState({
      value,
    });
  };

  toggleStatus = () => {
    this.setState(prevState => {
      return {
        disabled: !prevState.disabled,
      };
    });
  };

  render() {
    return (
      <div className="story">
        <h1 className="title">Disabled</h1>

        <div className="demo">
          <IntlTelInput
            defaultCountry="tw"
            css={['intl-tel-input', 'form-control']}
            value={this.state.value}
            onPhoneNumberChange={this.handleChange}
            disabled={this.state.disabled}
            format
          />

          <div className="preview">
            Phone Number: {this.state.value}
          </div>

          <div>
            <button
              type="button"
              onClick={this.toggleStatus}
            >
              {this.state.disabled ? 'Enable' : 'Disable'}
            </button>
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
