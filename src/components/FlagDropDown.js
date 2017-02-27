import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import CountryList from './CountryList';
import RootModal from './RootModal';

class FlagDropDown extends Component {
  static propTypes = {
    closeButtonText: PropTypes.string,
    closeButtonIcn: PropTypes.string,
    allowDropdown: PropTypes.bool,
    dropdownContainer: PropTypes.string,
    separateDialCode: PropTypes.bool,
    dialCode: PropTypes.string,
    countryCode: PropTypes.string,
    showDropdown: PropTypes.bool,
    clickSelectedFlag: PropTypes.func,
    handleSelectedFlagKeydown: PropTypes.func,
    isMobile: PropTypes.bool,
    setFlag: PropTypes.func,
    countries: PropTypes.array,
    inputTop: PropTypes.number,
    inputOuterHeight: PropTypes.number,
    preferredCountries: PropTypes.array,
    highlightedCountry: PropTypes.number,
    changeHighlightCountry: PropTypes.func,
    titleTip: PropTypes.string,
    handleCloseClick: PropTypes.func,
  };

  render() {
    const flagClassObj = {
      'iti-flag': true,
    };
    let flagClass = undefined;
    const arrowClass = classNames({
      'iti-arrow': true,
      up: this.props.showDropdown,
    });
    let genSelectedDialCode = () => '';
    if (this.props.separateDialCode) {
      genSelectedDialCode = () =>
        <div className="selected-dial-code">{this.props.dialCode}</div>;
    }
    let genArrow = () => '';
    if (this.props.allowDropdown) {
      genArrow = () =>
        <div className={arrowClass}></div>;
    }

    if (this.props.countryCode) {
      flagClassObj[this.props.countryCode] = true;
    }

    flagClass = classNames(flagClassObj);

    let genCountryList = () => '';
    if (this.props.dropdownContainer) {
      if (this.props.showDropdown) {
        genCountryList = () =>
          <RootModal>
            <CountryList ref="countryList"
              closeButtonText={this.props.closeButtonText}
              closeButtonIcn={this.props.closeButtonIcn}
              dropdownContainer={this.props.dropdownContainer}
              isMobile={this.props.isMobile}
              showDropdown={this.props.showDropdown}
              setFlag={this.props.setFlag}
              countries={this.props.countries}
              inputTop={this.props.inputTop}
              inputOuterHeight={this.props.inputOuterHeight}
              preferredCountries={this.props.preferredCountries}
              highlightedCountry={this.props.highlightedCountry}
              changeHighlightCountry={this.props.changeHighlightCountry}
              handleCloseClick={this.props.handleCloseClick}
            />
          </RootModal>;
      }
    } else {
      genCountryList = () =>
        <CountryList ref="countryList"
          closeButtonText={this.props.closeButtonText}
          closeButtonIcn={this.props.closeButtonIcn}
          dropdownContainer={this.props.dropdownContainer}
          isMobile={this.props.isMobile}
          showDropdown={this.props.showDropdown}
          setFlag={this.props.setFlag}
          countries={this.props.countries}
          inputTop={this.props.inputTop}
          inputOuterHeight={this.props.inputOuterHeight}
          preferredCountries={this.props.preferredCountries}
          highlightedCountry={this.props.highlightedCountry}
          changeHighlightCountry={this.props.changeHighlightCountry}
          handleCloseClick={this.props.handleCloseClick}
        />;
    }

    return (
      <div className="flag-container">
        <div className="selected-flag"
          tabIndex={this.props.allowDropdown ? '0' : ''}
          onClick={this.props.clickSelectedFlag}
          onKeyDown={this.props.handleSelectedFlagKeydown}
          title={this.props.titleTip}
        >
          <div className={flagClass}></div>
          {genSelectedDialCode()}
          {genArrow()}
        </div>
        {genCountryList()}
      </div>
    );
  }
}

export default FlagDropDown;
