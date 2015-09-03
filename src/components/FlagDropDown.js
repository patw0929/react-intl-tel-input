import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import CountryList from './CountryList';
import utils from './utils';

class FlagDropDown extends Component {
  static propTypes = {
    countryCode: PropTypes.string,
    showDropdown: PropTypes.bool,
    clickSelectedFlag: PropTypes.func,
    handleSelectedFlagKeydown: PropTypes.func,
    isMobile: PropTypes.bool,
    selectFlag: PropTypes.func,
    countries: PropTypes.array,
    inputTop: PropTypes.number,
    inputOuterHeight: PropTypes.number,
    preferredCountries: PropTypes.array,
    highlightedCountry: PropTypes.number,
    changeHighlightCountry: PropTypes.func
  };

  render() {
    let flagClassObj = {
          'iti-flag': true
        },
        flagClass,
        selectedCountryData = (this.props.countryCode && this.props.countryCode !== 'auto') ? utils.getCountryData(this.props.countryCode, false) : {},
        titleTip = (selectedCountryData) ? selectedCountryData.name + ': +' + selectedCountryData.dialCode : 'Unknown',
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
}

export default FlagDropDown;
