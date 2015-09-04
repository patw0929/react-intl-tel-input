import React, { Component, PropTypes } from 'react';
import IntlTelInputApp from './IntlTelInputApp';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import * as reducers from '../reducers';

const reducer = combineReducers(reducers);
const store = createStore(reducer);

class IntlTelInput extends Component {
  constructor() {
    super();
  }

  static propTypes = {
    css: PropTypes.arrayOf(PropTypes.string),
    fieldName: PropTypes.string,
    value: PropTypes.string,
    allowExtensions: PropTypes.bool,
    autoFormat: PropTypes.bool,
    autoPlaceholder: PropTypes.bool,
    autoHideDialCode: PropTypes.bool,
    defaultCountry: PropTypes.string,
    geoIpLookup: PropTypes.func,
    nationalMode: PropTypes.bool,
    numberType: PropTypes.string,
    onlyCountries: PropTypes.arrayOf(PropTypes.string),
    preferredCountries: PropTypes.arrayOf(PropTypes.string),
    utilsScript: PropTypes.string,
    onPhoneNumberChange: PropTypes.func
  }

  render() {
    return (
      <Provider store={store}>
        {() => <IntlTelInputApp value={this.props.value}
                             onPhoneNumberChange={this.props.onPhoneNumberChange}
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
                             onlyCountries={this.props.onlyCountries}
                             preferredCountries={this.props.preferredCountries}
                             utilsScript={this.props.utilsScript} />}
      </Provider>
    );
  }
}

export default IntlTelInput;
