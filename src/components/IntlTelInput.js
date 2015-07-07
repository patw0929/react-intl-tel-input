'use strict';

import React from 'react';
import Ajax from 'simple-ajax';
import _ from 'underscore.deferred';
import Cookies from 'cookies-js';
import AllCountries from './AllCountries';
import FlagDropDown from './FlagDropDown';
import TelInput from './TelInput';
import utils from './utils';

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

  windowLoaded: false,

  autoCountry: '',
  startedLoadingAutoCountry: false,

  autoCountryDeferred: new _.Deferred(),
  utilsScriptDeferred: new _.Deferred(),

  isMobile: /Android.+Mobile|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  preferredCountries: [],
  countries: [],
  countryCodes: {},

  propTypes: {
    css: React.PropTypes.arrayOf(React.PropTypes.string),
    fieldName: React.PropTypes.string,
    value: React.PropTypes.string,
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
    utilsScript: React.PropTypes.string,
    onPhoneNumberChange: React.PropTypes.func
  },

  getDefaultProps () {
    return {
      css: ['intl-tel-input', ''],
      fieldName: '',
      value: '',
      // typing digits after a valid number will be added to the extension part of the number
      allowExtensions: false,
      // automatically format the number according to the selected country
      autoFormat: true,
      // add or remove input placeholder with an example number for the selected country
      autoPlaceholder: true,
      // if there is just a dial code in the input: remove it on blur, and re-add it on focus
      autoHideDialCode: true,
      // default country
      defaultCountry: '',
      // geoIp lookup function
      geoIpLookup: null,
      // don't insert international dial codes
      nationalMode: true,
      // number type to use for placeholders
      numberType: 'MOBILE',
      // display only these countries
      onlyCountries: [],
      // the countries at the top of the list. defaults to united states and united kingdom
      preferredCountries: ['us', 'gb'],
      // specify the path to the libphonenumber script to enable validation/formatting
      utilsScript: '',
      onPhoneNumberChange: null
    };
  },

  getInitialState () {
    return {
      countryList: {
        showDropdown: false,
        highlightedCountry: 0
      },
      telInput: {
        value: this.props.value || '',
        disabled: false,
        readonly: false,
        offsetTop: 0,
        outerHeight: 0
      },
      countryCode: this.props.defaultCountry || 'us'
    };
  },

  componentWillReceiveProps (nextProps) {
    if (this.state.telInput.value !== nextProps.value) {
      this.setNumber(nextProps.value, null, true);
    }
  },

  notifyPhoneNumberChange (newNumber) {
    if (typeof this.props.onPhoneNumberChange === 'function') {
      let result = this.isValidNumber(newNumber);
      this.props.onPhoneNumberChange(result, newNumber, this.selectedCountryData);
    }
  },

  changeHighlightCountry (countryIndex) {
    this.setState({
      countryList: {
        showDropdown: true,
        highlightedCountry: countryIndex
      },
      telInput: this.state.telInput,
      countryCode: this.state.countryCode
    });
  },

  // highlight the next/prev item in the list (and ensure it is visible)
  handleUpDownKey (key) {
    let current = React.findDOMNode(this.refs.flagDropDown).querySelectorAll('.highlight')[0];
    let next = ((key === this.keys.UP) ? ((current) ? current.previousElementSibling : undefined) : ((current) ? current.nextElementSibling : undefined));

    if (next) {
      // skip the divider
      if (next.getAttribute('class').indexOf('divider') > -1) {
        next = (key === this.keys.UP) ? next.previousElementSibling : next.nextElementSibling;
      }

      this.scrollTo(next);

      let selectedIndex = utils.retrieveLiIndex(next);

      this.setState({
        countryList: {
          showDropdown: true,
          highlightedCountry: selectedIndex
        },
        telInput: this.state.telInput,
        countryCode: this.state.countryCode
      });
    }
  },

  // select the currently highlighted item
  handleEnterKey () {
    let current = React.findDOMNode(this.refs.flagDropDown).querySelectorAll('.highlight')[0];
    if (current) {
      let selectedIndex = utils.retrieveLiIndex(current);
      let countryCode = current.getAttribute('data-country-code');

      this.setState({
        countryList: {
          showDropdown: false,
          highlightedCountry: selectedIndex
        },
        telInput: this.state.telInput,
        countryCode: countryCode
      }, () => {
        this.selectFlag(this.state.countryCode);
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

  // validate the input val - assumes the global function isValidNumber (from utilsScript)
  isValidNumber (number) {
    let val = utils.trim(number),
      countryCode = (this.props.nationalMode) ? this.selectedCountryData.iso2 : '';

    if (window.intlTelInputUtils) {
      return window.intlTelInputUtils.isValidNumber(val, countryCode);
    }
    return false;
  },

  // find the first list item whose name starts with the query string
  searchForCountry (query) {
    for (let i = 0, max = this.countries.length; i < max; i++) {
      if (utils.startsWith(this.countries[i].name, query)) {
        let listItem = React.findDOMNode(this.refs.flagDropDown)
                            .querySelector('.country-list [data-country-code="' + this.countries[i].iso2 + '"]:not(.preferred)');

        let selectedIndex = utils.retrieveLiIndex(listItem);

        // update highlighting and scroll
        this.setState({
          countryList: {
            showDropdown: true,
            highlightedCountry: selectedIndex
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
          value: this.state.telInput.value,
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
      telInput: this.state.telInput,
      countryCode: this.state.countryCode
    });
  },

  // set the initial state of the input value and the selected flag
  setInitialState () {
    let val = this.props.value || '';

    // if there is a number, and it's valid, we can go ahead and set the flag, else fall back to default
    if (this.getDialCode(val)) {
      this.updateFlagFromNumber(val, true);
    } else if (this.props.defaultCountry !== 'auto') {
      // check the defaultCountry option, else fall back to the first in the list
      let defaultCountry = this.props.defaultCountry;
      if (!this.props.defaultCountry) {
        defaultCountry = (this.preferredCountries.length) ? this.preferredCountries[0].iso2 : this.countries[0].iso2;
      }
      this.selectFlag(defaultCountry);

      // if empty, insert the default dial code (this function will check !nationalMode and !autoHideDialCode)
      if (!val) {
        this.updateDialCode(this.selectedCountryData.dialCode, false);
      }
    }

    // format
    if (val) {
      // this wont be run after updateDialCode as that's only called if no val
      this.updateVal(val);
    }
  },

  // update the input's value to the given val
  // if autoFormat=true, format it first according to the country-specific formatting rules
  // Note: preventConversion will be false (i.e. we allow conversion) on init and when dev calls public method setNumber
  updateVal (val, format, addSuffix, preventConversion, isAllowedKey) {
    let formatted;

    if (this.props.autoFormat && window.intlTelInputUtils && this.selectedCountryData) {
      if (typeof format === 'number' && window.intlTelInputUtils.isValidNumber(val, this.selectedCountryData.iso2)) {
        // if user specified a format, and it's a valid number, then format it accordingly
        formatted = window.intlTelInputUtils.formatNumberByType(val, this.selectedCountryData.iso2, format);
      } else if (!preventConversion && this.props.nationalMode && val.charAt(0) === '+' && window.intlTelInputUtils.isValidNumber(val, this.selectedCountryData.iso2)) {
        // if nationalMode and we have a valid intl number, convert it to ntl
        formatted = window.intlTelInputUtils.formatNumberByType(val, this.selectedCountryData.iso2, window.intlTelInputUtils.numberFormat.NATIONAL);
      } else {
        // else do the regular AsYouType formatting
        formatted = window.intlTelInputUtils.formatNumber(val, this.selectedCountryData.iso2, addSuffix, this.props.allowExtensions, isAllowedKey);
      }
      // ensure we dont go over maxlength. we must do this here to truncate any formatting suffix, and also handle paste events
      var max = React.findDOMNode(this.refs.telInput).getAttribute('maxlength');
      if (max && formatted.length > max) {
        formatted = formatted.substr(0, max);
      }
    } else {
      // no autoFormat, so just insert the original value
      formatted = val;
    }

    this.setState({
      countryList: {
        showDropdown: false,
        highlightedCountry: this.state.countryList.highlightedCountry
      },
      telInput: {
        value: formatted,
        disabled: this.state.telInput.disabled,
        readonly: this.state.telInput.readonly,
        offsetTop: this.state.telInput.offsetTop,
        outerHeight: this.state.telInput.outerHeight
      }
    });
  },

  // replace any existing dial code with the new one (if not in nationalMode)
  // also we need to know if we're focusing for a couple of reasons e.g. if so, we want to add any formatting suffix, also if the input is empty and we're not in nationalMode, then we want to insert the dial code
  updateDialCode (newDialCode, focusing) {
    var inputVal = React.findDOMNode(this.refs.telInput).value,
      newNumber;

    // save having to pass this every time
    newDialCode = '+' + newDialCode;

    if (this.props.nationalMode && inputVal.charAt(0) !== '+') {
      // if nationalMode, we just want to re-format
      newNumber = inputVal;
    } else if (inputVal) {
      // if the previous number contained a valid dial code, replace it
      // (if more than just a plus character)
      var prevDialCode = this.getDialCode(inputVal);
      if (prevDialCode.length > 1) {
        newNumber = inputVal.replace(prevDialCode, newDialCode);
      } else {
        // if the previous number didn't contain a dial code, we should persist it
        var existingNumber = (inputVal.charAt(0) !== '+') ? utils.trim(inputVal) : '';
        newNumber = newDialCode + existingNumber;
      }
    } else {
      newNumber = (!this.props.autoHideDialCode || focusing) ? newDialCode : '';
    }

    this.updateVal(newNumber, null, focusing);
  },

  // try and extract a valid international dial code from a full telephone number
  // Note: returns the raw string inc plus character and any whitespace/dots etc
  getDialCode (number) {
    let dialCode = '';
    // only interested in international numbers (starting with a plus)
    if (number.charAt(0) === '+') {
      let numericChars = '';
      // iterate over chars
      for (let i = 0, max = number.length; i < max; i++) {
        let c = number.charAt(i);
        // if char is number
        if (utils.isNumeric(c)) {
          numericChars += c;
          // if current numericChars make a valid dial code
          if (this.countryCodes[numericChars]) {
            // store the actual raw string (useful for matching later)
            dialCode = number.substr(0, i + 1);
          }
          // longest dial code is 4 chars
          if (numericChars.length === 4) {
            break;
          }
        }
      }
    }
    return dialCode;
  },

  // check if the given number contains an unknown area code from the North American Numbering Plan i.e. the only dialCode that could be extracted was +1 but the actual number's length is >=4
  isUnknownNanp (number, dialCode) {
    return (dialCode === '+1' && utils.getNumeric(number).length >= 4);
  },

  // check if need to select a new flag based on the given number
  updateFlagFromNumber (number, updateDefault) {
    // if we're in nationalMode and we're on US/Canada, make sure the number starts with a +1 so getDialCode will be able to extract the area code
    // update: if we dont yet have selectedCountryData, but we're here (trying to update the flag from the number), that means we're initialising the plugin with a number that already has a dial code, so fine to ignore this bit
    if (number && this.props.nationalMode &&
        this.selectedCountryData && this.selectedCountryData.dialCode === '1' &&
        number.charAt(0) !== '+') {
      if (number.charAt(0) !== '1') {
        number = '1' + number;
      }
      number = '+' + number;
    }
    // try and extract valid dial code from input
    let dialCode = this.getDialCode(number),
      countryCode = null;

    if (dialCode) {
      // check if one of the matching countries is already selected
      let countryCodes = this.countryCodes[utils.getNumeric(dialCode)],
        alreadySelected = (this.selectedCountryData && countryCodes.indexOf(this.selectedCountryData.iso2) !== -1);

      // if a matching country is not already selected (or this is an unknown NANP area code): choose the first in the list
      if (!alreadySelected || this.isUnknownNanp(number, dialCode)) {
        // if using onlyCountries option, countryCodes[0] may be empty, so we must find the first non-empty index
        for (let j = 0, max = countryCodes.length; j < max; j++) {
          if (countryCodes[j]) {
            countryCode = countryCodes[j];
            break;
          }
        }
      }
    } else if (number.charAt(0) === '+' && utils.getNumeric(number).length) {
      // invalid dial code, so empty
      // Note: use getNumeric here because the number has not been formatted yet, so could contain bad shit
      countryCode = '';
    } else if (!number || number === '+') {
      // empty, or just a plus, so default
      countryCode = this.props.defaultCountry;
    }

    if (countryCode !== null && countryCode !== '') {
      this.selectFlag(countryCode);
    }
  },

  initRequests () {
    // if the user has specified the path to the utils script, fetch it on window.load
    if (this.props.utilsScript) {
      // if the plugin is being initialised after the window.load event has already been fired
      if (this.windowLoaded) {
        this.loadUtils();
      } else {
        // wait until the load event so we don't block any other requests e.g. the flags image
        window.onload = () => {
          this.loadUtils();
        };
      }
    } else {
      this.utilsScriptDeferred.resolve();
    }

    if (this.props.defaultCountry === 'auto') {
      this.loadAutoCountry();
    } else {
      this.autoCountryDeferred.resolve();
    }
  },

  loadAutoCountry () {
    // check for cookie
    let cookieAutoCountry = (Cookies) ? Cookies.get('itiAutoCountry') : '';
    if (cookieAutoCountry) {
      this.autoCountry = cookieAutoCountry;
    }

    // 3 options:
    // 1) already loaded (we're done)
    // 2) not already started loading (start)
    // 3) already started loading (do nothing - just wait for loading callback to fire)
    if (this.autoCountry) {
      this.autoCountryLoaded();
    } else if (!this.startedLoadingAutoCountry) {
      // don't do this twice!
      this.startedLoadingAutoCountry = true;

      if (typeof this.props.geoIpLookup === 'function') {
        this.props.geoIpLookup((countryCode) => {
          this.autoCountry = countryCode.toLowerCase();
          if (Cookies) {
            Cookies.set('itiAutoCountry', this.autoCountry, {
              path: '/'
            });
          }
          // tell all instances the auto country is ready
          // TODO: this should just be the current instances
          this.autoCountryLoaded();
        });
      }
    }
  },

  // this is called when the geoip call returns
  autoCountryLoaded () {
    if (this.props.defaultCountry === 'auto') {
      this.props.defaultCountry = this.autoCountry;
      this.setInitialState();
      this.autoCountryDeferred.resolve();
    }
  },

  loadUtils () {
    let ajax = new Ajax({
      url: this.props.utilsScript
    }).on('success', (event) => {
      let data = event.target.response;
      if (data) {
        (window.execScript || function (res) {
          window.eval.call(window, res);
        })(data);
      }
      this.utilsScriptDeferred.resolve();
    });
    ajax.send();
  },

  componentDidMount () {
    window.onload = () => {
      this.windowLoaded = true;
    };

    this.initRequests();

    this.setInitialState();

    var deferreds = [];
    deferreds.push(this.autoCountryDeferred.promise());
    deferreds.push(this.utilsScriptDeferred.promise());

    _.when(deferreds).done(() => {
      this.setInitialState();
    });

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
    if (this.state.telInput.value !== nextState.telInput.value) {
      this.notifyPhoneNumberChange(nextState.telInput.value);
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

    for (let i = 0, max = this.countries.length; i < max; i++) {
      let c = this.countries[i];
      countryCodes = this.addCountryCode(countryCodes, c.iso2, c.dialCode, c.priority);
      // area codes
      if (c.areaCodes) {
        for (let j = 0, areaCodesMax = c.areaCodes.length; j < areaCodesMax; j++) {
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
    this.setState({
      countryList: {
        showDropdown: false,
        highlightedCountry: this.state.countryList.highlightedCountry
      },
      telInput: this.state.telInput,
      countryCode: countryCode
    }, () => {
      // and the input's placeholder
      this.updatePlaceholder();

      this.updateDialCode(this.selectedCountryData.dialCode, true);

      // always fire the change event as even if nationalMode=true (and we haven't updated the input val), the system as a whole has still changed - see country-sync example. think of it as making a selection from a select element.
      //this.telInput.trigger("change");

      // focus the input
      React.findDOMNode(this.refs.telInput).focus();
      // fix for FF and IE11 (with nationalMode=false i.e. auto inserting dial code), who try to put the cursor at the beginning the first time
      if (this.isGoodBrowser) {
        let len = this.state.telInput.value.length;
        React.findDOMNode(this.refs.telInput).setSelectionRange(len, len);
      }
    });
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

  clickSelectedFlag () {
    if (!this.state.countryList.showDropdown &&
        !this.state.telInput.disabled &&
        !this.state.telInput.readonly) {
      this.setState({
        countryList: {
          showDropdown: true,
          highlightedCountry: this.state.countryList.highlightedCountry
        },
        telInput: {
          value: this.state.telInput.value,
          disabled: this.state.telInput.disabled,
          readonly: this.state.telInput.readonly,
          offsetTop: utils.offset(React.findDOMNode(this.refs.telInput)).top,
          outerHeight: utils.getOuterHeight(React.findDOMNode(this.refs.telInput))
        },
        countryCode: this.state.countryCode
      });
    }
  },

  // prevent deleting the plus (if not in nationalMode)
  ensurePlus () {
    if (!this.props.nationalMode) {
      let val = this.state.telInput.value,
        input = React.findDOMNode(this.refs.telInput);
      if (val.charAt(0) !== '+') {
        // newCursorPos is current pos + 1 to account for the plus we are about to add
        let newCursorPos = (this.isGoodBrowser) ? input.selectionStart + 1 : 0;

        this.setState({
          countryList: this.state.countryList,
          telInput: {
            value: '+' + val,
            disabled: this.state.telInput.disabled,
            readonly: this.state.telInput.readonly,
            offsetTop: this.state.telInput.offsetTop,
            outerHeight: this.state.telInput.outerHeight
          },
          countryCode: this.state.countryCode
        });

        if (this.isGoodBrowser) {
          input.setSelectionRange(newCursorPos, newCursorPos);
        }
      }
    }
  },

  // alert the user to an invalid key event
  handleInvalidKey () {
    React.findDOMNode(this.refs.telInput).classList.add('iti-invalid-key');
    setTimeout(() => {
      React.findDOMNode(this.refs.telInput).classList.remove('iti-invalid-key');
    }, 100);
  },

  // when autoFormat is enabled: handle various key events on the input:
  // 1) adding a new number character, which will replace any selection, reformat, and preserve the cursor position
  // 2) reformatting on backspace/delete
  // 3) cut/paste event
  handleInputKey (newNumericChar, addSuffix, isAllowedKey) {
    let val = React.findDOMNode(this.refs.telInput).value,
      // cleanBefore = utils.getClean(val),
      originalLeftChars,
      // raw DOM element
      input = React.findDOMNode(this.refs.telInput),
      digitsOnRight = 0;

    if (this.isGoodBrowser) {
      // cursor strategy: maintain the number of digits on the right. we use the right instead of the left so that A) we dont have to account for the new digit (or multiple digits if paste event), and B) we're always on the right side of formatting suffixes
      digitsOnRight = this.getDigitsOnRight(val, input.selectionEnd);

      // if handling a new number character: insert it in the right place
      if (newNumericChar) {
        // replace any selection they may have made with the new char
        val = val.substr(0, input.selectionStart) + newNumericChar + val.substring(input.selectionEnd, val.length);
      } else {
        // here we're not handling a new char, we're just doing a re-format (e.g. on delete/backspace/paste, after the fact), but we still need to maintain the cursor position. so make note of the char on the left, and then after the re-format, we'll count in the same number of digits from the right, and then keep going through any formatting chars until we hit the same left char that we had before.
        // UPDATE: now have to store 2 chars as extensions formatting contains 2 spaces so you need to be able to distinguish
        originalLeftChars = val.substr(input.selectionStart - 2, 2);
      }
    } else if (newNumericChar) {
      val += newNumericChar;
    }

    // update the number and flag
    this.setNumber(val, null, addSuffix, true, isAllowedKey);

    // update the cursor position
    if (this.isGoodBrowser) {
      let newCursor;
      val = React.findDOMNode(this.refs.telInput).value;

      // if it was at the end, keep it there
      if (!digitsOnRight) {
        newCursor = val.length;
      } else {
        // else count in the same number of digits from the right
        newCursor = this.getCursorFromDigitsOnRight(val, digitsOnRight);

        // but if delete/paste etc, keep going left until hit the same left char as before
        if (!newNumericChar) {
          newCursor = this.getCursorFromLeftChar(val, newCursor, originalLeftChars);
        }
      }
      // set the new cursor
      input.setSelectionRange(newCursor, newCursor);
    }
  },

  // we start from the position in guessCursor, and work our way left until we hit the originalLeftChars or a number to make sure that after reformatting the cursor has the same char on the left in the case of a delete etc
  getCursorFromLeftChar (val, guessCursor, originalLeftChars) {
    for (let i = guessCursor; i > 0; i--) {
      let leftChar = val.charAt(i - 1);
      if (utils.isNumeric(leftChar) || val.substr(i - 2, 2) === originalLeftChars) {
        return i;
      }
    }
    return 0;
  },

  // after a reformat we need to make sure there are still the same number of digits to the right of the cursor
  getCursorFromDigitsOnRight (val, digitsOnRight) {
    for (let i = val.length - 1; i >= 0; i--) {
      if (utils.isNumeric(val.charAt(i))) {
        if (--digitsOnRight === 0) {
          return i;
        }
      }
    }
    return 0;
  },

  // get the number of numeric digits to the right of the cursor so we can reposition the cursor correctly after the reformat has happened
  getDigitsOnRight (val, selectionEnd) {
    let digitsOnRight = 0;
    for (let i = selectionEnd, max = val.length; i < max; i++) {
      if (utils.isNumeric(val.charAt(i))) {
        digitsOnRight++;
      }
    }
    return digitsOnRight;
  },

  // set the input value and update the flag
  setNumber (number, format, addSuffix, preventConversion, isAllowedKey) {
    // ensure starts with plus
    if (!this.props.nationalMode && number.charAt(0) !== '+') {
      number = '+' + number;
    }
    // we must update the flag first, which updates this.selectedCountryData, which is used later for formatting the number before displaying it
    this.updateFlagFromNumber(number);
    this.updateVal(number, format, addSuffix, preventConversion, isAllowedKey);
  },

  // update the input placeholder to an example number from the currently selected country
  updatePlaceholder () {
    if (window.intlTelInputUtils && !this.hadInitialPlaceholder && this.props.autoPlaceholder && this.selectedCountryData) {
      let iso2 = this.selectedCountryData.iso2,
        numberType = window.intlTelInputUtils.numberType[this.props.numberType || 'FIXED_LINE'],
        placeholder = (iso2) ? window.intlTelInputUtils.getExampleNumber(iso2, this.props.nationalMode, numberType) : '';
      React.findDOMNode(this.refs.telInput).setAttribute('placeholder', placeholder);
    }
  },

  handleKeyPress (e) {
    if (this.props.autoFormat) {
      // format number and update flag on keypress
      // use keypress event as we want to ignore all input except for a select few keys,
      // but we dont want to ignore the navigation keys like the arrows etc.
      // NOTE: no point in refactoring this to only bind these listeners on focus/blur because then you would need to have those 2 listeners running the whole time anyway...

      // 32 is space, and after that it's all chars (not meta/nav keys)
      // this fix is needed for Firefox, which triggers keypress event for some meta/nav keys
      // Update: also ignore if this is a metaKey e.g. FF and Safari trigger keypress on the v of Ctrl+v
      // Update: also ignore if ctrlKey (FF on Windows/Ubuntu)
      // Update: also check that we have utils before we do any autoFormat stuff
      if (e.which >= this.keys.SPACE &&
          !e.ctrlKey && !e.metaKey && window.intlTelInputUtils && !this.state.telInput.readonly) {
        e.preventDefault();
        // allowed keys are just numeric keys and plus
        // we must allow plus for the case where the user does select-all and then hits plus to start typing a new number. we could refine this logic to first check that the selection contains a plus, but that wont work in old browsers, and I think it's overkill anyway
        let isAllowedKey = ((e.which >= this.keys.ZERO && e.which <= this.keys.NINE) || e.which === this.keys.PLUS),
          input = React.findDOMNode(this.refs.telInput),
          noSelection = (this.isGoodBrowser && input.selectionStart === input.selectionEnd),
          max = input.getAttribute('maxlength'),
          val = input.value,
          // assumes that if max exists, it is >0
          isBelowMax = (max) ? (val.length < max) : true;
        // first: ensure we dont go over maxlength. we must do this here to prevent adding digits in the middle of the number
        // still reformat even if not an allowed key as they could by typing a formatting char, but ignore if there's a selection as doesn't make sense to replace selection with illegal char and then immediately remove it
        if (isBelowMax && (isAllowedKey || noSelection)) {
          let newChar = (isAllowedKey) ? String.fromCharCode(e.which) : null;
          this.handleInputKey(newChar, true, isAllowedKey);
        }
        if (!isAllowedKey) {
          this.handleInvalidKey();
        }
      }
    }
  },

  handleKeyUp (e) {
    // the "enter" key event from selecting a dropdown item is triggered here on the input, because the document.keydown handler that initially handles that event triggers a focus on the input, and so the keyup for that same key event gets triggered here. weird, but just make sure we dont bother doing any re-formatting in this case (we've already done preventDefault in the keydown handler, so it wont actually submit the form or anything).
    // ALSO: ignore keyup if readonly
    if (this.props.autoFormat && window.intlTelInputUtils) {
      // cursorAtEnd defaults to false for bad browsers else they would never get a reformat on delete
      let cursorAtEnd = (this.isGoodBrowser && React.findDOMNode(this.refs.telInput).selectionStart === this.state.telInput.value.length);

      if (!React.findDOMNode(this.refs.telInput).value) {
        // if they just cleared the input, update the flag to the default
        this.updateFlagFromNumber('');
      } else if ((e.which === this.keys.DEL && !cursorAtEnd) || e.which === this.keys.BSPACE) {
        // if delete in the middle: reformat with no suffix (no need to reformat if delete at end)
        // if backspace: reformat with no suffix (need to reformat if at end to remove any lingering suffix - this is a feature)
        // important to remember never to add suffix on any delete key as can fuck up in ie8 so you can never delete a formatting char at the end
        this.handleInputKey();
      }
      this.ensurePlus();
    } else {
      // if no autoFormat, just update flag
      this.updateFlagFromNumber(React.findDOMNode(this.refs.telInput).value);
    }
  },

  handleInputChange (e) {
    this.setState({
      countryList: this.state.countryList,
      telInput: {
        value: e.target.value,
        disabled: this.state.telInput.disabled,
        readonly: this.state.telInput.readonly,
        offsetTop: this.state.telInput.offsetTop,
        outerHeight: this.state.telInput.outerHeight
      },
      countryCode: this.state.countryCode
    });
  },

  render () {
    this.processCountryData();

    let wrapperClass = this.props.css[0],
        inputClass = this.props.css[1];

    return (
      <div className={wrapperClass}>
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
                  className={inputClass}
                  disabled={this.state.telInput.disabled}
                  readonly={this.state.telInput.readonly}
                  fieldName={this.props.fieldName}
                  value={this.state.telInput.value}
                  handleInputChange={this.handleInputChange}
                  handleKeyPress={this.handleKeyPress}
                  handleKeyUp={this.handleKeyUp} />
      </div>
    );
  }
});
