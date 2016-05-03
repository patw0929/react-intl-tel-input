import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import AllCountries from '../components/AllCountries';
import FlagDropDown from '../components/FlagDropDown';
import TelInput from '../components/TelInput';
import utils from '../components/utils';
import _ from 'underscore.deferred';
import '../styles/intlTelInput.scss';

export default class IntlTelInputApp extends Component {
  static defaultProps = {
    css: ['intl-tel-input', ''],
    fieldName: '',
    fieldId: '',
    value: '',
    // define the countries that'll be present in the dropdown
    // defaults to the data defined in `AllCountries`
    countriesData: null,
    // typing digits after a valid number will be added to the extension part of the number
    allowExtensions: false,
    // automatically format the number according to the selected country
    autoFormat: true,
    // add or remove input placeholder with an example number for the selected country
    autoPlaceholder: true,
    // allow placeholder number suggestion to be processed before it is set in the field
    preprocessPlaceholder: null,
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
    onPhoneNumberChange: null,
    onSelectFlag: null,
    fallbackFlagInUnkownNanp: true,
  };

  static propTypes = {
    css: PropTypes.arrayOf(PropTypes.string),
    fieldName: PropTypes.string,
    fieldId: PropTypes.string,
    value: PropTypes.string,
    countriesData: PropTypes.arrayOf(PropTypes.array),
    allowExtensions: PropTypes.bool,
    autoFormat: PropTypes.bool,
    autoPlaceholder: PropTypes.bool,
    preprocessPlaceholder: PropTypes.func,
    autoHideDialCode: PropTypes.bool,
    defaultCountry: PropTypes.string,
    geoIpLookup: PropTypes.func,
    nationalMode: PropTypes.bool,
    numberType: PropTypes.string,
    noCountryDataHandler: PropTypes.func,
    onlyCountries: PropTypes.arrayOf(PropTypes.string),
    preferredCountries: PropTypes.arrayOf(PropTypes.string),
    utilsScript: PropTypes.string,
    onPhoneNumberChange: PropTypes.func,
    onSelectFlag: PropTypes.func,
    disabled: PropTypes.bool,
    fallbackFlagInUnkownNanp: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.autoCountry = '';
    this.tempCountry = '';
    this.startedLoadingAutoCountry = false;

    this.deferreds = [];
    this.autoCountryDeferred = new _.Deferred();
    this.utilsScriptDeferred = new _.Deferred();

    this.isMobile = /Android.+Mobile|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent);
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
      ZERO: 48,
      NINE: 57,
      SPACE: 32,
      BSPACE: 8,
      TAB: 9,
      DEL: 46,
      CTRL: 17,
      CMD1: 91, // Chrome
      CMD2: 224, // FF
    };

    this.isGoodBrowser = Boolean(document.createElement('input').setSelectionRange);

    this.query = '';

    this.state = {
      countryList: {
        showDropdown: false,
        highlightedCountry: 0,
      },
      telInput: {
        value: '',
        disabled: false,
        readonly: false,
        offsetTop: 0,
        outerHeight: 0,
      },
      countryCode: 'us',
    };

    this.selectedCountryData = {};
    this.addCountryCode = this.addCountryCode.bind(this);
    this.autoCountryLoaded = this.autoCountryLoaded.bind(this);
    this.getDialCode = this.getDialCode.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleSelectedFlagKeydown = this.handleSelectedFlagKeydown.bind(this);
    this.handleInvalidKey = this.handleInvalidKey.bind(this);
    this.handleInputKey = this.handleInputKey.bind(this);
    this.setInitialState = this.setInitialState.bind(this);
    this.setNumber = this.setNumber.bind(this);
    this.setInstanceCountryData = this.setInstanceCountryData.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.notifyPhoneNumberChange = this.notifyPhoneNumberChange.bind(this);
    this.isValidNumber = this.isValidNumber.bind(this);
    this.isUnknownNanp = this.isUnknownNanp.bind(this);
    this.initRequests = this.initRequests.bind(this);
    this.updateDialCode = this.updateDialCode.bind(this);
    this.updateFlagFromNumber = this.updateFlagFromNumber.bind(this);
    this.updatePlaceholder = this.updatePlaceholder.bind(this);
    this.loadAutoCountry = this.loadAutoCountry.bind(this);
    this.loadUtils = this.loadUtils.bind(this);
    this.processCountryData = this.processCountryData.bind(this);
    this.getNumber = this.getNumber.bind(this);

    // wrapping actions
    this.selectFlag = this.selectFlag.bind(this);
    this.clickSelectedFlag = this.clickSelectedFlag.bind(this);
    this.updateVal = this.updateVal.bind(this);
    this.ensurePlus = this.ensurePlus.bind(this);
    this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.searchForCountry = this.searchForCountry.bind(this);
    this.handleEnterKey = this.handleEnterKey.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleUpDownKey = this.handleUpDownKey.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.changeHighlightCountry = this.changeHighlightCountry.bind(this);
  }

  componentDidMount() {
    this.processCountryData.call(this);
    this.tempCountry = this.getTempCountry(this.props.defaultCountry);

    if (document.readyState === 'complete') {
      this.windowLoaded = true;
    } else {
      window.addEventListener('load', () => {
        this.windowLoaded = true;
      });
    }

    this.initRequests();
    this.setInitialState();

    this.deferreds.push(this.autoCountryDeferred.promise());
    this.deferreds.push(this.utilsScriptDeferred.promise());

    _.when(this.deferreds).done(() => {
      this.setInitialState();
    });

    document.addEventListener('keydown', this.handleDocumentKeyDown);
    document.querySelector('html').addEventListener('click', this.handleDocumentClick);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setNumber(nextProps.value);
    }
  }

  componentWillUpdate(nextProps, nextState) {
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
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
    document.querySelector('html').removeEventListener('click', this.handleDocumentClick);
  }

  getTempCountry(countryCode) {
    if (countryCode === 'auto') {
      return 'auto';
    }

    let countryData = utils.getCountryData(countryCode);

    // check if country is available in the list
    if (!countryData.iso2) {
      if (this.props.preferredCountries.length > 0) {
        countryData = utils.getCountryData(this.props.preferredCountries[0]);
      } else {
        countryData = AllCountries.getCountries()[0];
      }
    }

    return countryData.iso2;
  }

  // set the input value and update the flag
  setNumber(number, format, addSuffix, preventConversion, isAllowedKey) {
    // ensure starts with plus
    if (!this.props.nationalMode && number.charAt(0) !== '+') {
      number = `+${number}`;
    }
    // we must update the flag first, which updates this.selectedCountryData,
    // which is used later for formatting the number before displaying it
    this.updateFlagFromNumber(number);
    this.updateVal(number, format, addSuffix, preventConversion, isAllowedKey);
  }

  // process preferred countries - iterate through the preferences,
  // fetching the country data for each one
  setPreferredCountries() {
    this.preferredCountries = [];
    for (let i = 0, max = this.props.preferredCountries.length; i < max; i++) {
      const countryCode = this.props.preferredCountries[i].toLowerCase();
      const countryData = utils.getCountryData(countryCode, true);

      if (countryData) {
        this.preferredCountries.push(countryData);
      }
    }
  }

  // process onlyCountries array if present, and generate the countryCodes map
  setInstanceCountryData() {
    // process onlyCountries option
    if (this.props.onlyCountries.length) {
      // build instance country array
      this.countries = AllCountries.getCountries().filter((country) =>
        this.props.onlyCountries.indexOf(country.iso2) > -1, this);
    } else {
      this.countries = AllCountries.getCountries();
    }

    // generate countryCodes map
    let countryCodes = {};

    for (let i = 0, max = this.countries.length; i < max; i++) {
      const c = this.countries[i];
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

  // get international phone number -
  // assumes the global function formatNumberByType (from utilsScript)
  getNumber(number) {
    const val = utils.trim(number);
    const countryCode = (this.props.nationalMode) ? this.selectedCountryData.iso2 : '';

    if (window.intlTelInputUtils) {
      return window.intlTelInputUtils.formatNumberByType(val, countryCode);
    }
    return false;
  }

  notifyPhoneNumberChange(newNumber) {
    if (typeof this.props.onPhoneNumberChange === 'function') {
      const result = this.isValidNumber(newNumber);
      this.props.onPhoneNumberChange(
        result, newNumber, this.selectedCountryData, this.getNumber(newNumber));
    }
  }

  // check if an element is visible within it's container, else scroll until it is
  scrollTo(element, middle) {
    const container = findDOMNode(this.refs.flagDropDown).querySelector('.country-list');
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
  }

  // validate the input val - assumes the global function isValidNumber (from utilsScript)
  isValidNumber(number) {
    const val = utils.trim(number);
    const countryCode = (this.props.nationalMode) ? this.selectedCountryData.iso2 : '';

    if (window.intlTelInputUtils) {
      return window.intlTelInputUtils.isValidNumber(val, countryCode);
    }
    return false;
  }

  // set the initial state of the input value and the selected flag
  setInitialState() {
    const val = this.props.value || '';

    // Init the flag setting
    this.selectFlag(this.props.defaultCountry || '', false);

    // if there is a number, and it's valid, we can go ahead and set the flag,
    // else fall back to default
    if (this.getDialCode(val)) {
      this.updateFlagFromNumber(val, false);
    } else if (this.tempCountry !== 'auto') {
      // check the defaultCountry option, else fall back to the first in the list
      let defaultCountry = this.tempCountry;
      if (!this.tempCountry) {
        defaultCountry = (this.preferredCountries.length) ?
          this.preferredCountries[0].iso2 : this.countries[0].iso2;
      }
      this.selectFlag(defaultCountry, false);

      // if empty, insert the default dial code
      // (this function will check !nationalMode and !autoHideDialCode)
      if (!val) {
        this.updateDialCode(this.selectedCountryData.dialCode, false);
      }
    }

    // format
    this.updateVal(val);
  }

  // replace any existing dial code with the new one (if not in nationalMode)
  // also we need to know if we're focusing for a couple of reasons
  // e.g. if so, we want to add any formatting suffix,
  // also if the input is empty and we're not in nationalMode,
  // then we want to insert the dial code
  updateDialCode(newDialCode, focusing) {
    const inputVal = findDOMNode(this.refs.telInput).value;
    let newNumber;

    // save having to pass this every time
    newDialCode = `+${newDialCode}`;

    if (this.props.nationalMode && inputVal.charAt(0) !== '+') {
      // if nationalMode, we just want to re-format
      newNumber = inputVal;
    } else if (inputVal) {
      // if the previous number contained a valid dial code, replace it
      // (if more than just a plus character)
      const prevDialCode = this.getDialCode(inputVal);
      if (prevDialCode.length > 1) {
        newNumber = inputVal.replace(prevDialCode, newDialCode);
      } else {
        // if the previous number didn't contain a dial code, we should persist it
        const existingNumber = (inputVal.charAt(0) !== '+') ? utils.trim(inputVal) : '';
        newNumber = newDialCode + existingNumber;
      }
    } else {
      newNumber = (!this.props.autoHideDialCode || focusing) ? newDialCode : '';
    }

    this.updateVal(newNumber, null, focusing);
  }

  // check if the given number contains an unknown area code from
  // the North American Numbering Plan i.e. the only dialCode that
  // could be extracted was +1 but the actual number's length is >=4
  isUnknownNanp(number, dialCode) {
    return (dialCode === '+1' && utils.getNumeric(number).length >= 4);
  }

  // check if need to select a new flag based on the given number
  updateFlagFromNumber(number, setFocus = true) {
    // if we're in nationalMode and we're on US/Canada,
    // make sure the number starts with a +1 so getDialCode
    // will be able to extract the area code
    // update: if we dont yet have selectedCountryData,
    // but we're here (trying to update the flag from the number),
    // that means we're initialising the plugin with a number that
    // already has a dial code, so fine to ignore this bit
    if (number && this.props.nationalMode &&
        this.selectedCountryData && this.selectedCountryData.dialCode === '1' &&
        number.charAt(0) !== '+') {
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
      const alreadySelected = (this.selectedCountryData &&
        countryCodes.indexOf(this.selectedCountryData.iso2) !== -1);

      // if a matching country is not already selected
      // (or this is an unknown NANP area code): choose the first in the list
      if (
          !alreadySelected ||
          (this.props.fallbackFlagInUnkownNanp && this.isUnknownNanp(number, dialCode))
         ) {
        // if using onlyCountries option, countryCodes[0] may be empty,
        // so we must find the first non-empty index
        for (let j = 0, max = countryCodes.length; j < max; j++) {
          if (countryCodes[j]) {
            countryCode = countryCodes[j];
            break;
          }
        }
      }
    } else if (number.charAt(0) === '+' && utils.getNumeric(number).length) {
      // invalid dial code, so empty
      // Note: use getNumeric here because the number has not been formatted yet,
      // so could contain bad shit
      countryCode = '';
    }

    if (countryCode !== null && countryCode !== '' &&
      this.state.countryCode !== countryCode) {
      this.selectFlag(countryCode, setFocus);
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
          this.autoCountryLoaded();
        });
      }
    }
  }

  // this is called when the geoip call returns
  autoCountryLoaded() {
    if (this.tempCountry === 'auto') {
      this.tempCountry = this.autoCountry;
      this.autoCountryDeferred.resolve();
    }
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

  // prepare all of the country data, including onlyCountries and preferredCountries options
  processCountryData() {
    // format countries data to what is necessary for component function
    // defaults to data defined in `AllCountries`
    AllCountries.initialize(this.props.countriesData);

    // set the instances country data objects
    this.setInstanceCountryData.call(this);

    // set the preferredCountries property
    this.setPreferredCountries.call(this);
  }

  // add a country code to countryCodes
  addCountryCode(countryCodes, iso2, dialCode, priority) {
    if (!(dialCode in countryCodes)) {
      countryCodes[dialCode] = [];
    }

    const index = priority || 0;
    countryCodes[dialCode][index] = iso2;

    return countryCodes;
  }

  handleSelectedFlagKeydown(e) {
    if (!this.state.countryList.showDropdown &&
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

  // alert the user to an invalid key event
  handleInvalidKey() {
    utils.addClass(findDOMNode(this.refs.telInput), 'iti-invalid-key');
    setTimeout(() => {
      utils.removeClass(findDOMNode(this.refs.telInput), 'iti-invalid-key');
    }, 100);
  }

  // when autoFormat is enabled: handle various key events on the input:
  // 1) adding a new number character, which will replace any selection,
  //    reformat, and preserve the cursor position
  // 2) reformatting on backspace/delete
  // 3) cut/paste event
  handleInputKey(newNumericChar, addSuffix, isAllowedKey) {
    let val = findDOMNode(this.refs.telInput).value;
    let originalLeftChars;
    let digitsOnRight = 0;
    // raw DOM element
    const input = findDOMNode(this.refs.telInput);

    if (this.isGoodBrowser) {
      // cursor strategy: maintain the number of digits on the right.
      // we use the right instead of the left so that
      // A) we dont have to account for the new digit (or multiple digits if paste event),
      // and B) we're always on the right side of formatting suffixes
      digitsOnRight = utils.getDigitsOnRight(val, input.selectionEnd);
      // if handling a new number character: insert it in the right place
      if (newNumericChar) {
        // replace any selection they may have made with the new char
        val = val.substr(0, input.selectionStart) + newNumericChar +
          val.substring(input.selectionEnd, val.length);
      } else {
        // here we're not handling a new char, we're just doing a re-format
        // (e.g. on delete/backspace/paste, after the fact), but we still need to
        // maintain the cursor position. so make note of the char on the left,
        // and then after the re-format, we'll count in the same number of digits
        // from the right, and then keep going through any formatting chars until
        // we hit the same left char that we had before.
        // UPDATE: now have to store 2 chars as extensions formatting contains
        // 2 spaces so you need to be able to distinguish
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
      val = findDOMNode(this.refs.telInput).value;

      // if it was at the end, keep it there
      if (!digitsOnRight) {
        newCursor = val.length;
      } else {
        // else count in the same number of digits from the right
        newCursor = utils.getCursorFromDigitsOnRight(val, digitsOnRight);

        // but if delete/paste etc, keep going left until hit the same left char as before
        if (!newNumericChar) {
          newCursor = utils.getCursorFromLeftChar(val, newCursor, originalLeftChars);
        }
      }
      // set the new cursor
      input.setSelectionRange(newCursor, newCursor);
    }
  }

  // update the input placeholder to an example number from the currently selected country
  updatePlaceholder() {
    if (window.intlTelInputUtils && !this.hadInitialPlaceholder &&
      this.props.autoPlaceholder && this.selectedCountryData) {
      const iso2 = this.selectedCountryData.iso2;
      const numberType = window.intlTelInputUtils.numberType[this.props.numberType || 'FIXED_LINE'];
      let placeholder = (iso2) ?
        window.intlTelInputUtils.getExampleNumber(iso2, this.props.nationalMode, numberType) : '';

      if (typeof this.props.preprocessPlaceholder === 'function') {
        placeholder = this.props.preprocessPlaceholder(placeholder, iso2);
      }

      findDOMNode(this.refs.telInput).setAttribute('placeholder', placeholder);
    }
  }

  handleKeyPress(e) {
    if (this.props.autoFormat) {
      // format number and update flag on keypress
      // use keypress event as we want to ignore all input except for a select few keys,
      // but we dont want to ignore the navigation keys like the arrows etc.
      // NOTE: no point in refactoring this to only bind these listeners on focus/blur
      // because then you would need to have those 2 listeners running the whole time anyway...

      // 32 is space, and after that it's all chars (not meta/nav keys)
      // this fix is needed for Firefox, which triggers keypress event for some meta/nav keys
      // Update: also ignore if this is a metaKey e.g. FF and Safari trigger keypress on
      // the v of Ctrl+v
      // Update: also ignore if ctrlKey (FF on Windows/Ubuntu)
      // Update: also check that we have utils before we do any autoFormat stuff
      if (e.which >= this.keys.SPACE &&
          !e.ctrlKey && !e.metaKey && window.intlTelInputUtils &&
          !this.state.telInput.readonly) {
        e.preventDefault();
        // allowed keys are just numeric keys and plus
        // we must allow plus for the case where the user does select-all and then
        // hits plus to start typing a new number. we could refine this logic to
        // first check that the selection contains a plus, but that wont work in old browsers,
        // and I think it's overkill anyway
        const isAllowedKey = ((e.which >= this.keys.ZERO && e.which <= this.keys.NINE) ||
                              e.which === this.keys.PLUS);
        const input = findDOMNode(this.refs.telInput);
        const noSelection = (this.isGoodBrowser && input.selectionStart === input.selectionEnd);
        const max = input.getAttribute('maxlength');
        const val = input.value;
        // assumes that if max exists, it is >0
        const isBelowMax = (max) ? (val.length < max) : true;
        // first: ensure we dont go over maxlength. we must do this here to
        // prevent adding digits in the middle of the number
        // still reformat even if not an allowed key as they could by typing a formatting char,
        // but ignore if there's a selection as doesn't make sense to replace selection with
        // illegal char and then immediately remove it
        if (isBelowMax && (isAllowedKey || noSelection)) {
          const newChar = (isAllowedKey) ? String.fromCharCode(e.which) : null;
          this.handleInputKey(newChar, true, isAllowedKey);
        }
        if (!isAllowedKey) {
          this.handleInvalidKey();
        }
      }
    }
  }

  handleKeyUp(e) {
    // the "enter" key event from selecting a dropdown item is triggered here on the input,
    // because the document.keydown handler that initially handles that event
    // triggers a focus on the input, and so the keyup for that same key event gets triggered here.
    // weird, but just make sure we dont bother doing any re-formatting in this case
    // (we've already done preventDefault in the keydown handler,
    // so it wont actually submit the form or anything).
    // ALSO: ignore keyup if readonly
    if (this.props.autoFormat && window.intlTelInputUtils) {
      // cursorAtEnd defaults to false for bad browsers else
      // they would never get a reformat on delete
      const cursorAtEnd = (this.isGoodBrowser &&
        findDOMNode(this.refs.telInput).selectionStart ===
                    this.state.telInput.value.length);

      if (!findDOMNode(this.refs.telInput).value) {
        // if they just cleared the input, update the flag to the default
        this.updateFlagFromNumber('');
      } else if ((e.which === this.keys.DEL && !cursorAtEnd) || e.which === this.keys.BSPACE) {
        // if delete in the middle: reformat with no suffix (no need to reformat if delete at end)
        // if backspace: reformat with no suffix (need to reformat if at end to
        // remove any lingering suffix - this is a feature)
        // important to remember never to add suffix on any delete key as can
        // fuck up in ie8 so you can never delete a formatting char at the end
        this.handleInputKey();
      }
      this.ensurePlus();
    } else {
      // if no autoFormat, just update flag
      this.updateFlagFromNumber(findDOMNode(this.refs.telInput).value);
    }
  }

  clickSelectedFlag() {
    if (!this.state.countryList.showDropdown &&
        !this.state.telInput.disabled &&
        !this.state.telInput.readonly) {
      this.setState({
        countryList: {
          showDropdown: true,
          highlightedCountry: this.state.countryList.highlightedCountry,
        },
        telInput: {
          value: this.state.telInput.value,
          disabled: this.state.telInput.disabled,
          readonly: this.state.telInput.readonly,
          offsetTop: utils.offset(findDOMNode(this.refs.telInput)).top,
          outerHeight: utils.getOuterHeight(findDOMNode(this.refs.telInput)),
        },
      }, () => {
        const highlightItem = findDOMNode(this.refs.flagDropDown).querySelector('.highlight');
        if (highlightItem) {
          this.scrollTo(highlightItem, true);
        }
      });
    }
  }

  // update the input's value to the given val
  // if autoFormat=true, format it first according to the country-specific formatting rules
  // Note: preventConversion will be false (i.e. we allow conversion) on
  // init and when dev calls public method setNumber
  updateVal(val, format, addSuffix, preventConversion, isAllowedKey) {
    let formatted;

    if (this.props.autoFormat && window.intlTelInputUtils && this.selectedCountryData) {
      if (typeof format === 'number' &&
        window.intlTelInputUtils.isValidNumber(val, this.selectedCountryData.iso2)) {
        // if user specified a format, and it's a valid number, then format it accordingly
        formatted = window.intlTelInputUtils.formatNumberByType(
          val, this.selectedCountryData.iso2, format);
      } else if (!preventConversion && this.props.nationalMode &&
        val.charAt(0) === '+' &&
        window.intlTelInputUtils.isValidNumber(val, this.selectedCountryData.iso2)) {
        // if nationalMode and we have a valid intl number, convert it to ntl
        formatted = window.intlTelInputUtils.formatNumberByType(val,
          this.selectedCountryData.iso2, window.intlTelInputUtils.numberFormat.NATIONAL);
      } else {
        // else do the regular AsYouType formatting
        formatted = window.intlTelInputUtils.formatNumber(val,
          this.selectedCountryData.iso2, addSuffix, this.props.allowExtensions, isAllowedKey);
      }
      // ensure we dont go over maxlength. we must do this here to truncate any formatting suffix,
      // and also handle paste events
      const max = findDOMNode(this.refs.telInput).getAttribute('maxlength');
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
        highlightedCountry: this.state.countryList.highlightedCountry,
      },
      telInput: {
        value: formatted,
        disabled: this.state.telInput.disabled,
        readonly: this.state.telInput.readonly,
        offsetTop: this.state.telInput.offsetTop,
        outerHeight: this.state.telInput.outerHeight,
      },
    });
  }

  // called when the user selects a list item from the dropdown
  selectFlag(countryCode, setFocus = true) {
    this.selectedCountryData = (countryCode) ?
      utils.getCountryData(countryCode, false, this.props.noCountryDataHandler) : {};

    // update selected flag and active list item
    this.setState({
      countryList: {
        showDropdown: false,
        highlightedCountry: this.state.countryList.highlightedCountry,
      },
      countryCode,
    }, () => {
      this.updatePlaceholder();

      if (this.selectedCountryData.dialCode) {
        this.updateDialCode(this.selectedCountryData.dialCode, true);
      }

      // focus the input
      if (setFocus) {
        findDOMNode(this.refs.telInput).focus();

        // fix for FF and IE11 (with nationalMode=false i.e. auto inserting dial code),
        // who try to put the cursor at the beginning the first time
        if (this.isGoodBrowser) {
          const len = this.state.telInput.value.length;
          findDOMNode(this.refs.telInput).setSelectionRange(len, len);
        }
      }

      // Allow Main app to do things when a country is selected
      if (typeof this.props.onSelectFlag === 'function') {
        this.props.onSelectFlag(this.selectedCountryData);
      }

      if (countryCode && countryCode !== 'auto') {
        const listItem = findDOMNode(this.refs.flagDropDown).querySelector(
          `.country-list [data-country-code="${countryCode}"]:not(.preferred)`);

        const selectedIndex = utils.retrieveLiIndex(listItem);

        this.setState({
          countryList: {
            showDropdown: false,
            highlightedCountry: selectedIndex,
          },
        });
      }
    });
  }

  // prevent deleting the plus (if not in nationalMode)
  ensurePlus() {
    if (!this.props.nationalMode) {
      const val = this.state.telInput.value;
      const input = findDOMNode(this.refs.telInput);

      if (val.charAt(0) !== '+') {
        // newCursorPos is current pos + 1 to account for the plus we are about to add
        const newCursorPos = (this.isGoodBrowser) ? input.selectionStart + 1 : 0;

        this.setState({
          telInput: {
            value: `+${val}`,
            disabled: this.state.telInput.disabled,
            readonly: this.state.telInput.readonly,
            offsetTop: this.state.telInput.offsetTop,
            outerHeight: this.state.telInput.outerHeight,
          },
        });

        if (this.isGoodBrowser) {
          input.setSelectionRange(newCursorPos, newCursorPos);
        }
      }
    }
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
        countryList: {
          showDropdown: false,
          highlightedCountry: this.state.countryList.highlightedCountry,
        },
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

  handleDocumentClick() {
    this.setState({
      countryList: {
        showDropdown: false,
        highlightedCountry: this.state.countryList.highlightedCountry,
      },
    });
  }

  // find the first list item whose name starts with the query string
  searchForCountry(query) {
    for (let i = 0, max = this.countries.length; i < max; i++) {
      if (utils.startsWith(this.countries[i].name, query)) {
        const listItem = findDOMNode(this.refs.flagDropDown).querySelector(
          `.country-list [data-country-code="${this.countries[i].iso2}"]:not(.preferred)`);

        const selectedIndex = utils.retrieveLiIndex(listItem);

        // update highlighting and scroll
        this.setState({
          countryList: {
            showDropdown: true,
            highlightedCountry: selectedIndex,
          },
        });
        this.scrollTo(listItem, true);
        break;
      }
    }
  }

  // select the currently highlighted item
  handleEnterKey() {
    const current = findDOMNode(this.refs.flagDropDown).querySelectorAll('.highlight')[0];
    if (current) {
      const selectedIndex = utils.retrieveLiIndex(current);
      const countryCode = current.getAttribute('data-country-code');

      this.setState({
        countryList: {
          showDropdown: false,
          highlightedCountry: selectedIndex,
        },
        countryCode,
      }, () => {
        this.selectFlag(this.state.countryCode);
      });
    }
  }

  toggleDropdown(status) {
    this.setState({
      countryList: {
        showDropdown: !!status,
        highlightedCountry: this.state.countryList.highlightedCountry,
      },
    });
  }

  // highlight the next/prev item in the list (and ensure it is visible)
  handleUpDownKey(key) {
    const current = findDOMNode(this.refs.flagDropDown).querySelectorAll('.highlight')[0];
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
        countryList: {
          showDropdown: true,
          highlightedCountry: selectedIndex,
        },
      });
    }
  }

  handleInputChange(e) {
    this.setState({
      telInput: {
        value: e.target.value,
        disabled: this.state.telInput.disabled,
        readonly: this.state.telInput.readonly,
        offsetTop: this.state.telInput.offsetTop,
        outerHeight: this.state.telInput.outerHeight,
      },
    });
  }

  changeHighlightCountry(showDropdown, selectedIndex) {
    this.setState({
      countryList: {
        showDropdown,
        highlightedCountry: selectedIndex,
      },
    });
  }

  render() {
    let wrapperClass = this.props.css[0];
    const inputClass = this.props.css[1];

    if (this.state.countryList.showDropdown) {
      wrapperClass += ' expanded';
    }

    return (
      <div className={wrapperClass}>
        <FlagDropDown ref="flagDropDown"
          clickSelectedFlag={this.clickSelectedFlag}
          selectFlag={this.selectFlag}
          countryCode={this.state.countryCode}
          isMobile={this.isMobile}
          handleSelectedFlagKeydown={this.handleSelectedFlagKeydown}
          changeHighlightCountry={this.changeHighlightCountry}
          countries={this.countries}
          showDropdown={this.state.countryList.showDropdown}
          inputTop={this.state.telInput.offsetTop}
          inputOuterHeight={this.state.telInput.outerHeight}
          preferredCountries={this.preferredCountries}
          highlightedCountry={this.state.countryList.highlightedCountry}
        />
        <TelInput ref="telInput"
          handleKeyUp={this.handleKeyUp}
          handleKeyPress={this.handleKeyPress}
          handleInputChange={this.handleInputChange}
          className={inputClass}
          disabled={this.state.telInput.disabled}
          readonly={this.state.telInput.readonly}
          fieldName={this.props.fieldName}
          fieldId={this.props.fieldId}
          value={this.state.telInput.value}
        />
      </div>
    );
  }
}
