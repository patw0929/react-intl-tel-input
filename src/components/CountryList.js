import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import utils from './utils';


function partial(fn, ...args) {
  return fn.bind(fn, ...args);
}

class CountryList extends Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    selectFlag: PropTypes.func,
    countries: PropTypes.array,
    inputTop: PropTypes.number,
    inputOuterHeight: PropTypes.number,
    preferredCountries: PropTypes.array,
    highlightedCountry: PropTypes.number,
    changeHighlightCountry: PropTypes.func,
    showDropdown: PropTypes.bool,
  };

  constructor() {
    super();
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleChangeCountry = this.handleChangeCountry.bind(this);
    this.selectFlag = this.selectFlag.bind(this);
    this.appendListItem = this.appendListItem.bind(this);
    this.setDropdownPosition = this.setDropdownPosition.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showDropdown && !nextProps.isMobile) {
      findDOMNode(this.refs.listElement).setAttribute('class', 'country-list v-hide');
      this.setDropdownPosition();
    }
  }

  shouldComponentUpdate(nextProps) {
    return !utils.shallowEquals(this.props, nextProps);
  }

  setDropdownPosition() {
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

  appendListItem(countries, className) {
    const preferredCountriesCount = this.props.preferredCountries.length;

    return countries.map((country, index) => {
      if (this.props.isMobile) {
        return (
          <option key={`country-${index}`}
            data-dial-code={country.dialCode} value={country.iso2}
          >
            {`${country.name} +${country.dialCode}`}
          </option>
        );
      }

      const actualIndex = (className === 'preferred') ? index : index + preferredCountriesCount;
      const countryClassObj = {
        country: true,
        highlight: (this.props.highlightedCountry === actualIndex),
      };
      let countryClass = undefined;
      countryClassObj[className] = true;
      countryClass = classNames(countryClassObj);

      return (
        <li key={`country-${index}`}
          className={countryClass}
          data-dial-code={country.dialCode}
          data-country-code={country.iso2}
          onMouseOver={this.handleMouseOver}
          onClick={partial(this.selectFlag, country.iso2)}
        >
          <div ref="selectedFlag" className="flag">
            <div ref="selectedFlagInner" className={`iti-flag ${country.iso2}`}></div>
          </div>

          <span className="country-name">{country.name}</span>
          <span className="dial-code">+{country.dialCode}</span>
        </li>
      );
    });
  }

  selectFlag(iso2) {
    this.props.selectFlag(iso2);
  }

  handleMouseOver(e) {
    if (e.currentTarget.getAttribute('class').indexOf('country') > -1) {
      const selectedIndex = utils.retrieveLiIndex(e.currentTarget);
      this.props.changeHighlightCountry(true, selectedIndex);
    }
  }

  handleChangeCountry(e) {
    this.selectFlag(e.target.value);
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

    if (this.props.isMobile) {
      options = this.appendListItem(countries, '');

      return (
        <select className="iti-mobile-select" onChange={this.handleChangeCountry}>
          {options}
        </select>
      );
    }

    if (preferredCountries.length) {
      preferredOptions = this.appendListItem(preferredCountries, 'preferred');
      divider = (
        <div className="divider"></div>
      );
    }

    options = this.appendListItem(countries, '');

    return (
      <ul ref="listElement" className={className}>
        {preferredOptions}
        {divider}
        {options}
      </ul>
    );
  }
}

export default CountryList;
