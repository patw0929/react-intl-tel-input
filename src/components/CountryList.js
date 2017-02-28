import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import utils from './utils';
import CountryContent from './CountryContent';
import MobileCountryContent from './MobileCountryContent';

function partial(fn, ...args) {
  return fn.bind(fn, ...args);
}

class CountryList extends Component {
  static propTypes = {
    closeButtonText: PropTypes.string,
    closeButtonIcn: PropTypes.string,
    dropdownContainer: PropTypes.string,
    setFlag: PropTypes.func,
    countries: PropTypes.array,
    inputTop: PropTypes.number,
    inputOuterHeight: PropTypes.number,
    preferredCountries: PropTypes.array,
    highlightedCountry: PropTypes.number,
    changeHighlightCountry: PropTypes.func,
    showDropdown: PropTypes.bool,
    isMobile: PropTypes.bool,
    handleCloseClick: PropTypes.func,
  };

  constructor() {
    super();
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.setFlag = this.setFlag.bind(this);
    this.appendListItem = this.appendListItem.bind(this);
    this.setDropdownPosition = this.setDropdownPosition.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showDropdown) {
      findDOMNode(this.refs.listElement).setAttribute('class', 'country-list v-hide');
      this.setDropdownPosition();
    }
  }

  shouldComponentUpdate(nextProps) {
    return !utils.shallowEquals(this.props, nextProps);
  }

  setDropdownPosition() {
    utils.removeClass(
      findDOMNode(this.refs.listElement), 'hide');

    const inputTop = this.props.inputTop;
    const windowTop = (window.pageYOffset !== undefined) ?
      window.pageYOffset :
      (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight ||
                         document.body.clientHeight;
    const inputOuterHeight = this.props.inputOuterHeight;
    const countryListOuterHeight = utils.getOuterHeight(findDOMNode(this.refs.listElement));
    const dropdownFitsBelow =
      (inputTop + inputOuterHeight + countryListOuterHeight < windowTop + windowHeight);
    const dropdownFitsAbove = (inputTop - countryListOuterHeight > windowTop);

    // dropdownHeight - 1 for border
    const cssTop = (!dropdownFitsBelow && dropdownFitsAbove) ?
                   `-${(countryListOuterHeight - 1)}px` : '';
    findDOMNode(this.refs.listElement).style.top = cssTop;
    findDOMNode(this.refs.listElement).setAttribute('class', 'country-list');
  }

  setFlag(iso2) {
    this.props.setFlag(iso2);
  }

  appendListItem(countries, className) {
    const preferredCountriesCount = this.props.preferredCountries.length;

    return countries.map((country, index) => {
      const actualIndex = (className === 'preferred') ? index : index + preferredCountriesCount;
      const countryClassObj = {
        country: true,
        highlight: (this.props.highlightedCountry === actualIndex),
      };
      let countryClass = undefined;
      countryClassObj[className] = true;
      countryClass = classNames(countryClassObj);

      return (
        this.props.isMobile ?
          <MobileCountryContent {...country}
            index={index}
            countryClass={countryClass}
            handleClick={partial(this.setFlag, country.iso2)}
          /> :
          <CountryContent {...country}
            index={index}
            countryClass={countryClass}
            handleMouseOver={this.handleMouseOver}
            handleClick={partial(this.setFlag, country.iso2)}
          />
      );
    });
  }

  handleMouseOver(e) {
    if (e.currentTarget.getAttribute('class').indexOf('country') > -1) {
      const selectedIndex = utils.retrieveLiIndex(e.currentTarget);
      this.props.changeHighlightCountry(true, selectedIndex);
    }
  }

  getCloseRowAndButton() {
    let closeButton;
    if (this.props.closeButtonIcn) {
      const closeButtonStyle = {
        position: 'absolute',
        top: '10px',
        right: '10px',
      };
      closeButton = (
        <li className="closeButton">
          <span>{this.props.closeButtonText}</span>
          <img src={this.props.closeButtonIcn}
            role="presentation" style={closeButtonStyle}
            onClick={this.props.handleCloseClick}
          />
        </li>
      );
    } else {
      closeButton = null;
    }
    return closeButton;
  }

  render() {
    let options = '';
    const preferredCountries = this.props.preferredCountries;
    let preferredOptions = undefined;
    const countries = this.props.countries;
    const className = classNames({
      'country-list': true,
      hide: !this.props.showDropdown,
    });
    let divider = undefined;

    if (preferredCountries.length) {
      preferredOptions = this.appendListItem(preferredCountries, 'preferred');
      divider = (
        <div className="divider"></div>
      );
    }

    options = this.appendListItem(countries, '');

    return (
      <ul ref="listElement" className={className}>
        {this.props.isMobile && this.getCloseRowAndButton()}
        {preferredOptions}
        {divider}
        {options}
      </ul>
    );
  }
}

export default CountryList;
