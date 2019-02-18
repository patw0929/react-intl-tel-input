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

const mobileUserAgentRegexp = /Android.+Mobile|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

class IntlTelInput extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = null;

    if (
      typeof nextProps.value !== 'undefined' &&
      prevState.value !== nextProps.value
    ) {
      newState = {
        value: nextProps.value,
      };
    }

    if (prevState.disabled !== nextProps.disabled) {
      newState = {
        disabled: nextProps.disabled,
      };
    }

    return newState;
  }

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
    this.isMobile =
      typeof navigator !== 'undefined' &&
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
    this.selectedCountryData = {};

    this.state = {
      showDropdown: false,
      highlightedCountry: 0,
      value: props.value || props.defaultValue,
      disabled: props.disabled,
      readonly: false,
      offsetTop: 0,
      outerHeight: 0,
      placeholder: '',
      title: '', // eslint-disable-line react/no-unused-state
      countryCode: 'us',
      dialCode: '',
      cursorPosition: (props.value || props.defaultValue).length,
    };
  }

  componentDidMount() {
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

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.showDropdown) {
      document.addEventListener('keydown', this.handleDocumentKeyDown);
      this.bindDocumentClick();
    } else {
      document.removeEventListener('keydown', this.handleDocumentKeyDown);
      this.unbindDocumentClick();
    }

    return true;
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.updateFlagFromNumber(this.props.value);
    }

    if (
      typeof this.props.customPlaceholder === 'function' &&
      prevProps.customPlaceholder !== this.props.customPlaceholder
    ) {
      this.updatePlaceholder(this.props);
    }

    if (this.props.allowDropdown !== prevProps.allowDropdown) {
      this.allowDropdown = this.props.allowDropdown;
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
    window.removeEventListener('scroll', this.handleWindowScroll);
    this.unbindDocumentClick();
  }

  getTempCountry = countryCode => {
    if (countryCode === 'auto') {
      return 'auto';
    }

    let countryData = utils.getCountryData(this.countries, countryCode);

    // check if country is available in the list
    if (!countryData.iso2) {
      if (this.props.preferredCountries.length > 0) {
        countryData = utils.getCountryData(
          this.countries,
          this.props.preferredCountries[0]
        );
      } else {
        countryData = AllCountries.getCountries()[0];
      }
    }

    return countryData.iso2;
  };

  // set the input value and update the flag
  // NOTE: preventFormat arg is for public method
  setNumber = (number, preventFormat) => {
    // we must update the flag first, which updates this.selectedCountryData,
    // which is used for formatting the number before displaying it
    this.updateFlagFromNumber(number);
    this.updateValFromNumber(number, !preventFormat);
  };

  setFlagDropdownRef = ref => {
    this.flagDropDown = ref;
  };

  setTelRef = ref => {
    this.tel = ref;
  };

  // select the given flag, update the placeholder and the active list item
  // Note: called from setInitialState, updateFlagFromNumber, selectListItem, setCountry
  setFlag = (countryCode, isInit) => {
    const prevCountry =
      this.selectedCountryData && this.selectedCountryData.iso2
        ? this.selectedCountryData
        : {};

    // do this first as it will throw an error and stop if countryCode is invalid
    this.selectedCountryData = countryCode
      ? utils.getCountryData(
        this.countries,
        countryCode,
        false,
        false,
        this.props.noCountryDataHandler
      )
      : {};

    // update the defaultCountry - we only need the iso2 from now on, so just store that
    if (this.selectedCountryData.iso2) {
      this.defaultCountry = this.selectedCountryData.iso2;
    }

    // update the selected country's title attribute
    const title = countryCode
      ? `${this.selectedCountryData.name}: +${
        this.selectedCountryData.dialCode
      }`
      : 'Unknown';

    let dialCode = this.state.dialCode; // eslint-disable-line react/no-access-state-in-setstate

    if (this.props.separateDialCode) {
      dialCode = this.selectedCountryData.dialCode
        ? `+${this.selectedCountryData.dialCode}`
        : '';

      if (prevCountry.dialCode) {
        delete this.wrapperClass[`iti-sdc-${prevCountry.dialCode.length + 1}`];
      }

      if (dialCode) {
        this.wrapperClass[`iti-sdc-${dialCode.length}`] = true;
      }
    }

    let selectedIndex = 0;

    if (countryCode && countryCode !== 'auto') {
      selectedIndex = utils.findIndex(
        this.preferredCountries,
        country => country.iso2 === countryCode
      );

      if (selectedIndex === -1) {
        selectedIndex = utils.findIndex(
          this.countries,
          country => country.iso2 === countryCode
        );
        if (selectedIndex === -1) selectedIndex = 0;
        selectedIndex += this.preferredCountries.length;
      }
    }

    if (this.tel && this.state.showDropdown) {
      this.tel.focus();
    }

    const newNumber = this.updateDialCode(
      this.selectedCountryData.dialCode,
      !isInit
    );

    this.setState(
      {
        value: newNumber,
        showDropdown: false,
        highlightedCountry: selectedIndex,
        countryCode,
        title, // eslint-disable-line react/no-unused-state
        dialCode,
      },
      () => {
        // and the input's placeholder
        this.updatePlaceholder(this.props);

        // update the active list item
        this.wrapperClass.active = false;

        // on change flag, trigger a custom event
        // Allow Main app to do things when a country is selected
        if (
          !isInit &&
          prevCountry.iso2 !== countryCode &&
          typeof this.props.onSelectFlag === 'function'
        ) {
          const currentNumber = this.state.value;

          const fullNumber = this.formatFullNumber(currentNumber);
          const isValid = this.isValidNumber(fullNumber);

          this.props.onSelectFlag(
            currentNumber,
            this.selectedCountryData,
            fullNumber,
            isValid
          );
        }
      }
    );
  };

  // get the extension from the current number
  getExtension = number => {
    if (window.intlTelInputUtils) {
      return window.intlTelInputUtils.getExtension(
        this.getFullNumber(number),
        this.selectedCountryData.iso2
      );
    }

    return '';
  };

  // format the number to the given format
  getNumber = (number, format) => {
    if (window.intlTelInputUtils) {
      return window.intlTelInputUtils.formatNumber(
        this.getFullNumber(number),
        this.selectedCountryData.iso2,
        format
      );
    }

    return '';
  };

  // get the input val, adding the dial code if separateDialCode is enabled
  getFullNumber = number => {
    const prefix = this.props.separateDialCode
      ? `+${this.selectedCountryData.dialCode}`
      : '';

    return prefix + number;
  };

  // try and extract a valid international dial code from a full telephone number
  // Note: returns the raw string inc plus character and any whitespace/dots etc
  getDialCode = number => {
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
  };

  // check if the given number contains an unknown area code from
  // the North American Numbering Plan i.e. the only dialCode that
  // could be extracted was +1 but the actual number's length is >=4
  isUnknownNanp = (number, dialCode) => {
    return dialCode === '+1' && utils.getNumeric(number).length >= 4;
  };

  // add a country code to countryCodes
  addCountryCode = (countryCodes, iso2, dialCode, priority) => {
    if (!(dialCode in countryCodes)) {
      countryCodes[dialCode] = [];
    }

    const index = priority || 0;

    countryCodes[dialCode][index] = iso2;

    return countryCodes;
  };

  processAllCountries = () => {
    if (this.props.onlyCountries.length) {
      // process onlyCountries option
      this.filterCountries(
        this.props.onlyCountries,
        inArray =>
          // if country is in array
          inArray !== -1
      );
    } else if (this.props.excludeCountries.length) {
      // process excludeCountries option
      this.filterCountries(
        this.props.excludeCountries,
        inArray =>
          // if country is not in array
          inArray === -1
      );
    } else {
      this.countries = AllCountries.getCountries();
    }
  };

  // process the countryCodes map
  processCountryCodes = () => {
    this.countryCodes = {};
    for (let i = 0; i < this.countries.length; i++) {
      const c = this.countries[i];

      this.addCountryCode(this.countryCodes, c.iso2, c.dialCode, c.priority);
      // area codes
      if (c.areaCodes) {
        for (let j = 0; j < c.areaCodes.length; j++) {
          // full dial code is country code + dial code
          this.addCountryCode(
            this.countryCodes,
            c.iso2,
            c.dialCode + c.areaCodes[j]
          );
        }
      }
    }
  };

  // process preferred countries - iterate through the preferences,
  // fetching the country data for each one
  processPreferredCountries = () => {
    this.preferredCountries = [];
    for (let i = 0, max = this.props.preferredCountries.length; i < max; i++) {
      const countryCode = this.props.preferredCountries[i].toLowerCase();
      const countryData = utils.getCountryData(
        this.countries,
        countryCode,
        true
      );

      if (countryData) {
        this.preferredCountries.push(countryData);
      }
    }
  };

  // set the initial state of the input value and the selected flag
  setInitialState = () => {
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
        this.defaultCountry = this.preferredCountries.length
          ? this.preferredCountries[0].iso2
          : this.countries[0].iso2;
        if (!val) {
          this.setFlag(this.defaultCountry, true);
        }
      }
      // if empty and no nationalMode and no autoHideDialCode then insert the default dial code
      if (
        !val &&
        !this.nationalMode &&
        !this.autoHideDialCode &&
        !this.props.separateDialCode
      ) {
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
  };

  initRequests = () => {
    import('libphonenumber-js-utils')
      .then(() => {
        this.loadUtils();
        this.utilsScriptDeferred.resolve();
      })
      .catch(() => 'An error occurred while loading the component');

    if (this.tempCountry === 'auto') {
      this.loadAutoCountry();
    } else {
      this.autoCountryDeferred.resolve();
    }
  };

  loadAutoCountry = () => {
    // check for localStorage
    const lsAutoCountry =
      window.localStorage !== undefined
        ? window.localStorage.getItem('itiAutoCountry')
        : '';

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
        this.props.geoIpLookup(countryCode => {
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
  };

  cap = number => {
    const max = this.tel ? this.tel.getAttribute('maxlength') : number;

    return max && number.length > max ? number.substr(0, max) : number;
  };

  removeEmptyDialCode = () => {
    const allowEmptyDialCode = this.props.allowEmptyDialCode;
    
    if (!allowEmptyDialCode) {
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
  };

  // highlight the next/prev item in the list (and ensure it is visible)
  handleUpDownKey = key => {
    const current = this.flagDropDown.querySelectorAll('.highlight')[0];
    const prevElement = current ? current.previousElementSibling : undefined;
    const nextElement = current ? current.nextElementSibling : undefined;
    let next = key === this.keys.UP ? prevElement : nextElement;

    if (next) {
      // skip the divider
      if (next.getAttribute('class').indexOf('divider') > -1) {
        next =
          key === this.keys.UP
            ? next.previousElementSibling
            : next.nextElementSibling;
      }

      this.scrollTo(next);

      const selectedIndex = utils.retrieveLiIndex(next);

      this.setState({
        showDropdown: true,
        highlightedCountry: selectedIndex,
      });
    }
  };

  // select the currently highlighted item
  handleEnterKey = () => {
    const current = this.flagDropDown.querySelectorAll('.highlight')[0];

    if (current) {
      const selectedIndex = utils.retrieveLiIndex(current);
      const countryCode = current.getAttribute('data-country-code');

      this.setState(
        {
          showDropdown: false,
          highlightedCountry: selectedIndex,
          countryCode,
        },
        () => {
          this.setFlag(this.state.countryCode);
          this.unbindDocumentClick();
        }
      );
    }
  };

  // find the first list item whose name starts with the query string
  searchForCountry = query => {
    for (let i = 0, max = this.countries.length; i < max; i++) {
      if (utils.startsWith(this.countries[i].name, query)) {
        const listItem = this.flagDropDown.querySelector(
          `.country-list [data-country-code="${
            this.countries[i].iso2
          }"]:not(.preferred)`
        );

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
  };

  formatNumber = number => {
    if (window.intlTelInputUtils && this.selectedCountryData) {
      let format = window.intlTelInputUtils.numberFormat.INTERNATIONAL;

      if (
        /* eslint-disable no-mixed-operators */
        (!this.props.separateDialCode && this.nationalMode) ||
        number.charAt(0) !== '+'
        /* eslint-enable no-mixed-operators */
      ) {
        format = window.intlTelInputUtils.numberFormat.NATIONAL;
      }

      number = window.intlTelInputUtils.formatNumber(
        number,
        this.selectedCountryData.iso2,
        format
      );
    }

    return number;
  };

  // update the input's value to the given val (format first if possible)
  // if doNotify is true, calls notifyPhoneNumberChange with the formatted value
  // NOTE: this is called from _setInitialState, handleUtils and setNumber
  updateValFromNumber = (number, doFormat, doNotify = false) => {
    if (doFormat && window.intlTelInputUtils && this.selectedCountryData) {
      const format =
        !this.props.separateDialCode &&
        (this.nationalMode || number.charAt(0) !== '+')
          ? window.intlTelInputUtils.numberFormat.NATIONAL
          : window.intlTelInputUtils.numberFormat.INTERNATIONAL;

      number = window.intlTelInputUtils.formatNumber(
        number,
        this.selectedCountryData.iso2,
        format
      );
    }

    number = this.beforeSetNumber(number);

    this.setState(
      {
        showDropdown: false,
        value: number,
      },
      () => {
        if (doNotify) {
          this.notifyPhoneNumberChange(this.state.value);
        }

        this.unbindDocumentClick();
      }
    );
  };

  // check if need to select a new flag based on the given number
  // Note: called from _setInitialState, keyup handler, setNumber
  updateFlagFromNumber = (number, isInit) => {
    // if we're in nationalMode and we already have US/Canada selected,
    // make sure the number starts with a +1 so getDialCode will be
    // able to extract the area code
    // update: if we dont yet have selectedCountryData,
    // but we're here (trying to update the flag from the number),
    // that means we're initialising the plugin with a number that already
    // has a dial code, so fine to ignore this bit
    if (
      number &&
      this.nationalMode &&
      this.selectedCountryData &&
      this.selectedCountryData.dialCode === '1' &&
      number.charAt(0) !== '+'
    ) {
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
      const alreadySelected =
        this.selectedCountryData &&
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
      countryCode = null;
    }

    if (countryCode !== null) {
      this.setFlag(countryCode, isInit);
    }
  };

  // filter the given countries using the process function
  filterCountries = (countryArray, processFunc) => {
    let i;

    // standardise case
    for (i = 0; i < countryArray.length; i++) {
      countryArray[i] = countryArray[i].toLowerCase();
    }

    // build instance country array
    this.countries = [];
    for (i = 0; i < AllCountries.getCountries().length; i++) {
      if (
        processFunc(countryArray.indexOf(AllCountries.getCountries()[i].iso2))
      ) {
        this.countries.push(AllCountries.getCountries()[i]);
      }
    }
  };

  // prepare all of the country data, including onlyCountries and preferredCountries options
  processCountryData = () => {
    // format countries data to what is necessary for component function
    // defaults to data defined in `AllCountries`
    AllCountries.initialize(this.props.countriesData);

    // process onlyCountries or excludeCountries array if present
    this.processAllCountries.call(this);

    // process the countryCodes map
    this.processCountryCodes.call(this);

    // set the preferredCountries property
    this.processPreferredCountries.call(this);
  };

  handleOnBlur = e => {
    this.removeEmptyDialCode();
    if (typeof this.props.onPhoneNumberBlur === 'function') {
      const value = this.state.value;
      const fullNumber = this.formatFullNumber(value);
      const isValid = this.isValidNumber(fullNumber);

      this.props.onPhoneNumberBlur(
        isValid,
        value,
        this.selectedCountryData,
        fullNumber,
        this.getExtension(value),
        e
      );
    }
  };

  bindDocumentClick = () => {
    this.isOpening = true;
    document
      .querySelector('html')
      .addEventListener('click', this.handleDocumentClick);
  };

  unbindDocumentClick = () => {
    document
      .querySelector('html')
      .removeEventListener('click', this.handleDocumentClick);
  };

  clickSelectedFlag = e => {
    const { allowDropdown, onFlagClick } = this.props;
    const { showDropdown, disabled, readonly } = this.state;

    if (!showDropdown && !disabled && !readonly && allowDropdown) {
      this.setState(
        {
          showDropdown: true,
          offsetTop: utils.offset(this.tel).top,
          outerHeight: utils.getOuterHeight(this.tel),
        },
        () => {
          const highlightItem = this.flagDropDown.querySelector('.highlight');

          if (highlightItem) {
            this.scrollTo(highlightItem, true);
          }
        }
      );
    } else if (showDropdown) {
      // need to hide dropdown when click on opened flag button
      this.toggleDropdown(false);
    }
    // Allow main app to do things when flag icon is clicked
    if (typeof onFlagClick === 'function') {
      onFlagClick(e);
    }
  };

  // update the input placeholder to an
  // example number from the currently selected country
  updatePlaceholder = (props = this.props) => {
    if (
      window.intlTelInputUtils &&
      props.autoPlaceholder &&
      this.selectedCountryData
    ) {
      const numberType = window.intlTelInputUtils.numberType[props.numberType];
      let placeholder = this.selectedCountryData.iso2
        ? window.intlTelInputUtils.getExampleNumber(
          this.selectedCountryData.iso2,
          this.nationalMode,
          numberType
        )
        : '';

      placeholder = this.beforeSetNumber(placeholder, props);

      if (typeof props.customPlaceholder === 'function') {
        placeholder = props.customPlaceholder(
          placeholder,
          this.selectedCountryData
        );
      }

      this.setState({
        placeholder,
      });
    }
  };

  toggleDropdown = status => {
    this.setState(
      {
        showDropdown: !!status,
      },
      () => {
        if (!this.state.showDropdown) {
          this.unbindDocumentClick();
        }
      }
    );
  };

  // check if an element is visible within it's container, else scroll until it is
  scrollTo = (element, middle) => {
    try {
      const container = this.flagDropDown.querySelector('.country-list');
      const containerHeight = parseFloat(
        window.getComputedStyle(container).getPropertyValue('height')
      );
      const containerTop = utils.offset(container).top;
      const containerBottom = containerTop + containerHeight;
      const elementHeight = utils.getOuterHeight(element);
      const elementTop = utils.offset(element).top;
      const elementBottom = elementTop + elementHeight;
      const middleOffset = containerHeight / 2 - elementHeight / 2;
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
  };

  // replace any existing dial code with the new one
  // Note: called from _setFlag
  updateDialCode = (newDialCode, hasSelectedListItem) => {
    const currentNumber = this.state.value;

    if (!newDialCode) {
      return currentNumber;
    }
    let newNumber = currentNumber;

    // save having to pass this every time
    newDialCode = `+${newDialCode}`;

    if (currentNumber.charAt(0) === '+') {
      // there's a plus so we're dealing with a replacement (doesn't matter if nationalMode or not)
      const prevDialCode = this.getDialCode(currentNumber);

      if (prevDialCode) {
        // current number contains a valid dial code, so replace it
        newNumber = currentNumber.replace(prevDialCode, newDialCode);
      } else {
        // current number contains an invalid dial code, so ditch it
        // (no way to determine where the invalid dial code ends and the rest of the number begins)
        newNumber = newDialCode;
      }
    } else if (this.nationalMode || this.props.separateDialCode) {
      // don't do anything
    } else if (currentNumber) {
      // nationalMode is disabled
      // there is an existing value with no dial code: prefix the new dial code
      newNumber = newDialCode + currentNumber;
    } else if (hasSelectedListItem || !this.autoHideDialCode) {
      // no existing value and either they've just selected a list item, or autoHideDialCode is disabled: insert new dial code
      newNumber = newDialCode;
    }

    if (newNumber !== currentNumber) {
      this.notifyPhoneNumberChange(newNumber);
    }

    return newNumber;
  };

  generateMarkup = () => {
    this.wrapperClass['separate-dial-code'] = this.props.separateDialCode;

    if (this.isMobile && this.props.useMobileFullscreenDropdown) {
      utils.addClass(document.querySelector('body'), 'iti-mobile');
      // on mobile, we want a full screen dropdown, so we must append it to the body
      this.dropdownContainer = 'body';
      window.addEventListener('scroll', this.handleWindowScroll);
    }
  };

  handleSelectedFlagKeydown = e => {
    if (
      !this.state.showDropdown &&
      (e.which === this.keys.UP ||
        e.which === this.keys.DOWN ||
        e.which === this.keys.SPACE ||
        e.which === this.keys.ENTER)
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
  };

  // validate the input val - assumes the global function isValidNumber (from libphonenumber)
  isValidNumber = number => {
    const val = utils.trim(number);
    const countryCode =
      this.nationalMode || this.props.separateDialCode
        ? this.selectedCountryData.iso2
        : '';

    if (window.intlTelInputUtils) {
      return window.intlTelInputUtils.isValidNumber(val, countryCode);
    }

    return false;
  };

  formatFullNumber = number => {
    return window.intlTelInputUtils
      ? this.getNumber(
        number,
        window.intlTelInputUtils.numberFormat.INTERNATIONAL
      )
      : number;
  };

  notifyPhoneNumberChange = newNumber => {
    if (typeof this.props.onPhoneNumberChange === 'function') {
      const fullNumber = this.formatFullNumber(newNumber);
      const isValid = this.isValidNumber(fullNumber);

      this.props.onPhoneNumberChange(
        isValid,
        newNumber,
        this.selectedCountryData,
        fullNumber,
        this.getExtension(newNumber)
      );
    }
  };

  // remove the dial code if separateDialCode is enabled
  beforeSetNumber = (number, props = this.props) => {
    if (props.separateDialCode) {
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
        const start =
          number[dialCode.length] === ' ' || number[dialCode.length] === '-'
            ? dialCode.length + 1
            : dialCode.length;

        number = number.substr(start);
      }
    }

    return this.cap(number);
  };

  handleWindowScroll = () => {
    this.setState(
      {
        showDropdown: false,
      },
      () => {
        window.removeEventListener('scroll', this.handleWindowScroll);
      }
    );
  };

  handleDocumentKeyDown = e => {
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
    } else if (
      (e.which >= this.keys.A && e.which <= this.keys.Z) ||
      e.which === this.keys.SPACE
    ) {
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
  };

  handleDocumentClick = e => {
    // Click at the outside of country list
    // and outside of flag button
    const targetClass = e.target.getAttribute('class');

    if (
      targetClass === null ||
      (targetClass &&
        targetClass.indexOf('country') === -1 &&
        targetClass.indexOf('selected-flag') === -1 &&
        targetClass.indexOf('iti-flag') === -1 &&
        targetClass.indexOf('iti-arrow') === -1)
    ) {
      this.isOpening = false;
    }

    if (!this.isOpening) {
      this.toggleDropdown(false);
    }
    this.isOpening = false;
  };

  // Either notify phoneNumber changed if component is controlled
  // or udpate the state and notify change if component is uncontrolled
  handleInputChange = e => {
    let cursorPosition = e.target.selectionStart;
    const previousValue = e.target.value;
    const previousStringBeforeCursor =
      previousValue === ''
        ? previousValue
        : previousValue.substring(0, cursorPosition);
    const value = this.props.format
      ? this.formatNumber(e.target.value)
      : e.target.value;

    cursorPosition = utils.getCursorPositionAfterFormating(
      previousStringBeforeCursor,
      previousValue,
      value
    );

    if (this.props.value !== undefined) {
      this.setState(
        {
          cursorPosition,
        },
        () => {
          this.updateFlagFromNumber(value);
          this.notifyPhoneNumberChange(value);
        }
      );
    } else {
      this.setState(
        {
          value,
          cursorPosition,
        },
        () => {
          this.updateFlagFromNumber(value);
          this.notifyPhoneNumberChange(value);
        }
      );
    }
  };

  handlePaste = e => {
    if (e.clipboardData) {
      this.updateFlagFromNumber(e.clipboardData.getData('Text'), false);
    }
  };

  changeHighlightCountry = (showDropdown, selectedIndex) => {
    this.setState({
      showDropdown,
      highlightedCountry: selectedIndex,
    });
  };

  loadUtils = () => {
    if (window.intlTelInputUtils) {
      this.utilsScriptDeferred.resolve();
    }
  };

  // this is called when the geoip call returns
  autoCountryLoaded = () => {
    if (this.tempCountry === 'auto') {
      this.tempCountry = this.autoCountry;
      this.autoCountryDeferred.resolve();
    }
  };

  render() {
    this.wrapperClass[this.props.containerClassName] = true;
    const inputClass = this.props.inputClassName;
    const wrapperStyle = Object.assign({}, this.props.style || {});

    this.wrapperClass['allow-dropdown'] = this.allowDropdown;
    this.wrapperClass.expanded = this.state.showDropdown;

    const wrapperClass = classNames(this.wrapperClass);

    const titleTip = this.selectedCountryData
      ? `${this.selectedCountryData.name}: +${
        this.selectedCountryData.dialCode
      }`
      : 'Unknown';

    const value =
      this.props.value !== undefined ? this.props.value : this.state.value;

    return (
      <div className={wrapperClass} style={wrapperStyle}>
        <FlagDropDown
          refCallback={this.setFlagDropdownRef}
          allowDropdown={this.allowDropdown}
          dropdownContainer={this.dropdownContainer}
          separateDialCode={this.props.separateDialCode}
          dialCode={this.state.dialCode}
          clickSelectedFlag={this.clickSelectedFlag}
          setFlag={this.setFlag}
          countryCode={this.state.countryCode}
          isMobile={this.isMobile}
          handleSelectedFlagKeydown={this.handleSelectedFlagKeydown}
          changeHighlightCountry={this.changeHighlightCountry}
          countries={this.countries}
          showDropdown={this.state.showDropdown}
          inputTop={this.state.offsetTop}
          inputOuterHeight={this.state.outerHeight}
          preferredCountries={this.preferredCountries}
          highlightedCountry={this.state.highlightedCountry}
          titleTip={titleTip}
        />
        <TelInput
          refCallback={this.setTelRef}
          handleInputChange={this.handleInputChange}
          handleOnBlur={this.handleOnBlur}
          handlePaste={this.handlePaste}
          className={inputClass}
          disabled={this.state.disabled}
          readonly={this.state.readonly}
          fieldName={this.props.fieldName}
          fieldId={this.props.fieldId}
          value={value}
          placeholder={
            this.props.placeholder !== undefined
              ? this.props.placeholder
              : this.state.placeholder
          }
          autoFocus={this.props.autoFocus}
          autoComplete={this.props.autoComplete}
          inputProps={this.props.telInputProps}
          cursorPosition={this.state.cursorPosition}
        />
      </div>
    );
  }
}

IntlTelInput.propTypes = {
  /** Container CSS class name. */
  containerClassName: PropTypes.string,
  /** Text input CSS class name. */
  inputClassName: PropTypes.string,
  /** It's used as `input` field `name` attribute. */
  fieldName: PropTypes.string,
  /** It's used as `input` field `id` attribute. */
  fieldId: PropTypes.string,
  /** The value of the input field. Useful for making input value controlled from outside the component. */
  value: PropTypes.string,
  /** The value used to initialize input. This will only work on uncontrolled component. */
  defaultValue: PropTypes.string,
  /** Countries data can be configured, it defaults to data defined in `AllCountries`. */
  countriesData: PropTypes.arrayOf(PropTypes.array),
  /**
   * Whether or not to allow the dropdown. If disabled, there is no dropdown arrow, and the selected flag is not clickable.
   * Also we display the selected flag on the right instead because it is just a marker of state.
   */
  allowDropdown: PropTypes.bool,
  /** If there is just a dial code in the input: remove it on blur, and re-add it on focus. */
  autoHideDialCode: PropTypes.bool,
  /** Add or remove input placeholder with an example number for the selected country. */
  autoPlaceholder: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  /** Change the placeholder generated by autoPlaceholder. Must return a string. */
  customPlaceholder: PropTypes.func,
  /** Don't display the countries you specify. (Array) */
  excludeCountries: PropTypes.arrayOf(PropTypes.string),
  /** Format the input value during initialisation. */
  formatOnInit: PropTypes.bool,
  /** Display the country dial code next to the selected flag so it's not part of the typed number.
   * Note that this will disable nationalMode because technically we are dealing with international numbers,
   * but with the dial code separated.
   * */
  separateDialCode: PropTypes.bool,
  /** Default country. */
  defaultCountry: PropTypes.string,
  /** GeoIp lookup function. */
  geoIpLookup: PropTypes.func,
  /** Don't insert international dial codes. */
  nationalMode: PropTypes.bool,
  /** Number type to use for placeholders. */
  numberType: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  /** The function which can catch the "no this default country" exception. */
  noCountryDataHandler: PropTypes.func,
  /** Display only these countries. */
  onlyCountries: PropTypes.arrayOf(PropTypes.string),
  /** The countries at the top of the list. defaults to United States and United Kingdom. */
  preferredCountries: PropTypes.arrayOf(PropTypes.string),
  /** Optional validation callback function. It returns validation status, input box value and selected country data. */
  onPhoneNumberChange: PropTypes.func,
  /** Optional validation callback function. It returns validation status, input box value and selected country data. */
  onPhoneNumberBlur: PropTypes.func,
  /** Allow main app to do things when a country is selected. */
  onSelectFlag: PropTypes.func,
  /** Disable this component. */
  disabled: PropTypes.bool,
  /** Static placeholder for input controller. When defined it takes priority over autoPlaceholder. */
  placeholder: PropTypes.string,
  /** Enable auto focus */
  autoFocus: PropTypes.bool,
  /**
   * Set the value of the autoComplete attribute on the input. For example, set it to phone to tell the browser where to auto complete phone numbers.
   */
  autoComplete: PropTypes.string,
  /** Style object for the wrapper div. Useful for setting 100% width on the wrapper, etc. */
  style: StylePropTypes,
  /** Render fullscreen flag dropdown when mobile useragent is detected. The dropdown element is rendered as a direct child of document.body */
  useMobileFullscreenDropdown: PropTypes.bool,
  /** Pass through arbitrary props to the tel input element. */
  telInputProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  /** Format the number. */
  format: PropTypes.bool,
  /** Allow main app to do things when flag icon is clicked. */
  onFlagClick: PropTypes.func,
  /** Allow empty dial code. */
  allowEmptyDialCode: PropTypes.bool,
};

IntlTelInput.defaultProps = {
  containerClassName: 'intl-tel-input',
  inputClassName: '',
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
  onFlagClick: null,
  allowEmptyDialCode: false,
};

export default IntlTelInput;
