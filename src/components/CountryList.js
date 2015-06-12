'use strict';

import React from 'react';

export default React.createClass({
  propTypes: {
    isMobile: React.PropTypes.bool,
    countries: React.PropTypes.array,
    preferredCountries: React.PropTypes.array
  },

  appendListItem (countries, className) {
    return countries.map((country) => {
      if (this.props.isMobile) {
        return (
          <option data-dial-code={country.dialCode} value={country.iso2}>
            {country.name + ' +' + country.dialCode}
          </option>
        );
      } else {
        return (
          <li className={'country ' + className}
              data-dial-code={country.dialCode}
              data-country-code={country.iso2}>
            <div className="flag">
              <div className={'iti-flag ' + country.iso2}></div>
            </div>

            <span className="country-name">{country.name}</span>
            <span className="dial-code">{country.dialCode}</span>
          </li>
        );
      }
    });
  },

  render () {
    let listElement = '',
        preferredCountries = this.props.preferredCountries,
        countries = this.props.countries;

    if (this.props.isMobile) {
      let options = this.appendListItem(countries, '');

      listElement = (
        <select className="iti-mobile-select">{options}</select>
      );
    } else {
      let preferredOptions = '';

      if (preferredCountries.length) {
        preferredOptions = this.appendListItem(preferredCountries, 'preferred');
      }

      let options = this.appendListItem(countries, '');

      listElement = (
        <ul className="country-list v-hide">
          {preferredOptions}
          {options}
        </ul>
      );
    }

    return (
      <div>{listElement}</div>
    );
  }
});
