import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import utils from './utils';

class CountryList extends Component {
  constructor() {
    super();
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleChangeCountry = this.handleChangeCountry.bind(this);
    this.selectFlag = this.selectFlag.bind(this);
    this.appendListItem = this.appendListItem.bind(this);
    this.setDropdownPosition = this.setDropdownPosition.bind(this);
  }

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
    actions: PropTypes.object
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.showDropdown && !nextProps.isMobile) {
      findDOMNode(this.refs.listElement).setAttribute('class', 'country-list v-hide');
      this.setDropdownPosition();
    }
  }

  shouldComponentUpdate(nextProps) {
    return !utils.shallowEquals(this.props, nextProps);
  }

  handleChangeCountry(e) {
    this.selectFlag(e.target.value);
  }

  selectFlag(iso2) {
    this.props.selectFlag(iso2);
  }

  appendListItem(countries, className) {
    let preferredCountriesCount = this.props.preferredCountries.length;
    return countries.map((country, index) => {
      if (this.props.isMobile) {
        return (
          <option key={'country-' + index} data-dial-code={country.dialCode} value={country.iso2}>
            {country.name + ' +' + country.dialCode}
          </option>
        );
      } else {
        let actualIndex = (className === 'preferred') ? index : index + preferredCountriesCount;
        let countryClassObj = {
              country: true,
              highlight: (this.props.highlightedCountry === actualIndex)
            },
            countryClass;
        countryClassObj[className] = true;
        countryClass = classNames(countryClassObj);

        return (
          <li key={'country-' + index}
              className={countryClass}
              data-dial-code={country.dialCode}
              data-country-code={country.iso2}
              onMouseOver={this.handleMouseOver}
              onClick={this.selectFlag.bind(this, country.iso2)}>
            <div ref="selectedFlag" className="flag">
              <div ref="selectedFlagInner" className={'iti-flag ' + country.iso2}></div>
            </div>

            <span className="country-name">{country.name}</span>
            <span className="dial-code">+{country.dialCode}</span>
          </li>
        );
      }
    });
  }

  handleMouseOver(e) {
    if (e.currentTarget.getAttribute('class').indexOf('country') > -1) {
      let selectedIndex = utils.retrieveLiIndex(e.currentTarget);
      this.props.actions.changeHighlightCountry(true, selectedIndex);
    }
  }

  setDropdownPosition() {
    let inputTop = this.props.inputTop,
      windowTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop,
      windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
      inputOuterHeight = this.props.inputOuterHeight,
      countryListOuterHeight = utils.getOuterHeight(findDOMNode(this.refs.listElement)),
      dropdownFitsBelow = (inputTop + inputOuterHeight + countryListOuterHeight < windowTop + windowHeight),
      dropdownFitsAbove = (inputTop - countryListOuterHeight > windowTop);

    // dropdownHeight - 1 for border
    let cssTop = (!dropdownFitsBelow && dropdownFitsAbove) ? '-' + (countryListOuterHeight - 1) + 'px' : '';
    findDOMNode(this.refs.listElement).style.top = cssTop;
    findDOMNode(this.refs.listElement).setAttribute('class', 'country-list');
  }

  render() {
    let options = '',
        preferredCountries = this.props.preferredCountries,
        preferredOptions,
        countries = this.props.countries,
        className = classNames({
          'country-list': true,
          'hide': !this.props.showDropdown
        }),
        divider;

    if (this.props.isMobile) {
      options = this.appendListItem(countries, '');

      return (
        <select className="iti-mobile-select" onChange={this.handleChangeCountry}>
          {options}
        </select>
      );
    } else {
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
}

export default CountryList;
