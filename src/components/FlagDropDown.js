'use strict';

import React from 'react';
import classNames from 'classnames';
import CountryList from './CountryList';
import utils from './utils';

export default React.createClass({
  render () {
    let flagClassObj = {
          'iti-flag': true
        },
        flagClass,
        selectedCountryData = utils.getCountryData(this.props.countryCode, false),
        titleTip = selectedCountryData.name + ": +" + selectedCountryData.dialCode,
        arrowClass = classNames({
          'arrow': true,
          'up': this.props.showDropdown
        });

    if (this.props.countryCode) {
      flagClassObj[this.props.countryCode] = true;
    }

    flagClass = classNames(flagClassObj);

    return (
      <div className="flag-dropdown">
        <div className="selected-flag" tabIndex="0"
             onClick={this.props.clickSelectedFlag}
             onKeyDown={this.props.handleSelectedFlagKeydown}
             title={titleTip}>
          <div className={flagClass}></div>
          <div className={arrowClass}></div>
        </div>
        <CountryList ref="countryList"
                     isMobile={this.props.isMobile}
                     showDropdown={this.props.showDropdown}
                     selectFlag={this.props.selectFlag}
                     countries={this.props.countries}
                     inputTop={this.props.inputTop}
                     inputOuterHeight={this.props.inputOuterHeight}
                     preferredCountries={this.props.preferredCountries}
                     highlightedCountry={this.props.highlightedCountry}
                     changeHighlightCountry={this.props.changeHighlightCountry} />
      </div>
    );
  }
});
