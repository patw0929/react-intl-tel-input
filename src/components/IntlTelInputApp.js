import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'underscore.deferred';
import StylePropTypes from 'react-style-proptype';
import AllCountries from './AllCountries';
import FlagDropDown from './FlagDropDown';
import TelInput from './TelInput';
import utils from './utils';
import '../styles/intlTelInput.scss';

const mobileUserAgentRegexp =
  /Android.+Mobile|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

class IntlTelInputApp extends Component {
  constructor(props) {
    super(props);

    this.wrapperClass = {};

    this.autoCountry = '';
    this.tempCountry = '';
    this.startedLoadingAutoCountry = false;

    this.deferreds = [];
    this.autoCountryDeferred = new _.Deferred();
    this.utilsScriptDeferred = new _.Deferred();

    this.isOpening = false;
    this.isMobile = typeof navigator !== 'undefined' &&
      mobileUserAgentRegexp.test(navigator.userAgent);
    this.preferredCountries = [];
    this.countries = [];
    this.countryCodes = {};

    this.windowLoaded = false;

    this.keys = {
      UP: 38,
      DOWN: 40,
      ENTER: 13,
      ESC: 27,
      PLUS: 43,
      A: 65,
      Z: 90,
      SPACE: 32,
      TAB: 9,
    };

    this.query = '';

    this.state = {
      showDropdown: false,
      highlightedCountry: 0,
      value: props.value || props.defaultValue,
      disabled: props.disabled,
      readonly: false,
      offsetTop: 0,
      outerHeight: 0,
      placeholder: '',
      title: '',
      countryCode: 'us',
      dialCode: '',
    };

    this.selectedCountryData = {};
    this.addCountryCode = this.addCountryCode.bind(this);
    this.autoCountryLoaded = this.autoCountryLoaded.bind(this);
    this.getDialCode = this.getDialCode.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleSelectedFlagKeydown = this.handleSelectedFlagKeydown.bind(this);
    this.setInitialState = this.setInitialState.bind(this);
    this.setNumber = this.setNumber.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.notifyPhoneNumberChange = this.notifyPhoneNumberChange.bind(this);
    this.isValidNumber = this.isValidNumber.bind(this);
    this.isUnknownNanp = this.isUnknownNanp.bind(this);
    this.initRequests = this.initRequests.bind(this);
    this.updateFlagFromNumber = this.updateFlagFromNumber.bind(this);
    this.updatePlaceholder = this.updatePlaceholder.bind(this);
    this.loadAutoCountry = this.loadAutoCountry.bind(this);
    this.loadUtils = this.loadUtils.bind(this);
    this.processCountryData = this.processCountryData.bind(this);
    this.getNumber = this.getNumber.bind(this);

    // wrapping actions
    this.setFlag = this.setFlag.bind(this);
    this.clickSelectedFlag = this.clickSelectedFlag.bind(this);
    this.updateValFromNumber = this.updateValFromNumber.bind(this);
    this.handleWindowScroll = this.handleWindowScroll.bind(this);
    this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.bindDocumentClick = this.bindDocumentClick.bind(this);
    this.unbindDocumentClick = this.unbindDocumentClick.bind(this);
    this.searchForCountry = this.searchForCountry.bind(this);
    this.handleEnterKey = this.handleEnterKey.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleUpDownKey = this.handleUpDownKey.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.changeHighlightCountry = this.changeHighlightCountry.bind(this);
    this.formatNumber = this.formatNumber.bind(this);
  }

  componentDidMount() {
    this.initialPlaceholder = this.props.placeholder;

    this.autoHideDialCode = this.props.autoHideDialCode;
    this.allowDropdown = this.props.allowDropdown;
    this.nationalMode = this.props.nationalMode;
    this.dropdownContainer = '';

    // if in nationalMode, disable options relating to dial codes
    if (this.nationalMode) {
      this.autoHideDialCode = false;
    }

    // if separateDialCode then doesn't make sense to
    // A) insert dial code into input (autoHideDialCode), and
    // B) display national numbers (because we're displaying the country dial code next to them)
    if (this.props.separateDialCode) {
      this.autoHideDialCode = false;
      this.nationalMode = false;
      // let's force this for now for simplicity - we can support this later if need be
      this.allowDropdown = true;
    }

    this.processCountryData.call(this);
    this.tempCountry = this.getTempCountry(this.props.defaultCountry);

    if (document.readyState === 'complete') {
      this.windowLoaded = true;
    } else {
      window.addEventListener('load', () => {
        this.windowLoaded = true;
      });
    }

    // generate the markup
    this.generateMarkup();
    // set the initial state of the input value and the selected flag
    this.setInitialState();
    // utils script, and auto country
    this.initRequests();

    this.deferreds.push(this.autoCountryDeferred.promise());
    this.deferreds.push(this.utilsScriptDeferred.promise());

    _.when(this.deferreds).done(() => {
      this.setInitialState();
    });

    document.addEventListener('keydown', this.handleDocumentKeyDown);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        value: nextProps.value,
      });
    }

    if (this.props.disabled !== nextProps.disabled) {
      this.setState({
        disabled: nextProps.disabled,
      });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.showDropdown) {
      document.addEventListener('keydown', this.handleDocumentKeyDown);
      this.bindDocumentClick();
    } else {
      document.removeEventListener('keydown', this.handleDocumentKeyDown);
      this.unbindDocumentClick();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
    window.removeEventListener('scroll', this.handleWindowScroll);
    this.unbindDocumentClick();
  }

  getTempCountry(countryCode) {
    if (countryCode === 'auto') {
      return 'auto';
    }

    let countryData = utils.getCountryData(this.countries, countryCode);

    // check if country is available in the list
    if (!countryData.iso2) {
      if (this.props.preferredCountries.length > 0) {
        countryData = utils.getCountryData(this.countries, this.props.preferredCountries[0]);
      } else {
        countryData = AllCountries.getCountries()[0];
      }
    }

    return countryData.iso2;
  }

  // set the input value and update the flag
  // NOTE: preventFormat arg is for public method
  setNumber(number, preventFormat) {
    // we must update the flag first, which updates this.selectedCountryData,
    // which is used for formatting the number before displaying it
    this.updateFlagFromNumber(number);
    this.updateValFromNumber(number, !preventFormat);
  }

  setFlagDropdownRef = (ref) => {
    this.flagDropDown = ref;
  }

  setTelRef = (ref) => {
    this.tel = ref;
  }

  // select the given flag, update the placeholder and the active list item
  // Note: called from setInitialState, updateFlagFromNumber, selectListItem, setCountry
  setFlag(countryCode, isInit) {
    const prevCountry = this.selectedCountryData &&
      this.selectedCountryData.iso2 ? this.selectedCountryData : {};

    // do this first as it will throw an error and stop if countryCode is invalid
    this.selectedCountryData = countryCode ?
      utils.getCountryData(this.countries, countryCode, false, false,
        this.props.noCountryDataHandler) : {};

    // update the defaultCountry - we only need the iso2 from now on, so just store that
    if (this.selectedCountryData.iso2) {
      this.defaultCountry = this.selectedCountryData.iso2;
    }

    // update the selected country's title attribute
    const title = countryCode ?
      `${this.selectedCountryData.name}: +${this.selectedCountryData.dialCode}` : 'Unknown';

    let dialCode = this.state.dialCode;

    if (this.props.separateDialCode) {
      dialCode = this.selectedCountryData.dialCode ?
        `+${this.selectedCountryData.dialCode}` : '';

      if (prevCountry.dialCode) {
        delete this.wrapperClass[`iti-sdc-${(prevCountry.dialCode.length + 1)}`];
      }

      if (dialCode) {
        this.wrapperClass[`iti-sdc-${dialCode.length}`] = true;
      }
    }

    let selectedIndex = 0;

    if (countryCode && countryCode !== 'auto') {
      for (let i = 0, max = this.countries.length; i < max; i++) {
        if (this.countries[i].iso2 === countryCode) {
          selectedIndex = i;
        }
      }

      selectedIndex += this.preferredCountries.length;
    }

    if (this.state.showDropdown) {
      this.tel.focus();
    }

    this.setState({
      showDropdown: false,
      highlightedCountry: selectedIndex,
      countryCode,
      title,
      dialCode,
    }, () => {
      // and the input's placeholder
      this.updatePlaceholder();

      // update the active list item
      this.wrapperClass.active = false;

      // on change flag, trigger a custom event
      // Allow Main app to do things when a country is selected
      if (!isInit && prevCountry.iso2 !== countryCode &&
          typeof this.props.onSelectFlag === 'function') {
        const currentNumber = this.state.value;

        this.props.onSelectFlag(currentNumber, this.selectedCountryData);
      }
    });
  }

  // get the extension from the current number
  getExtension(number) {
    if (window.intlTelInputUtils) {
      return window.intlTelInputUtils.getExtension(
        this.getFullNumber(number), this.selectedCountryData.iso2);
    }

    return '';
  }

  // format the number to the given format
  getNumber(number, format) {
    if (window.intlTelInputUtils) {
      return window.intlTelInputUtils.formatNumber(
        this.getFullNumber(number), this.selectedCountryData.iso2, format);
    }

    return '';
  }

  // get the input val, adding the dial code if separateDialCode is enabled
  getFullNumber(number) {
    const prefix = this.props.separateDialCode ?
      `+${this.selectedCountryData.dialCode}` : '';

    return prefix + number;
  }

  // try and extract a valid international dial code from a full telephone number
  // Note: returns the raw string inc plus character and any whitespace/dots etc
  getDialCode(number) {
    let dialCode = '';

    // only interested in international numbers (starting with a plus)
    if (number.charAt(0) === '+') {
      let numericChars = '';

      // iterate over chars
      for (let i = 0, max = number.length; i < max; i++) {
        const c = number.charAt(i);

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
  }

  // prepare all of the country data, including onlyCountries and preferredCountries options
  processCountryData() {
    // format countries data to what is necessary for component function
    // defaults to data defined in `AllCountries`
    AllCountries.initialize(this.props.countriesData);

    // process onlyCountries or excludeCountries array if present
    this.processAllCountries.call(this);

    // process the countryCodes map
    this.processCountryCodes.call(this);

    // set the preferredCountries property
    this.processPreferredCountries.call(this);
  }

  // add a country code to countryCodes
  addCountryCode = (countryCodes, iso2, dialCode, priority) => {
    if (!(dialCode in countryCodes)) {
      countryCodes[dialCode] = [];
    }

    const index = priority || 0;

    countryCodes[dialCode][index] = iso2;

    return countryCodes;
  }

  // filter the given countries using the process function
  filterCountries(countryArray, processFunc) {
    let i;

    // standardise case
    for (i = 0; i < countryArray.length; i++) {
      countryArray[i] = countryArray[i].toLowerCase();
    }

    // build instance country array
    this.countries = [];
    for (i = 0; i < AllCountries.getCountries().length; i++) {
      if (processFunc(countryArray.indexOf(AllCountries.getCountries()[i].iso2))) {
        this.countries.push(AllCountries.getCountries()[i]);
      }
    }
  }

  processAllCountries() {
    if (this.props.onlyCountries.length) {
      // process onlyCountries option
      this.filterCountries(this.props.onlyCountries, (inArray) =>
        // if country is in array
        inArray !== -1);
    } else if (this.props.excludeCountries.length) {
      // process excludeCountries option
      this.filterCountries(this.props.excludeCountries, (inArray) =>
        // if country is not in array
        inArray === -1);
    } else {
      this.countries = AllCountries.getCountries();
    }
  }

  // process the countryCodes map
  processCountryCodes() {
    this.countryCodes = {};
    for (let i = 0; i < this.countries.length; i++) {
      const c = this.countries[i];

      this.addCountryCode(this.countryCodes, c.iso2, c.dialCode, c.priority);
      // area codes
      if (c.areaCodes) {
        for (let j = 0; j < c.areaCodes.length; j++) {
          // full dial code is country code + dial code
          this.addCountryCode(this.countryCodes, c.iso2, c.dialCode + c.areaCodes[j]);
        }
      }
    }
  }

  // process preferred countries - iterate through the preferences,
  // fetching the country data for each one
  processPreferredCountries() {
    this.preferredCountries = [];
    for (let i = 0, max = this.props.preferredCountries.length; i < max; i++) {
      const countryCode = this.props.preferredCountries[i].toLowerCase();
      const countryData = utils.getCountryData(this.countries, countryCode, true);

      if (countryData) {
        this.preferredCountries.push(countryData);
      }
    }
  }

  // set the initial state of the input value and the selected flag
  setInitialState() {
    const val = this.props.value || this.props.defaultValue || '';

    // if we already have a dial code we can go ahead and set the flag, else fall back to default
    if (this.getDialCode(val)) {
      this.updateFlagFromNumber(val, true);
    } else if (this.tempCountry !== 'auto') {
      // see if we should select a flag
      if (this.tempCountry) {
        this.setFlag(this.tempCountry, true);
      } else {
        // no dial code and no tempCountry, so default to first in list
        this.defaultCountry = this.preferredCountries.length ?
          this.preferredCountries[0].iso2 : this.countries[0].iso2;
        if (!val) {
          this.setFlag(this.defaultCountry, true);
        }
      }
      // if empty and no nationalMode and no autoHideDialCode then insert the default dial code
      if (!val && !this.nationalMode && !this.autoHideDialCode && !this.props.separateDialCode) {
        this.setState({
          value: `+${this.selectedCountryData.dialCode}`,
        });
      }
    }

    const doNotify = true;

    // NOTE: if tempCountry is set to auto, that will be handled separately
    // format
    if (val) {
      this.updateValFromNumber(val, this.props.formatOnInit, doNotify);
    }
  }

  initRequests() {
    // if the user has specified the path to the utils script, fetch it on window.load
    if (this.props.utilsScript) {
      // if the plugin is being initialised after the window.load event has already been fired
      if (this.windowLoaded) {
        this.loadUtils();
      } else {
        // wait until the load event so we don't block any other requests e.g. the flags image
        window.addEventListener('load', () => {
          this.loadUtils();
        });
      }
    } else {
      this.utilsScriptDeferred.resolve();
    }

    if (this.tempCountry === 'auto') {
      this.loadAutoCountry();
    } else {
      this.autoCountryDeferred.resolve();
    }
  }

  loadAutoCountry() {
    // check for localStorage
    const lsAutoCountry =
      (window.localStorage !== undefined) ? window.localStorage.getItem('itiAutoCountry') : '';

    if (lsAutoCountry) {
      this.autoCountry = lsAutoCountry;
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
          if (window.localStorage !== undefined) {
            window.localStorage.setItem('itiAutoCountry', this.autoCountry);
          }
          // tell all instances the auto country is ready
          // TODO: this should just be the current instances
          // UPDATE: use setTimeout in case their geoIpLookup function calls this
          // callback straight away (e.g. if they have already done the geo ip lookup
          // somewhere else).
          // Using setTimeout means that the current thread of execution will finish before
          // executing this, which allows the plugin to finish initialising.
          this.autoCountryLoaded();
        });
      }
    }
  }

  cap(number) {
    const max = this.tel.getAttribute('maxlength');

    return max && number.length > max ? number.substr(0, max) : number;
  }

  removeEmptyDialCode() {
    const value = this.state.value;
    const startsPlus = value.charAt(0) === '+';

    if (startsPlus) {
      const numeric = utils.getNumeric(value);

      // if just a plus, or if just a dial code
      if (!numeric || this.selectedCountryData.dialCode === numeric) {
        this.setState({
          value: '',
        });
      }
    }
  }

  // highlight the next/prev item in the list (and ensure it is visible)
  handleUpDownKey(key) {
    const current = this.flagDropDown.querySelectorAll('.highlight')[0];
    const prevElement = (current) ? current.previousElementSibling : undefined;
    const nextElement = (current) ? current.nextElementSibling : undefined;
    let next = (key === this.keys.UP) ? prevElement : nextElement;

    if (next) {
      // skip the divider
      if (next.getAttribute('class').indexOf('divider') > -1) {
        next = (key === this.keys.UP) ? next.previousElementSibling : next.nextElementSibling;
      }

      this.scrollTo(next);

      const selectedIndex = utils.retrieveLiIndex(next);

      this.setState({
        showDropdown: true,
        highlightedCountry: selectedIndex,
      });
    }
  }

  // select the currently highlighted item
  handleEnterKey() {
    const current = this.flagDropDown.querySelectorAll('.highlight')[0];

    if (current) {
      const selectedIndex = utils.retrieveLiIndex(current);
      const countryCode = current.getAttribute('data-country-code');

      this.setState({
        showDropdown: false,
        highlightedCountry: selectedIndex,
        countryCode,
      }, () => {
        this.setFlag(this.state.countryCode);
        this.unbindDocumentClick();
      });
    }
  }

  // find the first list item whose name starts with the query string
  searchForCountry(query) {
    for (let i = 0, max = this.countries.length; i < max; i++) {
      if (utils.startsWith(this.countries[i].name, query)) {
        const listItem = this.flagDropDown.querySelector(
          `.country-list [data-country-code="${this.countries[i].iso2}"]:not(.preferred)`);

        const selectedIndex = utils.retrieveLiIndex(listItem);

        // update highlighting and scroll
        this.setState({
          showDropdown: true,
          highlightedCountry: selectedIndex,
        });
        this.scrollTo(listItem, true);
        break;
      }
    }
  }

  formatNumber(number) {
    if (window.intlTelInputUtils && this.selectedCountryData) {
      const format = !this.props.separateDialCode &&
        (this.nationalMode || number.charAt(0) !== '+') ?
          window.intlTelInputUtils.numberFormat.NATIONAL :
          window.intlTelInputUtils.numberFormat.INTERNATIONAL;

      number = window.intlTelInputUtils.formatNumber(number,
        this.selectedCountryData.iso2, format);
    }

    return number;
  }

  // update the input's value to the given val (format first if possible)
  // if doNotify is true, calls notifyPhoneNumberChange with the formatted value
  // NOTE: this is called from _setInitialState, handleUtils and setNumber
  updateValFromNumber(number, doFormat, doNotify = false) {
    if (doFormat && window.intlTelInputUtils && this.selectedCountryData) {
      const format = !this.props.separateDialCode &&
        (this.nationalMode || number.charAt(0) !== '+') ?
          window.intlTelInputUtils.numberFormat.NATIONAL :
          window.intlTelInputUtils.numberFormat.INTERNATIONAL;

      number = window.intlTelInputUtils.formatNumber(number,
        this.selectedCountryData.iso2, format);
    }

    number = this.beforeSetNumber(number);

    this.setState({
      showDropdown: false,
      value: number,
    }, () => {
      if (doNotify) {
        this.notifyPhoneNumberChange(this.state.value);
      }

      this.unbindDocumentClick();
    });
  }

  // check if need to select a new flag based on the given number
  // Note: called from _setInitialState, keyup handler, setNumber
  updateFlagFromNumber(number, isInit) {
    // if we're in nationalMode and we already have US/Canada selected,
    // make sure the number starts with a +1 so getDialCode will be
    // able to extract the area code
    // update: if we dont yet have selectedCountryData,
    // but we're here (trying to update the flag from the number),
    // that means we're initialising the plugin with a number that already
    // has a dial code, so fine to ignore this bit
    if (number && this.nationalMode && this.selectedCountryData &&
        this.selectedCountryData.dialCode === '1' && number.charAt(0) !== '+') {
      if (number.charAt(0) !== '1') {
        number = `1${number}`;
      }
      number = `+${number}`;
    }

    // try and extract valid dial code from input
    const dialCode = this.getDialCode(number);
    let countryCode = null;

    if (dialCode) {
      // check if one of the matching countries is already selected
      const countryCodes = this.countryCodes[utils.getNumeric(dialCode)];
      const alreadySelected = this.selectedCountryData &&
        countryCodes.indexOf(this.selectedCountryData.iso2) !== -1;

      // if a matching country is not already selected
      // (or this is an unknown NANP area code): choose the first in the list
      if (!alreadySelected || this.isUnknownNanp(number, dialCode)) {
        // if using onlyCountries option, countryCodes[0] may be empty,
        // so we must find the first non-empty index
        for (let j = 0; j < countryCodes.length; j++) {
          if (countryCodes[j]) {
            countryCode = countryCodes[j];
            break;
          }
        }
      }
    } else if (number.charAt(0) === '+' && utils.getNumeric(number).length) {
      // invalid dial code, so empty
      // Note: use getNumeric here because the number has not been
      // formatted yet, so could contain bad chars
      countryCode = '';
    } else if (!number || number === '+') {
      // empty, or just a plus, so default
      countryCode = this.defaultCountry;
    }

    if (countryCode !== null) {
      this.setFlag(countryCode, isInit);
    }
  }

  // check if the given number contains an unknown area code from
  // the North American Numbering Plan i.e. the only dialCode that
  // could be extracted was +1 but the actual number's length is >=4
  isUnknownNanp = (number, dialCode) => {
    return (dialCode === '+1' && utils.getNumeric(number).length >= 4);
  }

  handleOnBlur() {
    this.removeEmptyDialCode();
    if (typeof this.props.onPhoneNumberBlur === 'function') {
      const value = this.state.value;
      const fullNumber = this.formatFullNumber(value);
      const isValid = this.isValidNumber(fullNumber);

      this.props.onPhoneNumberBlur(
        isValid, value, this.selectedCountryData,
        fullNumber, this.getExtension(value));
    }
  }

  bindDocumentClick() {
    this.isOpening = true;
    document.querySelector('html').addEventListener('click', this.handleDocumentClick);
  }

  unbindDocumentClick() {
    document.querySelector('html').removeEventListener('click', this.handleDocumentClick);
  }

  clickSelectedFlag() {
    if (!this.state.showDropdown &&
        !this.state.disabled &&
        !this.state.readonly) {
      this.setState({
        showDropdown: true,
        offsetTop: utils.offset(this.tel).top,
        outerHeight: utils.getOuterHeight(this.tel),
      }, () => {
        const highlightItem = this.flagDropDown.querySelector('.highlight');

        if (highlightItem) {
          this.scrollTo(highlightItem, true);
        }
      });
    }
  }

  // update the input placeholder to an
  // example number from the currently selected country
  updatePlaceholder() {
    if (this.initialPlaceholder) {
      this.setState({
        placeholder: this.initialPlaceholder,
      });
    } else if (window.intlTelInputUtils && this.props.autoPlaceholder && this.selectedCountryData) {
      const numberType = window.intlTelInputUtils.numberType[this.props.numberType];
      let placeholder = this.selectedCountryData.iso2 ?
        window.intlTelInputUtils.getExampleNumber(this.selectedCountryData.iso2,
          this.nationalMode, numberType) : '';

      placeholder = this.beforeSetNumber(placeholder);

      if (typeof this.props.customPlaceholder === 'function') {
        placeholder = this.props.customPlaceholder(placeholder, this.selectedCountryData);
      }

      this.setState({
        placeholder,
      });
    }
  }

  toggleDropdown(status) {
    this.setState({
      showDropdown: !!status,
    }, () => {
      if (!this.state.showDropdown) {
        this.unbindDocumentClick();
      }
    });
  }

  // check if an element is visible within it's container, else scroll until it is
  scrollTo(element, middle) {
    try {
      const container = this.flagDropDown.querySelector('.country-list');
      const containerHeight = parseFloat(
        window.getComputedStyle(container).getPropertyValue('height'), 10);
      const containerTop = utils.offset(container).top;
      const containerBottom = containerTop + containerHeight;
      const elementHeight = utils.getOuterHeight(element);
      const elementTop = utils.offset(element).top;
      const elementBottom = elementTop + elementHeight;
      const middleOffset = (containerHeight / 2) - (elementHeight / 2);
      let newScrollTop = elementTop - containerTop + container.scrollTop;

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

        const heightDifference = containerHeight - elementHeight;

        container.scrollTop = newScrollTop - heightDifference;
      }
    } catch (err) {
      // do nothing
    }
  }

  generateMarkup() {
    this.wrapperClass['allow-dropdown'] = this.allowDropdown;
    this.wrapperClass['separate-dial-code'] = this.props.separateDialCode;

    if (this.isMobile && this.props.useMobileFullscreenDropdown) {
      utils.addClass(document.querySelector('body'), 'iti-mobile');
      // on mobile, we want a full screen dropdown, so we must append it to the body
      this.dropdownContainer = 'body';
      window.addEventListener('scroll', this.handleWindowScroll);
    }
  }

  handleSelectedFlagKeydown(e) {
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
  }

  // validate the input val - assumes the global function isValidNumber (from utilsScript)
  isValidNumber(number) {
    const val = utils.trim(number);
    const countryCode = (this.nationalMode) ? this.selectedCountryData.iso2 : '';

    if (window.intlTelInputUtils) {
      return window.intlTelInputUtils.isValidNumber(val, countryCode);
    }

    return false;
  }

  formatFullNumber(number) {
    return window.intlTelInputUtils
      ? this.getNumber(number, window.intlTelInputUtils.numberFormat.INTERNATIONAL)
      : number;
  }

  notifyPhoneNumberChange(newNumber) {
    if (typeof this.props.onPhoneNumberChange === 'function') {
      const fullNumber = this.formatFullNumber(newNumber);
      const isValid = this.isValidNumber(fullNumber);

      this.props.onPhoneNumberChange(
        isValid, newNumber, this.selectedCountryData,
        fullNumber, this.getExtension(newNumber));
    }
  }

  // remove the dial code if separateDialCode is enabled
  beforeSetNumber(number) {
    if (this.props.separateDialCode) {
      let dialCode = this.getDialCode(number);

      if (dialCode) {
        // US dialCode is "+1", which is what we want
        // CA dialCode is "+1 123", which is wrong - should be "+1"
        // (as it has multiple area codes)
        // AS dialCode is "+1 684", which is what we want
        // Solution: if the country has area codes, then revert to just the dial code
        if (this.selectedCountryData.areaCodes !== null) {
          dialCode = `+${this.selectedCountryData.dialCode}`;
        }
        // a lot of numbers will have a space separating the dial code
        // and the main number, and some NANP numbers will have a hyphen
        // e.g. +1 684-733-1234 - in both cases we want to get rid of it
        // NOTE: don't just trim all non-numerics as may want to preserve
        // an open parenthesis etc
        const start = number[dialCode.length] === ' ' ||
          number[dialCode.length] === '-' ? dialCode.length + 1 : dialCode.length;

        number = number.substr(start);
      }
    }

    return this.cap(number);
  }

  handleWindowScroll() {
    this.setState({
      showDropdown: false,
    }, () => {
      window.removeEventListener('scroll', this.handleWindowScroll);
    });
  }

  handleDocumentKeyDown(e) {
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
        showDropdown: false,
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
  }

  handleDocumentClick(e) {
    // Click at the outside of country list
    if (e.target.getAttribute('class') === null ||
      (e.target.getAttribute('class') &&
       e.target.getAttribute('class').indexOf('country') === -1)) {
      this.isOpening = false;
    }

    if (!this.isOpening) {
      this.toggleDropdown(false);
    }
    this.isOpening = false;
  }

  // Either notify phoneNumber changed if component is controlled
  // or udpate the state and notify change if component is uncontrolled
  handleInputChange(e) {
    const value = this.props.format ? this.formatNumber(e.target.value) : e.target.value;

    if (this.props.value !== undefined) {
      this.updateFlagFromNumber(value);
      this.notifyPhoneNumberChange(value);
    } else {
      this.setState({
        value,
      }, () => {
        this.updateFlagFromNumber(value);
        this.notifyPhoneNumberChange(value);
      });
    }
  }

  changeHighlightCountry(showDropdown, selectedIndex) {
    this.setState({
      showDropdown,
      highlightedCountry: selectedIndex,
    });
  }

  loadUtils() {
    if (window.intlTelInputUtils) {
      this.utilsScriptDeferred.resolve();

      return;
    }

    const request = new XMLHttpRequest();

    request.open('GET', this.props.utilsScript, true);

    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        const data = request.responseText;

        if (data && !document.getElementById('intlTelInputUtils')) {
          const oBody = document.getElementsByTagName('body')[0];
          const oScript = document.createElement('script');

          oScript.id = 'intlTelInputUtils';
          oScript.text = data;
          oBody.appendChild(oScript);
        }

        this.utilsScriptDeferred.resolve();
      }
    };

    request.send();
  }

  // this is called when the geoip call returns
  autoCountryLoaded() {
    if (this.tempCountry === 'auto') {
      this.tempCountry = this.autoCountry;
      this.autoCountryDeferred.resolve();
    }
  }

  render() {
    this.wrapperClass[this.props.css[0]] = true;
    const inputClass = this.props.css[1];
    const wrapperStyle = Object.assign({}, this.props.style || {});

    if (this.state.showDropdown) {
      this.wrapperClass.expanded = true;
    }

    const wrapperClass = classNames(this.wrapperClass);

    const titleTip = (this.selectedCountryData) ?
      `${this.selectedCountryData.name}: +${this.selectedCountryData.dialCode}` : 'Unknown';

    const value = this.props.value !== undefined ? this.props.value : this.state.value;

    return (
      <div className={ wrapperClass } style={ wrapperStyle }>
        <FlagDropDown
          refCallback={ this.setFlagDropdownRef }
          allowDropdown={ this.allowDropdown }
          dropdownContainer={ this.dropdownContainer }
          separateDialCode={ this.props.separateDialCode }
          dialCode={ this.state.dialCode }
          clickSelectedFlag={ this.clickSelectedFlag }
          setFlag={ this.setFlag }
          countryCode={ this.state.countryCode }
          isMobile={ this.isMobile }
          handleSelectedFlagKeydown={ this.handleSelectedFlagKeydown }
          changeHighlightCountry={ this.changeHighlightCountry }
          countries={ this.countries }
          showDropdown={ this.state.showDropdown }
          inputTop={ this.state.offsetTop }
          inputOuterHeight={ this.state.outerHeight }
          preferredCountries={ this.preferredCountries }
          highlightedCountry={ this.state.highlightedCountry }
          titleTip={ titleTip }
        />
        <TelInput
          refCallback={ this.setTelRef }
          handleInputChange={ this.handleInputChange }
          handleOnBlur={ this.handleOnBlur }
          className={ inputClass }
          disabled={ this.state.disabled }
          readonly={ this.state.readonly }
          fieldName={ this.props.fieldName }
          fieldId={ this.props.fieldId }
          value={ value }
          placeholder={ this.state.placeholder }
          autoFocus={ this.props.autoFocus }
          autoComplete={ this.props.autoComplete }
          inputProps={ this.props.telInputProps }
        />
      </div>
    );
  }
}

IntlTelInputApp.propTypes = {
  css: PropTypes.arrayOf(PropTypes.string),
  fieldName: PropTypes.string,
  fieldId: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  countriesData: PropTypes.arrayOf(PropTypes.array),
  allowDropdown: PropTypes.bool,
  autoHideDialCode: PropTypes.bool,
  autoPlaceholder: PropTypes.bool,
  customPlaceholder: PropTypes.func,
  excludeCountries: PropTypes.arrayOf(PropTypes.string),
  formatOnInit: PropTypes.bool,
  separateDialCode: PropTypes.bool,
  defaultCountry: PropTypes.string,
  geoIpLookup: PropTypes.func,
  nationalMode: PropTypes.bool,
  numberType: PropTypes.string,
  noCountryDataHandler: PropTypes.func,
  onlyCountries: PropTypes.arrayOf(PropTypes.string),
  preferredCountries: PropTypes.arrayOf(PropTypes.string),
  utilsScript: PropTypes.string,
  onPhoneNumberChange: PropTypes.func,
  onPhoneNumberBlur: PropTypes.func,
  onSelectFlag: PropTypes.func,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  autoComplete: PropTypes.string,
  style: StylePropTypes,
  useMobileFullscreenDropdown: PropTypes.bool,
  telInputProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  format: PropTypes.bool,
};

IntlTelInputApp.defaultProps = {
  css: ['intl-tel-input', ''],
  fieldName: '',
  fieldId: '',
  defaultValue: '',
  // define the countries that'll be present in the dropdown
  // defaults to the data defined in `AllCountries`
  countriesData: null,
  // whether or not to allow the dropdown
  allowDropdown: true,
  // if there is just a dial code in the input: remove it on blur, and re-add it on focus
  autoHideDialCode: true,
  // add or remove input placeholder with an example number for the selected country
  autoPlaceholder: true,
  // modify the auto placeholder
  customPlaceholder: null,
  // don't display these countries
  excludeCountries: [],
  // format the input value during initialisation
  formatOnInit: true,
  // display the country dial code next to the selected flag so it's not part of the typed number
  separateDialCode: false,
  // default country
  defaultCountry: '',
  // geoIp lookup function
  geoIpLookup: null,
  // don't insert international dial codes
  nationalMode: true,
  // number type to use for placeholders
  numberType: 'MOBILE',
  // function which can catch the "no this default country" exception
  noCountryDataHandler: null,
  // display only these countries
  onlyCountries: [],
  // the countries at the top of the list. defaults to united states and united kingdom
  preferredCountries: ['us', 'gb'],
  // specify the path to the libphonenumber script to enable validation/formatting
  utilsScript: '',
  onPhoneNumberChange: null,
  onPhoneNumberBlur: null,
  onSelectFlag: null,
  disabled: false,
  autoFocus: false,
  // whether to use fullscreen flag dropdown for mobile useragents
  useMobileFullscreenDropdown: true,
  autoComplete: 'off',
  // pass through arbitrary props to the tel input element
  telInputProps: {},
  // always format the number
  format: false,
};

export default IntlTelInputApp;
