import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CountryList from './CountryList';
import RootModal from './RootModal';

export default class FlagDropDown extends Component {
  static propTypes = {
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
    countries: PropTypes.arrayOf(PropTypes.object),
    inputTop: PropTypes.number,
    inputOuterHeight: PropTypes.number,
    preferredCountries: PropTypes.arrayOf(PropTypes.object),
    highlightedCountry: PropTypes.number,
    changeHighlightCountry: PropTypes.func,
    titleTip: PropTypes.string,
    refCallback: PropTypes.func.isRequired,
  };

  genSelectedDialCode = () => {
    const { separateDialCode, dialCode } = this.props;

    return separateDialCode ? (
      <div className="selected-dial-code">{dialCode}</div>
    ) : (
      ''
    );
  };

  genArrow = () => {
    const { allowDropdown, showDropdown } = this.props;
    const arrowClass = classNames({
      'iti-arrow': true,
      up: showDropdown,
    });

    return allowDropdown ? <div className={arrowClass} /> : '';
  };

  genFlagClassName = () => {
    const { countryCode } = this.props;
    const flagClassObj = {
      'iti-flag': true,
    };

    if (countryCode) {
      flagClassObj[countryCode] = true;
    }

    return classNames(flagClassObj);
  };

  genCountryList = () => {
    const {
      dropdownContainer,
      showDropdown,
      isMobile,
      allowDropdown,
      setFlag,
      countries,
      inputTop,
      inputOuterHeight,
      preferredCountries,
      highlightedCountry,
      changeHighlightCountry,
    } = this.props;

    return (
      <CountryList
        ref={countryList => {
          this.countryList = countryList;
        }}
        dropdownContainer={dropdownContainer}
        isMobile={isMobile}
        showDropdown={allowDropdown && showDropdown}
        setFlag={setFlag}
        countries={countries}
        inputTop={inputTop}
        inputOuterHeight={inputOuterHeight}
        preferredCountries={preferredCountries}
        highlightedCountry={highlightedCountry}
        changeHighlightCountry={changeHighlightCountry}
      />
    );
  };

  render() {
    const {
      refCallback,
      allowDropdown,
      clickSelectedFlag,
      handleSelectedFlagKeydown,
      titleTip,
      dropdownContainer,
      showDropdown,
    } = this.props;

    return (
      <div ref={refCallback} className="flag-container">
        <div
          className="selected-flag"
          tabIndex={allowDropdown ? '0' : ''}
          onClick={clickSelectedFlag}
          onKeyDown={handleSelectedFlagKeydown}
          title={titleTip}
        >
          <div className={this.genFlagClassName()} />
          {this.genSelectedDialCode()}
          {this.genArrow()}
        </div>
        {dropdownContainer && showDropdown ? (
          <RootModal>{this.genCountryList()}</RootModal>
        ) : (
          this.genCountryList()
        )}
      </div>
    );
  }
}
