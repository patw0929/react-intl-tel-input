'use strict';

import React from 'react';
import AllCountries from './AllCountries';
import FlagDropDown from './FlagDropDown';
import TelInput from './TelInput';
import utils from './utils';

import '../styles/intlTelInput.scss';

export default React.createClass({
  isGoodBrowser () {
    return Boolean(document.createElement('input').setSelectionRange);
  },

  keys: {
    UP: 38,
    DOWN: 40,
    ENTER: 13,
    ESC: 27,
    PLUS: 43,
    A: 65,
    Z: 90,
    ZERO: 48,
    NINE: 57,
    SPACE: 32,
    BSPACE: 8,
    TAB: 9,
    DEL: 46,
    CTRL: 17,
    CMD1: 91, // Chrome
    CMD2: 224 // FF
  },

  isMobile: /Android.+Mobile|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  preferredCountries: [],
  countries: [],
  countryCodes: {},

  propTypes: {
    allowExtensions: React.PropTypes.bool,
    autoFormat: React.PropTypes.bool,
    autoPlaceholder: React.PropTypes.bool,
    autoHideDialCode: React.PropTypes.bool,
    defaultCountry: React.PropTypes.string,
    geoIpLookup: React.PropTypes.func,
    nationalMode: React.PropTypes.bool,
    numberType: React.PropTypes.string,
    onlyCountries: React.PropTypes.arrayOf(React.PropTypes.string),
    preferredCountries: React.PropTypes.arrayOf(React.PropTypes.string),
    utilsScript: React.PropTypes.string
  },

  getDefaultProps () {
    return {
      // typing digits after a valid number will be added to the extension part of the number
      allowExtensions: false,
      // automatically format the number according to the selected country
      autoFormat: true,
      // add or remove input placeholder with an example number for the selected country
      autoPlaceholder: true,
      // if there is just a dial code in the input: remove it on blur, and re-add it on focus
      autoHideDialCode: true,
      // default country
      defaultCountry: "",
      // geoIp lookup function
      geoIpLookup: null,
      // don't insert international dial codes
      nationalMode: true,
      // number type to use for placeholders
      numberType: "MOBILE",
      // display only these countries
      onlyCountries: [],
      // the countries at the top of the list. defaults to united states and united kingdom
      preferredCountries: ["us", "gb"],
      // specify the path to the libphonenumber script to enable validation/formatting
      utilsScript: ""
    };
  },

  getInitialState () {
    return {
      countryList: {
        showDropdown: false,
        highlightedCountry: 'us'
      },
      telInput: {
        disabled: false,
        readonly: false,
        offsetTop: 0,
        outerHeight: 0
      },
      countryCode: this.props.defaultCountry || 'us'
    };
  },

  changeHighlightCountry (country) {
    this.setState({
      countryList: {
        showDropdown: true,
        highlightedCountry: country
      },
      telInput: this.state.telInput,
      countryCode: this.state.countryCode
    });
  },

  // highlight the next/prev item in the list (and ensure it is visible)
  handleUpDownKey (key) {
    let current = React.findDOMNode(this.refs.flagDropDown).querySelectorAll(".highlight")[0];
    let next = ((key === this.keys.UP) ? ((current) ? current.previousElementSibling : undefined) : ((current) ? current.nextElementSibling : undefined));

    if (next) {
      // skip the divider
      if (next.getAttribute('class').indexOf('divider') > -1) {
        next = (key === this.keys.UP) ? next.previousElementSibling : next.nextElementSibling;
      }

      this.scrollTo(next);

      let countryCode = next.getAttribute('data-country-code');

      this.setState({
        countryList: {
          showDropdown: true,
          highlightedCountry: countryCode
        },
        telInput: this.state.telInput,
        countryCode: this.state.countryCode
      });
    }
  },

  // select the currently highlighted item
  handleEnterKey () {
    let current = React.findDOMNode(this.refs.flagDropDown).querySelectorAll(".highlight")[0];
    if (current) {
      let countryCode = current.getAttribute('data-country-code');

      this.setState({
        countryList: {
          showDropdown: false,
          highlightedCountry: countryCode
        },
        telInput: this.state.telInput,
        countryCode: countryCode
      });
    }
  },

  // check if an element is visible within it's container, else scroll until it is
  scrollTo (element, middle) {
    let container = React.findDOMNode(this.refs.flagDropDown).querySelector('.country-list'),
      containerHeight = parseFloat(getComputedStyle(container).getPropertyValue('height')),
      containerTop = utils.offset(container).top,
      containerBottom = containerTop + containerHeight,
      elementHeight = utils.getOuterHeight(element),
      elementTop = utils.offset(element).top,
      elementBottom = elementTop + elementHeight,
      newScrollTop = elementTop - containerTop + container.scrollTop,
      middleOffset = (containerHeight / 2) - (elementHeight / 2);

    if (elementTop < containerTop) {
      // scroll up
      if (middle) {
        newScrollTop -= middleOffset;
      }

      container.scrollTop = newScrollTop;
    } else if (elementBottom > containerBottom) {
      // scroll down
      if (middle) {
        newScrollTop += middleOffset;
      }
      var heightDifference = containerHeight - elementHeight;

      container.scrollTop = newScrollTop - heightDifference;
    }
  },

  // find the first list item whose name starts with the query string
  searchForCountry (query) {
    for (let i = 0, max = this.countries.length; i < max; i++) {
      if (utils.startsWith(this.countries[i].name, query)) {
        let listItem = React.findDOMNode(this.refs.flagDropDown)
                            .querySelector('.country-list [data-country-code="' + this.countries[i].iso2 + '"]:not([class="preferred"])');

        // update highlighting and scroll
        this.setState({
          countryList: {
            showDropdown: true,
            highlightedCountry: this.countries[i].iso2
          },
          telInput: this.state.telInput,
          countryCode: this.state.countryCode
        });
        this.scrollTo(listItem, true);
        break;
      }
    }
  },

  query: '',

  handleDocumentKeyDown (e) {
    let queryTimer;
    // prevent down key from scrolling the whole page,
    // and enter key from submitting a form etc
    e.preventDefault();

    if (e.which === this.keys.UP || e.which === this.keys.DOWN) {
      // up and down to navigate
      this.handleUpDownKey(e.which);
    } else if (e.which === this.keys.ENTER) {
      // enter to select
      this.handleEnterKey();
    } else if (e.which === this.keys.ESC) {
      // esc to close
      this.setState({
        countryList: {
          showDropdown: false,
          highlightedCountry: this.state.countryList.highlightedCountry
        },
        telInput: {
          disabled: this.state.telInput.disabled,
          readonly: this.state.telInput.readonly,
          offsetTop: this.state.telInput.offsetTop,
          outerHeight: this.state.telInput.outerHeight
        },
        countryCode: this.state.countryCode
      });
    } else if ((e.which >= this.keys.A && e.which <= this.keys.Z) || e.which === this.keys.SPACE) {
      // upper case letters (note: keyup/keydown only return upper case letters)
      // jump to countries that start with the query string
      if (queryTimer) {
        clearTimeout(queryTimer);
      }

      if (!this.query) {
        this.query = '';
      }
      this.query += String.fromCharCode(e.which);
      this.searchForCountry(this.query);
      // if the timer hits 1 second, reset the query
      queryTimer = setTimeout(() => {
        this.query = '';
      }, 1000);
    }
  },

  handleDocumentClick () {
    this.setState({
      countryList: {
        showDropdown: false,
        highlightedCountry: this.state.countryList.highlightedCountry
      },
      telInput: {
        disabled: this.state.telInput.disabled,
        readonly: this.state.telInput.readonly,
        offsetTop: this.state.telInput.offsetTop,
        outerHeight: this.state.telInput.outerHeight
      },
      countryCode: this.state.countryCode
    });
  },

  componentDidMount () {
    document.addEventListener('keydown', this.handleDocumentKeyDown);
    document.querySelector('html').addEventListener('click', this.handleDocumentClick);
  },

  componentWillUpdate (nextProps, nextState) {
    if (nextState.countryList.showDropdown) {
      document.addEventListener('keydown', this.handleDocumentKeyDown);
      document.querySelector('html').addEventListener('click', this.handleDocumentClick);
    } else {
      document.removeEventListener('keydown', this.handleDocumentKeyDown);
      document.querySelector('html').removeEventListener('click', this.handleDocumentClick);
    }
  },

  // prepare all of the country data, including onlyCountries and preferredCountries options
  processCountryData () {
    // set the instances country data objects
    this.setInstanceCountryData();

    // set the preferredCountries property
    this.setPreferredCountries();
  },

  // add a country code to this.countryCodes
  addCountryCode (countryCodes, iso2, dialCode, priority) {
    if (!(dialCode in countryCodes)) {
      countryCodes[dialCode] = [];
    }

    let index = priority || 0;
    countryCodes[dialCode][index] = iso2;

    return countryCodes;
  },

  // process onlyCountries array if present, and generate the countryCodes map
  setInstanceCountryData () {
    let country = '',
        countries = [];

    // process onlyCountries option
    if (this.props.onlyCountries.length) {
      // standardise case
      for (let i = 0, max = this.props.onlyCountries.length; i < max; i++) {
        country = this.props.onlyCountries[i].toLowerCase();
      }

      // build instance country array
      for (let i = 0, max = AllCountries.length; i < max; i++) {
        if (country.indexOf(AllCountries[i].iso2) > -1) {
          this.countries.push(AllCountries[i]);
        }
      }
    } else {
      this.countries = AllCountries;
    }

    // generate countryCodes map
    let countryCodes = {};

    for (let i = 0, max = countries.length; i < max; i++) {
      let c = countries[i];
      countryCodes = this.addCountryCode(countryCodes, c.iso2, c.dialCode, c.priority);
      // area codes
      if (c.areaCodes) {
        for (let j = 0, max = c.areaCodes.length; j < max; j++) {
          // full dial code is country code + dial code
          countryCodes = this.addCountryCode(countryCodes, c.iso2, c.dialCode + c.areaCodes[j]);
        }
      }
    }

    this.countryCodes = countryCodes;
  },

  // process preferred countries - iterate through the preferences,
  // fetching the country data for each one
  setPreferredCountries () {
    this.preferredCountries = [];
    for (let i = 0, max = this.props.preferredCountries.length; i < max; i++) {
      let countryCode = this.props.preferredCountries[i].toLowerCase(),
          countryData = utils.getCountryData(countryCode, true);

      if (countryData) {
        this.preferredCountries.push(countryData);
      }
    }
  },

  // called when the user selects a list item from the dropdown
  selectFlag (countryCode) {
    this.selectedCountryData = (countryCode) ? utils.getCountryData(countryCode, false) : {};
    // update selected flag and active list item
    if (!this.isMobile) {
      this.setState({
        countryList: {
          showDropdown: false,
          highlightedCountry: this.state.countryList.highlightedCountry
        },
        telInput: this.state.telInput,
        countryCode: countryCode
      });
    }

    //this.updateDialCode(listItem.attr("data-dial-code"), true);

    // always fire the change event as even if nationalMode=true (and we haven't updated the input val), the system as a whole has still changed - see country-sync example. think of it as making a selection from a select element.
    //this.telInput.trigger("change");

    // focus the input
    React.findDOMNode(this.refs.telInput).focus();
    // fix for FF and IE11 (with nationalMode=false i.e. auto inserting dial code), who try to put the cursor at the beginning the first time
    if (this.isGoodBrowser) {
      //var len = this.telInput.val().length;
      //this.telInput[0].setSelectionRange(len, len);
    }
  },

  handleSelectedFlagKeydown (e) {
    if (!this.state.showDropdown &&
       (e.which === this.keys.UP || e.which === this.keys.DOWN ||
        e.which === this.keys.SPACE || e.which === this.keys.ENTER)
      ) {
      // prevent form from being submitted if "ENTER" was pressed
      e.preventDefault();

      // prevent event from being handled again by document
      e.stopPropagation();

      this.toggleDropdown(true);
    }

    // allow navigation from dropdown to input on TAB
    if (e.which === this.keys.TAB) {
      this.toggleDropdown(false);
    }
  },

  toggleDropdown (status) {
    this.setState({
      countryList: {
        showDropdown: !!status,
        highlightedCountry: this.state.countryList.highlightedCountry
      },
      telInput: this.state.telInput,
      countryCode: this.state.countryCode
    });
  },

  clickSelectedFlag (e) {
    if (!this.state.countryList.showDropdown &&
        !this.state.telInput.disabled &&
        !this.state.telInput.readonly) {
      this.setState({
        countryList: {
          showDropdown: true,
          highlightedCountry: this.state.countryList.highlightedCountry
        },
        telInput: {
          disabled: this.state.telInput.disabled,
          readonly: this.state.telInput.readonly,
          offsetTop: utils.offset(React.findDOMNode(this.refs.telInput)).top,
          outerHeight: utils.getOuterHeight(React.findDOMNode(this.refs.telInput))
        },
        countryCode: this.state.countryCode
      });
    }
  },

  render () {
    this.processCountryData();

    return (
      <div className="intl-tel-input">
        <FlagDropDown ref="flagDropDown"
                      clickSelectedFlag={this.clickSelectedFlag}
                      countryCode={this.state.countryCode}
                      isMobile={this.isMobile}
                      toggleDropdown={this.toggleDropdown}
                      showDropdown={this.state.countryList.showDropdown}
                      handleSelectedFlagKeydown={this.handleSelectedFlagKeydown}
                      selectFlag={this.selectFlag}
                      countries={this.countries}
                      inputTop={this.state.telInput.offsetTop}
                      inputOuterHeight={this.state.telInput.outerHeight}
                      preferredCountries={this.preferredCountries}
                      highlightedCountry={this.state.countryList.highlightedCountry}
                      changeHighlightCountry={this.changeHighlightCountry} />
        <TelInput ref="telInput"
                  disabled={this.state.telInput.disabled}
                  readonly={this.state.telInput.readonly} />
      </div>
    );
  }
});
