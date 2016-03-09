import React, { Component, PropTypes } from 'react';
import IntlTelInputApp from './IntlTelInputApp';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import * as reducers from '../reducers';
import '../styles/intlTelInput.scss';

const reducer = combineReducers(reducers);
let devtool = window.devToolsExtension ? window.devToolsExtension() : undefined;
if (process.env.NODE_ENV === 'production') {
  devtool = undefined;
}

class IntlTelInput extends Component {
  static propTypes = {
    css: PropTypes.arrayOf(PropTypes.string),
    fieldName: PropTypes.string,
    countriesData: PropTypes.arrayOf(PropTypes.array),
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    disabled: PropTypes.bool,
    allowExtensions: PropTypes.bool,
    autoFormat: PropTypes.bool,
    autoPlaceholder: PropTypes.bool,
    autoHideDialCode: PropTypes.bool,
    defaultCountry: PropTypes.string,
    geoIpLookup: PropTypes.func,
    nationalMode: PropTypes.bool,
    numberType: PropTypes.string,
    noCountryDataHandler: PropTypes.func,
    onlyCountries: PropTypes.arrayOf(PropTypes.string),
    preferredCountries: PropTypes.arrayOf(PropTypes.string),
    utilsScript: PropTypes.string,
    onPhoneNumberChange: PropTypes.func,
    onSelectFlag: PropTypes.func,
  }

  store = createStore(reducer, {}, devtool);

  render() {
    return (
      <Provider store={this.store}>
        <IntlTelInputApp id={'intlTelInput'}
          value={this.props.value}
          countriesData={this.props.countriesData}
          defaultValue={this.props.defaultValue}
          disabled={this.props.disabled}
          onPhoneNumberChange={this.props.onPhoneNumberChange}
          onSelectFlag={this.props.onSelectFlag}
          css={this.props.css}
          fieldName={this.props.fieldName}
          allowExtensions={this.props.allowExtensions}
          autoFormat={this.props.autoFormat}
          autoPlaceholder={this.props.autoPlaceholder}
          autoHideDialCode={this.props.autoHideDialCode}
          defaultCountry={this.props.defaultCountry}
          geoIpLookup={this.props.geoIpLookup}
          nationalMode={this.props.nationalMode}
          numberType={this.props.numberType}
          noCountryDataHandler={this.props.noCountryDataHandler}
          onlyCountries={this.props.onlyCountries}
          preferredCountries={this.props.preferredCountries}
          utilsScript={this.props.utilsScript}
        />
      </Provider>
    );
  }
}

export default IntlTelInput;
