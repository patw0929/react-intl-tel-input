'use strict';

import React from 'react';
import AllCountries from './AllCountries';
import CountryList from './CountryList';

import '../styles/intlTelInput.scss';

var keys = {
  UP: 38,
  DOWN: 40,
  ENTER: 13,
  ESC: 27,
  PLUS: 43,
  A: 65,
  Z: 90,
  ZERO: 48,
  NINE: 57,
  SPACE: 32,
  BSPACE: 8,
  TAB: 9,
  DEL: 46,
  CTRL: 17,
  CMD1: 91, // Chrome
  CMD2: 224 // FF
};

var isGoodBrowser = Boolean(document.createElement('input').setSelectionRange);

export default React.createClass({
  propTypes: {
    isMobile: React.PropTypes.bool,
    allowExtensions: React.PropTypes.bool,
    autoFormat: React.PropTypes.bool,
    autoPlaceholder: React.PropTypes.bool,
    autoHideDialCode: React.PropTypes.bool,
    defaultCountry: React.PropTypes.string,
    geoIpLookup: React.PropTypes.func,
    nationalMode: React.PropTypes.bool,
    numberType: React.PropTypes.string,
    onlyCountries: React.PropTypes.arrayOf(React.PropTypes.string),
    preferredCountries: React.PropTypes.arrayOf(React.PropTypes.string),
    utilsScript: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      isMobile: false,
      // typing digits after a valid number will be added to the extension part of the number
      allowExtensions: false,
      // automatically format the number according to the selected country
      autoFormat: true,
      // add or remove input placeholder with an example number for the selected country
      autoPlaceholder: true,
      // if there is just a dial code in the input: remove it on blur, and re-add it on focus
      autoHideDialCode: true,
      // default country
      defaultCountry: "",
      // geoIp lookup function
      geoIpLookup: null,
      // don't insert international dial codes
      nationalMode: true,
      // number type to use for placeholders
      numberType: "MOBILE",
      // display only these countries
      onlyCountries: [],
      // the countries at the top of the list. defaults to united states and united kingdom
      preferredCountries: ["us", "gb"],
      // specify the path to the libphonenumber script to enable validation/formatting
      utilsScript: ""
    };
  },

  getInitialState () {
    return {
      preferredCountries: [],
      countries: [],
      countryCodes: {}
    };
  },

  componentDidMount: function() {
    this.processCountryData();
  },

  // prepare all of the country data, including onlyCountries and preferredCountries options
  processCountryData () {
    // set the instances country data objects
    this.setInstanceCountryData();

    // set the preferredCountries property
    this.setPreferredCountries();
  },

  // add a country code to this.countryCodes
  addCountryCode (countryCodes, iso2, dialCode, priority) {
    if (!(dialCode in countryCodes)) {
      countryCodes[dialCode] = [];
    }

    let index = priority || 0;
    countryCodes[dialCode][index] = iso2;

    return countryCodes;
  },

  // process onlyCountries array if present, and generate the countryCodes map
  setInstanceCountryData () {
    let country = '',
        countries = [];

    // process onlyCountries option
    if (this.props.onlyCountries.length) {
      // standardise case
      for (let i = 0, max = this.props.onlyCountries.length; i < max; i++) {
        country = this.props.onlyCountries[i].toLowerCase();
      }

      // build instance country array
      for (let i = 0, max = AllCountries.length; i < max; i++) {
        if (country.indexOf(AllCountries[i].iso2) > -1) {
          countries.push(AllCountries[i]);
        }
      }
    } else {
      countries = AllCountries;
    }

    // generate countryCodes map
    let countryCodes = {};

    for (let i = 0, max = countries.length; i < max; i++) {
      let c = countries[i];
      countryCodes = this.addCountryCode(countryCodes, c.iso2, c.dialCode, c.priority);
      // area codes
      if (c.areaCodes) {
        for (let j = 0, max = c.areaCodes.length; j < max; j++) {
          // full dial code is country code + dial code
          countryCodes = this.addCountryCode(countryCodes, c.iso2, c.dialCode + c.areaCodes[j]);
        }
      }
    }

    this.setState({
      preferredCountries: this.state.preferredCountries,
      countries: countries,
      countryCodes: countryCodes
    });
  },

  // process preferred countries - iterate through the preferences,
  // fetching the country data for each one
  setPreferredCountries () {
    let preferredCountries = [];
    for (let i = 0, max = this.props.preferredCountries.length; i < max; i++) {
      let countryCode = this.props.preferredCountries[i].toLowerCase(),
          countryData = this.getCountryData(countryCode, false, true);

      if (countryData) {
        preferredCountries.push(countryData);
      }
    }

    this.setState({
      preferredCountries: preferredCountries
    });
  },

  // find the country data for the given country code
  // the ignoreOnlyCountriesOption is only used during init() while parsing the onlyCountries array
  getCountryData (countryCode, ignoreOnlyCountriesOption, allowFail) {
    let countryList = (ignoreOnlyCountriesOption) ? AllCountries : this.state.countries;
    for (let i = 0, max = countryList.length; i < max; i++) {
      if (countryList[i].iso2 === countryCode) {
        return countryList[i];
      }
    }

    if (allowFail) {
      return null;
    } else {
      throw new Error("No country data for '" + countryCode + "'");
    }
  },

  render () {
    // if (!this.props.isMobile) {
    //   // now we can grab the dropdown height, and hide it properly
    //   this.dropdownHeight = this.countryList.outerHeight();
    //   this.countryList.removeClass("v-hide").addClass("hide");

    //   // this is useful in lots of places
    //   this.countryListItems = this.countryList.children(".country");
    // }

    return (
      <div className="intl-tel-input">
        <div className="flag-dropdown">
          <div className="selected-flag" tabIndex="0">
            <div className="iti-flag">
              <div className="arrow"></div>
            </div>
          </div>
          <CountryList isMobile={this.props.isMobile}
                       countries={this.state.countries}
                       preferredCountries={this.state.preferredCountries} />
        </div>
        <input type="number" autoComplete="off" />
      </div>
    );
  }
});
