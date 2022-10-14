import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import CountryList from './CountryList'
import RootModal from './RootModal'

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
    flagDropdownProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  }

  genSelectedDialCode = () => {
    const { separateDialCode, dialCode } = this.props

    return separateDialCode ? (
      <div className="selected-dial-code">{dialCode}</div>
    ) : null
  }

  genArrow = () => {
    const { allowDropdown, showDropdown } = this.props
    const arrowClasses = classNames('arrow', showDropdown ? 'up' : 'down')

    return allowDropdown ? <div className={arrowClasses} /> : null
  }

  genFlagClassName = () =>
    classNames('iti-flag', {
      [this.props.countryCode]: !!this.props.countryCode,
    })

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
      countryCode,
    } = this.props

    return (
      <CountryList
        ref={countryList => {
          this.countryList = countryList
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
        selectedCountryCode={countryCode}
      />
    )
  }

  render() {
    const {
      refCallback,
      allowDropdown,
      clickSelectedFlag,
      handleSelectedFlagKeydown,
      titleTip,
      dropdownContainer,
      showDropdown,
      highlightedCountry,
      flagDropdownProps,
    } = this.props

    return (
      <div ref={refCallback} className="flag-container">
        <div
          {...flagDropdownProps}
          className="selected-flag"
          tabIndex={allowDropdown ? '0' : ''}
          onClick={clickSelectedFlag}
          onKeyDown={handleSelectedFlagKeydown}
          title={titleTip}
          role="combobox"
          aria-controls="intl-tel-countries-list"
          aria-owns="intl-tel-countries-list"
          aria-autocomplete="none"
          aria-activedescendant={`intl-tel-item-${highlightedCountry}`}
          aria-expanded={showDropdown}
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
    )
  }
}
