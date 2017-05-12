import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import utils from './utils';

function partial(fn, ...args) {
  return fn.bind(fn, ...args);
}

class CountryList extends Component {
  constructor() {
    super();
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.setFlag = this.setFlag.bind(this);
    this.appendListItem = this.appendListItem.bind(this);
    this.setDropdownPosition = this.setDropdownPosition.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showDropdown) {
      this.listElement.setAttribute('class', 'country-list v-hide');
      this.setDropdownPosition();
    }
  }

  shouldComponentUpdate(nextProps) {
    return !utils.shallowEquals(this.props, nextProps);
  }

  setDropdownPosition() {
    utils.removeClass(this.listElement, 'hide');

    const inputTop = this.props.inputTop;
    const windowTop = (window.pageYOffset !== undefined) ?
      window.pageYOffset :
      (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight ||
                         document.body.clientHeight;
    const inputOuterHeight = this.props.inputOuterHeight;
    const countryListOuterHeight = utils.getOuterHeight(this.listElement);
    const dropdownFitsBelow =
      (inputTop + inputOuterHeight + countryListOuterHeight < windowTop + windowHeight);
    const dropdownFitsAbove = (inputTop - countryListOuterHeight > windowTop);

    // dropdownHeight - 1 for border
    const cssTop = (!dropdownFitsBelow && dropdownFitsAbove) ?
                   `-${(countryListOuterHeight - 1)}px` : '';

    this.listElement.style.top = cssTop;
    this.listElement.setAttribute('class', 'country-list');
  }

  setFlag(iso2) {
    this.props.setFlag(iso2);
  }

  appendListItem(countries, isPreferred = false) {
    const preferredCountriesCount = this.props.preferredCountries.length;

    return countries.map((country, index) => {
      const actualIndex = isPreferred ? index : index + preferredCountriesCount;
      const countryClassObj = {
        country: true,
        highlight: (this.props.highlightedCountry === actualIndex),
        preferred: isPreferred,
      };
      const countryClass = classNames(countryClassObj);
      const keyPrefix = isPreferred ? 'pref-' : '';

      return (
        <li
          key={ `${keyPrefix}${country.iso2}` }
          className={ countryClass }
          data-dial-code={ country.dialCode }
          data-country-code={ country.iso2 }
          onMouseOver={ this.props.isMobile ? null : this.handleMouseOver }
          onClick={ partial(this.setFlag, country.iso2) }
        >
          <div
            ref={ (selectedFlag) => { this.selectedFlag = selectedFlag; } }
            className="flag-box"
          >
            <div
              ref={ (selectedFlagInner) => { this.selectedFlagInner = selectedFlagInner; } }
              className={ `iti-flag ${country.iso2}` }
            />
          </div>

          <span className="country-name">{ country.name }</span>
          <span className="dial-code">+{ country.dialCode }</span>
        </li>
      );
    });
  }

  handleMouseOver(e) {
    if (e.currentTarget.getAttribute('class').indexOf('country') > -1) {
      const selectedIndex = utils.retrieveLiIndex(e.currentTarget);

      this.props.changeHighlightCountry(true, selectedIndex);
    }
  }

  render() {
    let options = '';
    const preferredCountries = this.props.preferredCountries;
    let preferredOptions = null;
    const countries = this.props.countries;
    const className = classNames({
      'country-list': true,
      hide: !this.props.showDropdown,
    });
    let divider = null;

    if (preferredCountries.length) {
      preferredOptions = this.appendListItem(preferredCountries, true);
      divider = (
        <div className="divider" />
      );
    }

    options = this.appendListItem(countries);

    return (
      <ul
        ref={ (listElement) => { this.listElement = listElement; } }
        className={ className }
      >
        { preferredOptions }
        { divider }
        { options }
      </ul>
    );
  }
}

CountryList.propTypes = {
  setFlag: PropTypes.func,
  countries: PropTypes.arrayOf(PropTypes.object),
  inputTop: PropTypes.number,
  inputOuterHeight: PropTypes.number,
  preferredCountries: PropTypes.arrayOf(PropTypes.object),
  highlightedCountry: PropTypes.number,
  changeHighlightCountry: PropTypes.func,
  showDropdown: PropTypes.bool,
  isMobile: PropTypes.bool,
};

export default CountryList;
