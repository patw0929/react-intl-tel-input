(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["IntlTelInput"] = factory(require("react"));
	else
		root["IntlTelInput"] = factory(root["react"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var React = _interopRequire(__webpack_require__(1));

	var Ajax = _interopRequire(__webpack_require__(9));

	var _ = _interopRequire(__webpack_require__(11));

	var Cookies = _interopRequire(__webpack_require__(8));

	var AllCountries = _interopRequire(__webpack_require__(3));

	var FlagDropDown = _interopRequire(__webpack_require__(6));

	var TelInput = _interopRequire(__webpack_require__(7));

	var utils = _interopRequire(__webpack_require__(2));

	module.exports = React.createClass({
	  displayName: "IntlTelInput",

	  isGoodBrowser: function isGoodBrowser() {
	    return Boolean(document.createElement("input").setSelectionRange);
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

	  autoCountry: "",
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
	    validNumber: React.PropTypes.func
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      css: ["intl-tel-input", ""],
	      fieldName: "",
	      value: "",
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
	      utilsScript: "",
	      validNumber: null
	    };
	  },

	  getInitialState: function getInitialState() {
	    return {
	      countryList: {
	        showDropdown: false,
	        highlightedCountry: 0
	      },
	      telInput: {
	        value: "",
	        disabled: false,
	        readonly: false,
	        offsetTop: 0,
	        outerHeight: 0
	      },
	      countryCode: this.props.defaultCountry || "us"
	    };
	  },

	  changeHighlightCountry: function changeHighlightCountry(countryIndex) {
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
	  handleUpDownKey: function handleUpDownKey(key) {
	    var current = React.findDOMNode(this.refs.flagDropDown).querySelectorAll(".highlight")[0];
	    var next = key === this.keys.UP ? current ? current.previousElementSibling : undefined : current ? current.nextElementSibling : undefined;

	    if (next) {
	      // skip the divider
	      if (next.getAttribute("class").indexOf("divider") > -1) {
	        next = key === this.keys.UP ? next.previousElementSibling : next.nextElementSibling;
	      }

	      this.scrollTo(next);

	      var selectedIndex = utils.retrieveLiIndex(next);

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
	  handleEnterKey: function handleEnterKey() {
	    var _this = this;

	    var current = React.findDOMNode(this.refs.flagDropDown).querySelectorAll(".highlight")[0];
	    if (current) {
	      var selectedIndex = utils.retrieveLiIndex(current);
	      var countryCode = current.getAttribute("data-country-code");

	      this.setState({
	        countryList: {
	          showDropdown: false,
	          highlightedCountry: selectedIndex
	        },
	        telInput: this.state.telInput,
	        countryCode: countryCode
	      }, function () {
	        _this.selectFlag(_this.state.countryCode);
	      });
	    }
	  },

	  // check if an element is visible within it's container, else scroll until it is
	  scrollTo: function scrollTo(element, middle) {
	    var container = React.findDOMNode(this.refs.flagDropDown).querySelector(".country-list"),
	        containerHeight = parseFloat(getComputedStyle(container).getPropertyValue("height")),
	        containerTop = utils.offset(container).top,
	        containerBottom = containerTop + containerHeight,
	        elementHeight = utils.getOuterHeight(element),
	        elementTop = utils.offset(element).top,
	        elementBottom = elementTop + elementHeight,
	        newScrollTop = elementTop - containerTop + container.scrollTop,
	        middleOffset = containerHeight / 2 - elementHeight / 2;

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
	  isValidNumber: function isValidNumber() {
	    var val = utils.trim(this.state.telInput.value),
	        countryCode = this.props.nationalMode ? this.selectedCountryData.iso2 : "";

	    if (window.intlTelInputUtils) {
	      return window.intlTelInputUtils.isValidNumber(val, countryCode);
	    }
	    return false;
	  },

	  // find the first list item whose name starts with the query string
	  searchForCountry: function searchForCountry(query) {
	    for (var i = 0, max = this.countries.length; i < max; i++) {
	      if (utils.startsWith(this.countries[i].name, query)) {
	        var listItem = React.findDOMNode(this.refs.flagDropDown).querySelector(".country-list [data-country-code=\"" + this.countries[i].iso2 + "\"]:not(.preferred)");

	        var selectedIndex = utils.retrieveLiIndex(listItem);

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

	  query: "",

	  handleDocumentKeyDown: function handleDocumentKeyDown(e) {
	    var _this = this;

	    var queryTimer = undefined;
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
	    } else if (e.which >= this.keys.A && e.which <= this.keys.Z || e.which === this.keys.SPACE) {
	      // upper case letters (note: keyup/keydown only return upper case letters)
	      // jump to countries that start with the query string
	      if (queryTimer) {
	        clearTimeout(queryTimer);
	      }

	      if (!this.query) {
	        this.query = "";
	      }
	      this.query += String.fromCharCode(e.which);
	      this.searchForCountry(this.query);
	      // if the timer hits 1 second, reset the query
	      queryTimer = setTimeout(function () {
	        _this.query = "";
	      }, 1000);
	    }
	  },

	  handleDocumentClick: function handleDocumentClick() {
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
	  setInitialState: function setInitialState() {
	    var val = this.props.value || "";

	    // if there is a number, and it's valid, we can go ahead and set the flag, else fall back to default
	    if (this.getDialCode(val)) {
	      this.updateFlagFromNumber(val, true);
	    } else if (this.props.defaultCountry !== "auto") {
	      // check the defaultCountry option, else fall back to the first in the list
	      var defaultCountry = this.props.defaultCountry;
	      if (!this.props.defaultCountry) {
	        defaultCountry = this.preferredCountries.length ? this.preferredCountries[0].iso2 : this.countries[0].iso2;
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
	  updateVal: function updateVal(val, format, addSuffix, preventConversion, isAllowedKey) {
	    var formatted = undefined;

	    if (this.props.autoFormat && window.intlTelInputUtils && this.selectedCountryData) {
	      if (typeof format === "number" && window.intlTelInputUtils.isValidNumber(val, this.selectedCountryData.iso2)) {
	        // if user specified a format, and it's a valid number, then format it accordingly
	        formatted = window.intlTelInputUtils.formatNumberByType(val, this.selectedCountryData.iso2, format);
	      } else if (!preventConversion && this.props.nationalMode && val.charAt(0) === "+" && window.intlTelInputUtils.isValidNumber(val, this.selectedCountryData.iso2)) {
	        // if nationalMode and we have a valid intl number, convert it to ntl
	        formatted = window.intlTelInputUtils.formatNumberByType(val, this.selectedCountryData.iso2, window.intlTelInputUtils.numberFormat.NATIONAL);
	      } else {
	        // else do the regular AsYouType formatting
	        formatted = window.intlTelInputUtils.formatNumber(val, this.selectedCountryData.iso2, addSuffix, this.props.allowExtensions, isAllowedKey);
	      }
	      // ensure we dont go over maxlength. we must do this here to truncate any formatting suffix, and also handle paste events
	      var max = React.findDOMNode(this.refs.telInput).getAttribute("maxlength");
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
	      },
	      countryCode: this.state.countryCode
	    });
	  },

	  // replace any existing dial code with the new one (if not in nationalMode)
	  // also we need to know if we're focusing for a couple of reasons e.g. if so, we want to add any formatting suffix, also if the input is empty and we're not in nationalMode, then we want to insert the dial code
	  updateDialCode: function updateDialCode(newDialCode, focusing) {
	    var inputVal = React.findDOMNode(this.refs.telInput).value,
	        newNumber;

	    // save having to pass this every time
	    newDialCode = "+" + newDialCode;

	    if (this.props.nationalMode && inputVal.charAt(0) !== "+") {
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
	        var existingNumber = inputVal.charAt(0) !== "+" ? utils.trim(inputVal) : "";
	        newNumber = newDialCode + existingNumber;
	      }
	    } else {
	      newNumber = !this.props.autoHideDialCode || focusing ? newDialCode : "";
	    }

	    this.updateVal(newNumber, null, focusing);
	  },

	  // try and extract a valid international dial code from a full telephone number
	  // Note: returns the raw string inc plus character and any whitespace/dots etc
	  getDialCode: function getDialCode(number) {
	    var dialCode = "";
	    // only interested in international numbers (starting with a plus)
	    if (number.charAt(0) === "+") {
	      var numericChars = "";
	      // iterate over chars
	      for (var i = 0, max = number.length; i < max; i++) {
	        var c = number.charAt(i);
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
	  isUnknownNanp: function isUnknownNanp(number, dialCode) {
	    return dialCode === "+1" && utils.getNumeric(number).length >= 4;
	  },

	  // check if need to select a new flag based on the given number
	  updateFlagFromNumber: function updateFlagFromNumber(number, updateDefault) {
	    // if we're in nationalMode and we're on US/Canada, make sure the number starts with a +1 so _getDialCode will be able to extract the area code
	    // update: if we dont yet have selectedCountryData, but we're here (trying to update the flag from the number), that means we're initialising the plugin with a number that already has a dial code, so fine to ignore this bit
	    if (number && this.props.nationalMode && this.selectedCountryData && this.selectedCountryData.dialCode === "1" && number.charAt(0) !== "+") {
	      if (number.charAt(0) !== "1") {
	        number = "1" + number;
	      }
	      number = "+" + number;
	    }
	    // try and extract valid dial code from input
	    var dialCode = this.getDialCode(number),
	        countryCode = null;
	    if (dialCode) {
	      // check if one of the matching countries is already selected
	      var countryCodes = this.countryCodes[utils.getNumeric(dialCode)],
	          alreadySelected = this.selectedCountryData && countryCodes.indexOf(this.selectedCountryData.iso2) !== -1;
	      // if a matching country is not already selected (or this is an unknown NANP area code): choose the first in the list
	      if (!alreadySelected || this.isUnknownNanp(number, dialCode)) {
	        // if using onlyCountries option, countryCodes[0] may be empty, so we must find the first non-empty index
	        for (var j = 0, max = countryCodes.length; j < max; j++) {
	          if (countryCodes[j]) {
	            countryCode = countryCodes[j];
	            break;
	          }
	        }
	      }
	    } else if (number.charAt(0) === "+" && utils.getNumeric(number).length) {
	      // invalid dial code, so empty
	      // Note: use getNumeric here because the number has not been formatted yet, so could contain bad shit
	      countryCode = "";
	    } else if (!number || number === "+") {
	      // empty, or just a plus, so default
	      countryCode = this.props.defaultCountry;
	    }

	    if (countryCode !== null && countryCode !== "") {
	      this.selectFlag(countryCode, updateDefault);
	    }
	  },

	  initRequests: function initRequests() {
	    var _this = this;

	    // if the user has specified the path to the utils script, fetch it on window.load
	    if (this.props.utilsScript) {
	      // if the plugin is being initialised after the window.load event has already been fired
	      if (this.windowLoaded) {
	        this.loadUtils();
	      } else {
	        // wait until the load event so we don't block any other requests e.g. the flags image
	        window.onload = function () {
	          _this.loadUtils();
	        };
	      }
	    } else {
	      this.utilsScriptDeferred.resolve();
	    }

	    if (this.props.defaultCountry === "auto") {
	      this.loadAutoCountry();
	    } else {
	      this.autoCountryDeferred.resolve();
	    }
	  },

	  loadAutoCountry: function loadAutoCountry() {
	    var _this = this;

	    // check for cookie
	    var cookieAutoCountry = Cookies ? Cookies.get("itiAutoCountry") : "";
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

	      if (typeof this.props.geoIpLookup === "function") {
	        this.props.geoIpLookup(function (countryCode) {
	          _this.autoCountry = countryCode.toLowerCase();
	          if (Cookies) {
	            Cookies.set("itiAutoCountry", _this.autoCountry, {
	              path: "/"
	            });
	          }
	          // tell all instances the auto country is ready
	          // TODO: this should just be the current instances
	          _this.autoCountryLoaded();
	        });
	      }
	    }
	  },

	  // this is called when the geoip call returns
	  autoCountryLoaded: function autoCountryLoaded() {
	    if (this.props.defaultCountry === "auto") {
	      this.props.defaultCountry = this.autoCountry;
	      this.setInitialState();
	      this.autoCountryDeferred.resolve();
	    }
	  },

	  loadUtils: function loadUtils() {
	    var _this = this;

	    var ajax = new Ajax({
	      url: this.props.utilsScript
	    }).on("success", function (event) {
	      var data = event.target.response;
	      if (data) {
	        (window.execScript || function (res) {
	          window.eval.call(window, res);
	        })(data);
	      }
	      _this.utilsScriptDeferred.resolve();
	    });
	    ajax.send();
	  },

	  componentDidMount: function componentDidMount() {
	    var _this = this;

	    window.onload = function () {
	      _this.windowLoaded = true;
	    };

	    this.initRequests();

	    this.setInitialState();

	    var deferreds = [];
	    deferreds.push(this.autoCountryDeferred.promise());
	    deferreds.push(this.utilsScriptDeferred.promise());

	    _.when(deferreds).done(function () {
	      _this.setInitialState();
	    });

	    document.addEventListener("keydown", this.handleDocumentKeyDown);
	    document.querySelector("html").addEventListener("click", this.handleDocumentClick);
	  },

	  componentWillUpdate: function componentWillUpdate(nextProps, nextState) {
	    if (nextState.countryList.showDropdown) {
	      document.addEventListener("keydown", this.handleDocumentKeyDown);
	      document.querySelector("html").addEventListener("click", this.handleDocumentClick);
	    } else {
	      document.removeEventListener("keydown", this.handleDocumentKeyDown);
	      document.querySelector("html").removeEventListener("click", this.handleDocumentClick);
	    }
	  },

	  // prepare all of the country data, including onlyCountries and preferredCountries options
	  processCountryData: function processCountryData() {
	    // set the instances country data objects
	    this.setInstanceCountryData();

	    // set the preferredCountries property
	    this.setPreferredCountries();
	  },

	  // add a country code to this.countryCodes
	  addCountryCode: function addCountryCode(countryCodes, iso2, dialCode, priority) {
	    if (!(dialCode in countryCodes)) {
	      countryCodes[dialCode] = [];
	    }

	    var index = priority || 0;
	    countryCodes[dialCode][index] = iso2;

	    return countryCodes;
	  },

	  // process onlyCountries array if present, and generate the countryCodes map
	  setInstanceCountryData: function setInstanceCountryData() {
	    var country = "",
	        countries = [];

	    // process onlyCountries option
	    if (this.props.onlyCountries.length) {
	      // standardise case
	      for (var i = 0, max = this.props.onlyCountries.length; i < max; i++) {
	        country = this.props.onlyCountries[i].toLowerCase();
	      }

	      // build instance country array
	      for (var i = 0, max = AllCountries.length; i < max; i++) {
	        if (country.indexOf(AllCountries[i].iso2) > -1) {
	          this.countries.push(AllCountries[i]);
	        }
	      }
	    } else {
	      this.countries = AllCountries;
	    }

	    // generate countryCodes map
	    var countryCodes = {};

	    for (var i = 0, max = countries.length; i < max; i++) {
	      var c = countries[i];
	      countryCodes = this.addCountryCode(countryCodes, c.iso2, c.dialCode, c.priority);
	      // area codes
	      if (c.areaCodes) {
	        for (var j = 0, areaCodesMax = c.areaCodes.length; j < areaCodesMax; j++) {
	          // full dial code is country code + dial code
	          countryCodes = this.addCountryCode(countryCodes, c.iso2, c.dialCode + c.areaCodes[j]);
	        }
	      }
	    }

	    this.countryCodes = countryCodes;
	  },

	  // process preferred countries - iterate through the preferences,
	  // fetching the country data for each one
	  setPreferredCountries: function setPreferredCountries() {
	    this.preferredCountries = [];
	    for (var i = 0, max = this.props.preferredCountries.length; i < max; i++) {
	      var countryCode = this.props.preferredCountries[i].toLowerCase(),
	          countryData = utils.getCountryData(countryCode, true);

	      if (countryData) {
	        this.preferredCountries.push(countryData);
	      }
	    }
	  },

	  // called when the user selects a list item from the dropdown
	  selectFlag: function selectFlag(countryCode) {
	    var _this = this;

	    this.selectedCountryData = countryCode ? utils.getCountryData(countryCode, false) : {};
	    // update selected flag and active list item
	    this.setState({
	      countryList: {
	        showDropdown: false,
	        highlightedCountry: this.state.countryList.highlightedCountry
	      },
	      telInput: this.state.telInput,
	      countryCode: countryCode
	    }, function () {
	      // and the input's placeholder
	      _this.updatePlaceholder();

	      _this.updateDialCode(_this.selectedCountryData.dialCode, true);

	      // always fire the change event as even if nationalMode=true (and we haven't updated the input val), the system as a whole has still changed - see country-sync example. think of it as making a selection from a select element.
	      //this.telInput.trigger("change");

	      // focus the input
	      React.findDOMNode(_this.refs.telInput).focus();
	      // fix for FF and IE11 (with nationalMode=false i.e. auto inserting dial code), who try to put the cursor at the beginning the first time
	      if (_this.isGoodBrowser) {
	        var len = _this.state.telInput.value.length;
	        React.findDOMNode(_this.refs.telInput).setSelectionRange(len, len);
	      }
	    });
	  },

	  handleSelectedFlagKeydown: function handleSelectedFlagKeydown(e) {
	    if (!this.state.showDropdown && (e.which === this.keys.UP || e.which === this.keys.DOWN || e.which === this.keys.SPACE || e.which === this.keys.ENTER)) {
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

	  toggleDropdown: function toggleDropdown(status) {
	    this.setState({
	      countryList: {
	        showDropdown: !!status,
	        highlightedCountry: this.state.countryList.highlightedCountry
	      },
	      telInput: this.state.telInput,
	      countryCode: this.state.countryCode
	    });
	  },

	  clickSelectedFlag: function clickSelectedFlag() {
	    if (!this.state.countryList.showDropdown && !this.state.telInput.disabled && !this.state.telInput.readonly) {
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
	  ensurePlus: function ensurePlus() {
	    if (!this.props.nationalMode) {
	      var val = this.state.telInput.value,
	          input = React.findDOMNode(this.refs.telInput);
	      if (val.charAt(0) !== "+") {
	        // newCursorPos is current pos + 1 to account for the plus we are about to add
	        var newCursorPos = this.isGoodBrowser ? input.selectionStart + 1 : 0;

	        this.setState({
	          countryList: this.state.countryList,
	          telInput: {
	            value: "+" + val,
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
	  handleInvalidKey: function handleInvalidKey() {
	    var _this = this;

	    React.findDOMNode(this.refs.telInput).classList.add("iti-invalid-key");
	    setTimeout(function () {
	      React.findDOMNode(_this.refs.telInput).classList.remove("iti-invalid-key");
	    }, 100);
	  },

	  // when autoFormat is enabled: handle various key events on the input:
	  // 1) adding a new number character, which will replace any selection, reformat, and preserve the cursor position
	  // 2) reformatting on backspace/delete
	  // 3) cut/paste event
	  handleInputKey: function handleInputKey(newNumericChar, addSuffix, isAllowedKey) {
	    var val = React.findDOMNode(this.refs.telInput).value,

	    // cleanBefore = utils.getClean(val),
	    originalLeftChars = undefined,

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
	      var newCursor = undefined;
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
	  getCursorFromLeftChar: function getCursorFromLeftChar(val, guessCursor, originalLeftChars) {
	    for (var i = guessCursor; i > 0; i--) {
	      var leftChar = val.charAt(i - 1);
	      if (utils.isNumeric(leftChar) || val.substr(i - 2, 2) === originalLeftChars) {
	        return i;
	      }
	    }
	    return 0;
	  },

	  // after a reformat we need to make sure there are still the same number of digits to the right of the cursor
	  getCursorFromDigitsOnRight: function getCursorFromDigitsOnRight(val, digitsOnRight) {
	    for (var i = val.length - 1; i >= 0; i--) {
	      if (utils.isNumeric(val.charAt(i))) {
	        if (--digitsOnRight === 0) {
	          return i;
	        }
	      }
	    }
	    return 0;
	  },

	  // get the number of numeric digits to the right of the cursor so we can reposition the cursor correctly after the reformat has happened
	  getDigitsOnRight: function getDigitsOnRight(val, selectionEnd) {
	    var digitsOnRight = 0;
	    for (var i = selectionEnd, max = val.length; i < max; i++) {
	      if (utils.isNumeric(val.charAt(i))) {
	        digitsOnRight++;
	      }
	    }
	    return digitsOnRight;
	  },

	  // set the input value and update the flag
	  setNumber: function setNumber(number, format, addSuffix, preventConversion, isAllowedKey) {
	    // ensure starts with plus
	    if (!this.props.nationalMode && number.charAt(0) !== "+") {
	      number = "+" + number;
	    }
	    // we must update the flag first, which updates this.selectedCountryData, which is used later for formatting the number before displaying it
	    this.updateFlagFromNumber(number);
	    this.updateVal(number, format, addSuffix, preventConversion, isAllowedKey);
	  },

	  // update the input placeholder to an example number from the currently selected country
	  updatePlaceholder: function updatePlaceholder() {
	    if (window.intlTelInputUtils && !this.hadInitialPlaceholder && this.props.autoPlaceholder && this.selectedCountryData) {
	      var iso2 = this.selectedCountryData.iso2,
	          numberType = window.intlTelInputUtils.numberType[this.props.numberType || "FIXED_LINE"],
	          placeholder = iso2 ? window.intlTelInputUtils.getExampleNumber(iso2, this.props.nationalMode, numberType) : "";
	      React.findDOMNode(this.refs.telInput).setAttribute("placeholder", placeholder);
	    }
	  },

	  handleKeyPress: function handleKeyPress(e) {
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
	      if (e.which >= this.keys.SPACE && !e.ctrlKey && !e.metaKey && window.intlTelInputUtils && !this.state.telInput.readonly) {
	        e.preventDefault();
	        // allowed keys are just numeric keys and plus
	        // we must allow plus for the case where the user does select-all and then hits plus to start typing a new number. we could refine this logic to first check that the selection contains a plus, but that wont work in old browsers, and I think it's overkill anyway
	        var isAllowedKey = e.which >= this.keys.ZERO && e.which <= this.keys.NINE || e.which === this.keys.PLUS,
	            input = React.findDOMNode(this.refs.telInput),
	            noSelection = this.isGoodBrowser && input.selectionStart === input.selectionEnd,
	            max = input.getAttribute("maxlength"),
	            val = input.value,

	        // assumes that if max exists, it is >0
	        isBelowMax = max ? val.length < max : true;
	        // first: ensure we dont go over maxlength. we must do this here to prevent adding digits in the middle of the number
	        // still reformat even if not an allowed key as they could by typing a formatting char, but ignore if there's a selection as doesn't make sense to replace selection with illegal char and then immediately remove it
	        if (isBelowMax && (isAllowedKey || noSelection)) {
	          var newChar = isAllowedKey ? String.fromCharCode(e.which) : null;
	          this.handleInputKey(newChar, true, isAllowedKey);
	          // if something has changed, trigger the input event (which was otherwised squashed by the preventDefault)
	          // if (val !== this.state.telInput.value) {
	          // that.telInput.trigger("input");
	          // }
	        }
	        if (!isAllowedKey) {
	          this.handleInvalidKey();
	        }
	      }
	    }
	  },

	  handleKeyUp: function handleKeyUp(e) {
	    // the "enter" key event from selecting a dropdown item is triggered here on the input, because the document.keydown handler that initially handles that event triggers a focus on the input, and so the keyup for that same key event gets triggered here. weird, but just make sure we dont bother doing any re-formatting in this case (we've already done preventDefault in the keydown handler, so it wont actually submit the form or anything).
	    // ALSO: ignore keyup if readonly
	    if (this.props.autoFormat && window.intlTelInputUtils) {
	      // cursorAtEnd defaults to false for bad browsers else they would never get a reformat on delete
	      var cursorAtEnd = this.isGoodBrowser && React.findDOMNode(this.refs.telInput).selectionStart === this.state.telInput.value.length;

	      if (!React.findDOMNode(this.refs.telInput).value) {
	        // if they just cleared the input, update the flag to the default
	        this.updateFlagFromNumber("");
	      } else if (e.which === this.keys.DEL && !cursorAtEnd || e.which === this.keys.BSPACE) {
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

	    if (typeof this.props.validNumber === "function") {
	      var result = this.isValidNumber();
	      this.props.validNumber(result, e.target.value, this.selectedCountryData);
	    }
	  },

	  handleInputChange: function handleInputChange(e) {
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

	  render: function render() {
	    this.processCountryData();

	    var wrapperClass = this.props.css[0],
	        inputClass = this.props.css[1];

	    return React.createElement(
	      "div",
	      { className: wrapperClass },
	      React.createElement(FlagDropDown, { ref: "flagDropDown",
	        clickSelectedFlag: this.clickSelectedFlag,
	        countryCode: this.state.countryCode,
	        isMobile: this.isMobile,
	        toggleDropdown: this.toggleDropdown,
	        showDropdown: this.state.countryList.showDropdown,
	        handleSelectedFlagKeydown: this.handleSelectedFlagKeydown,
	        selectFlag: this.selectFlag,
	        countries: this.countries,
	        inputTop: this.state.telInput.offsetTop,
	        inputOuterHeight: this.state.telInput.outerHeight,
	        preferredCountries: this.preferredCountries,
	        highlightedCountry: this.state.countryList.highlightedCountry,
	        changeHighlightCountry: this.changeHighlightCountry }),
	      React.createElement(TelInput, { ref: "telInput",
	        className: inputClass,
	        disabled: this.state.telInput.disabled,
	        readonly: this.state.telInput.readonly,
	        fieldName: this.props.fieldName,
	        value: this.state.telInput.value,
	        handleInputChange: this.handleInputChange,
	        handleKeyPress: this.handleKeyPress,
	        handleKeyUp: this.handleKeyUp })
	    );
	  }
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var AllCountries = _interopRequire(__webpack_require__(3));

	module.exports = {
	  trim: function trim(str) {
	    // Make sure we trim BOM and NBSP
	    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
	    return str.replace(rtrim, "");
	  },

	  isNumeric: function isNumeric(obj) {
	    return obj - parseFloat(obj) >= 0;
	  },

	  retrieveLiIndex: function retrieveLiIndex(node) {
	    var children = node.parentNode.childNodes;
	    var num = 0;
	    for (var i = 0, max = children.length; i < max; i++) {
	      if (children[i] === node) {
	        return num;
	      }

	      if (children[i].nodeType === 1 && children[i].tagName.toLowerCase() === "li") {
	        num++;
	      }
	    }
	    return -1;
	  },

	  // extract the numeric digits from the given string
	  getNumeric: function getNumeric(s) {
	    return s.replace(/\D/g, "");
	  },

	  getClean: function getClean(s) {
	    var prefix = s.charAt(0) === "+" ? "+" : "";
	    return prefix + this.getNumeric(s);
	  },

	  // check if (uppercase) string a starts with string b
	  startsWith: function startsWith(a, b) {
	    return a.substr(0, b.length).toUpperCase() === b;
	  },

	  isWindow: function isWindow(obj) {
	    return obj !== null && obj === obj.window;
	  },

	  getWindow: function getWindow(elem) {
	    return this.isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
	  },

	  offset: function offset(elem) {
	    var docElem = undefined,
	        win = undefined,
	        box = { top: 0, left: 0 },
	        doc = elem && elem.ownerDocument;

	    docElem = doc.documentElement;

	    if (typeof elem.getBoundingClientRect !== typeof undefined) {
	      box = elem.getBoundingClientRect();
	    }

	    win = this.getWindow(doc);
	    return {
	      top: box.top + win.pageYOffset - docElem.clientTop,
	      left: box.left + win.pageXOffset - docElem.clientLeft
	    };
	  },

	  // retrieve outerHeight of element
	  getOuterHeight: function getOuterHeight(element) {
	    return element.offsetHeight + parseFloat(getComputedStyle(element).getPropertyValue("margin-top")) + parseFloat(getComputedStyle(element).getPropertyValue("margin-bottom"));
	  },

	  // find the country data for the given country code
	  getCountryData: function getCountryData(countryCode, allowFail) {
	    var countryList = AllCountries;
	    for (var i = 0, max = countryList.length; i < max; i++) {
	      if (countryList[i].iso2 === countryCode) {
	        return countryList[i];
	      }
	    }

	    if (allowFail) {
	      return null;
	    } else {
	      throw new Error("No country data for '" + countryCode + "'");
	    }
	  }
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	// Tell JSHint to ignore this warning: 'character may get silently deleted by one or more browsers'
	// jshint -W100

	// Array of country objects for the flag dropdown.
	// Each contains a name, country code (ISO 3166-1 alpha-2) and dial code.
	// Originally from https://github.com/mledoze/countries
	// then modified using the following JavaScript (NOW OUT OF DATE):

	/*
	var result = [];
	_.each(countries, function(c) {
	  // ignore countries without a dial code
	  if (c.callingCode[0].length) {
	    result.push({
	      // var locals contains country names with localised versions in brackets
	      n: _.findWhere(locals, {
	        countryCode: c.cca2
	      }).name,
	      i: c.cca2.toLowerCase(),
	      d: c.callingCode[0]
	    });
	  }
	});
	JSON.stringify(result);
	*/

	// then with a couple of manual re-arrangements to be alphabetical
	// then changed Kazakhstan from +76 to +7
	// and Vatican City from +379 to +39 (see issue 50)
	// and Caribean Netherlands from +5997 to +599
	// and Curacao from +5999 to +599
	// Removed: Åland Islands, Christmas Island, Cocos Islands, Guernsey, Isle of Man, Jersey, Kosovo, Mayotte, Pitcairn Islands, South Georgia, Svalbard, Western Sahara

	// Update: converted objects to arrays to save bytes!
	// Update: added 'priority' for countries with the same dialCode as others
	// Update: added array of area codes for countries with the same dialCode as others

	// So each country array has the following information:
	// [
	//    Country name,
	//    iso2 code,
	//    International dial code,
	//    Order (if >1 country with same dial code),
	//    Area codes (if >1 country with same dial code)
	// ]
	var allCountries = [["Afghanistan (‫افغانستان‬‎)", "af", "93"], ["Albania (Shqipëri)", "al", "355"], ["Algeria (‫الجزائر‬‎)", "dz", "213"], ["American Samoa", "as", "1684"], ["Andorra", "ad", "376"], ["Angola", "ao", "244"], ["Anguilla", "ai", "1264"], ["Antigua and Barbuda", "ag", "1268"], ["Argentina", "ar", "54"], ["Armenia (Հայաստան)", "am", "374"], ["Aruba", "aw", "297"], ["Australia", "au", "61"], ["Austria (Österreich)", "at", "43"], ["Azerbaijan (Azərbaycan)", "az", "994"], ["Bahamas", "bs", "1242"], ["Bahrain (‫البحرين‬‎)", "bh", "973"], ["Bangladesh (বাংলাদেশ)", "bd", "880"], ["Barbados", "bb", "1246"], ["Belarus (Беларусь)", "by", "375"], ["Belgium (België)", "be", "32"], ["Belize", "bz", "501"], ["Benin (Bénin)", "bj", "229"], ["Bermuda", "bm", "1441"], ["Bhutan (འབྲུག)", "bt", "975"], ["Bolivia", "bo", "591"], ["Bosnia and Herzegovina (Босна и Херцеговина)", "ba", "387"], ["Botswana", "bw", "267"], ["Brazil (Brasil)", "br", "55"], ["British Indian Ocean Territory", "io", "246"], ["British Virgin Islands", "vg", "1284"], ["Brunei", "bn", "673"], ["Bulgaria (България)", "bg", "359"], ["Burkina Faso", "bf", "226"], ["Burundi (Uburundi)", "bi", "257"], ["Cambodia (កម្ពុជា)", "kh", "855"], ["Cameroon (Cameroun)", "cm", "237"], ["Canada", "ca", "1", 1, ["204", "226", "236", "249", "250", "289", "306", "343", "365", "387", "403", "416", "418", "431", "437", "438", "450", "506", "514", "519", "548", "579", "581", "587", "604", "613", "639", "647", "672", "705", "709", "742", "778", "780", "782", "807", "819", "825", "867", "873", "902", "905"]], ["Cape Verde (Kabu Verdi)", "cv", "238"], ["Caribbean Netherlands", "bq", "599", 1], ["Cayman Islands", "ky", "1345"], ["Central African Republic (République centrafricaine)", "cf", "236"], ["Chad (Tchad)", "td", "235"], ["Chile", "cl", "56"], ["China (中国)", "cn", "86"], ["Colombia", "co", "57"], ["Comoros (‫جزر القمر‬‎)", "km", "269"], ["Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)", "cd", "243"], ["Congo (Republic) (Congo-Brazzaville)", "cg", "242"], ["Cook Islands", "ck", "682"], ["Costa Rica", "cr", "506"], ["Côte d’Ivoire", "ci", "225"], ["Croatia (Hrvatska)", "hr", "385"], ["Cuba", "cu", "53"], ["Curaçao", "cw", "599", 0], ["Cyprus (Κύπρος)", "cy", "357"], ["Czech Republic (Česká republika)", "cz", "420"], ["Denmark (Danmark)", "dk", "45"], ["Djibouti", "dj", "253"], ["Dominica", "dm", "1767"], ["Dominican Republic (República Dominicana)", "do", "1", 2, ["809", "829", "849"]], ["Ecuador", "ec", "593"], ["Egypt (‫مصر‬‎)", "eg", "20"], ["El Salvador", "sv", "503"], ["Equatorial Guinea (Guinea Ecuatorial)", "gq", "240"], ["Eritrea", "er", "291"], ["Estonia (Eesti)", "ee", "372"], ["Ethiopia", "et", "251"], ["Falkland Islands (Islas Malvinas)", "fk", "500"], ["Faroe Islands (Føroyar)", "fo", "298"], ["Fiji", "fj", "679"], ["Finland (Suomi)", "fi", "358"], ["France", "fr", "33"], ["French Guiana (Guyane française)", "gf", "594"], ["French Polynesia (Polynésie française)", "pf", "689"], ["Gabon", "ga", "241"], ["Gambia", "gm", "220"], ["Georgia (საქართველო)", "ge", "995"], ["Germany (Deutschland)", "de", "49"], ["Ghana (Gaana)", "gh", "233"], ["Gibraltar", "gi", "350"], ["Greece (Ελλάδα)", "gr", "30"], ["Greenland (Kalaallit Nunaat)", "gl", "299"], ["Grenada", "gd", "1473"], ["Guadeloupe", "gp", "590", 0], ["Guam", "gu", "1671"], ["Guatemala", "gt", "502"], ["Guinea (Guinée)", "gn", "224"], ["Guinea-Bissau (Guiné Bissau)", "gw", "245"], ["Guyana", "gy", "592"], ["Haiti", "ht", "509"], ["Honduras", "hn", "504"], ["Hong Kong (香港)", "hk", "852"], ["Hungary (Magyarország)", "hu", "36"], ["Iceland (Ísland)", "is", "354"], ["India (भारत)", "in", "91"], ["Indonesia", "id", "62"], ["Iran (‫ایران‬‎)", "ir", "98"], ["Iraq (‫العراق‬‎)", "iq", "964"], ["Ireland", "ie", "353"], ["Israel (‫ישראל‬‎)", "il", "972"], ["Italy (Italia)", "it", "39", 0], ["Jamaica", "jm", "1876"], ["Japan (日本)", "jp", "81"], ["Jordan (‫الأردن‬‎)", "jo", "962"], ["Kazakhstan (Казахстан)", "kz", "7", 1], ["Kenya", "ke", "254"], ["Kiribati", "ki", "686"], ["Kuwait (‫الكويت‬‎)", "kw", "965"], ["Kyrgyzstan (Кыргызстан)", "kg", "996"], ["Laos (ລາວ)", "la", "856"], ["Latvia (Latvija)", "lv", "371"], ["Lebanon (‫لبنان‬‎)", "lb", "961"], ["Lesotho", "ls", "266"], ["Liberia", "lr", "231"], ["Libya (‫ليبيا‬‎)", "ly", "218"], ["Liechtenstein", "li", "423"], ["Lithuania (Lietuva)", "lt", "370"], ["Luxembourg", "lu", "352"], ["Macau (澳門)", "mo", "853"], ["Macedonia (FYROM) (Македонија)", "mk", "389"], ["Madagascar (Madagasikara)", "mg", "261"], ["Malawi", "mw", "265"], ["Malaysia", "my", "60"], ["Maldives", "mv", "960"], ["Mali", "ml", "223"], ["Malta", "mt", "356"], ["Marshall Islands", "mh", "692"], ["Martinique", "mq", "596"], ["Mauritania (‫موريتانيا‬‎)", "mr", "222"], ["Mauritius (Moris)", "mu", "230"], ["Mexico (México)", "mx", "52"], ["Micronesia", "fm", "691"], ["Moldova (Republica Moldova)", "md", "373"], ["Monaco", "mc", "377"], ["Mongolia (Монгол)", "mn", "976"], ["Montenegro (Crna Gora)", "me", "382"], ["Montserrat", "ms", "1664"], ["Morocco (‫المغرب‬‎)", "ma", "212"], ["Mozambique (Moçambique)", "mz", "258"], ["Myanmar (Burma) (မြန်မာ)", "mm", "95"], ["Namibia (Namibië)", "na", "264"], ["Nauru", "nr", "674"], ["Nepal (नेपाल)", "np", "977"], ["Netherlands (Nederland)", "nl", "31"], ["New Caledonia (Nouvelle-Calédonie)", "nc", "687"], ["New Zealand", "nz", "64"], ["Nicaragua", "ni", "505"], ["Niger (Nijar)", "ne", "227"], ["Nigeria", "ng", "234"], ["Niue", "nu", "683"], ["Norfolk Island", "nf", "672"], ["North Korea (조선 민주주의 인민 공화국)", "kp", "850"], ["Northern Mariana Islands", "mp", "1670"], ["Norway (Norge)", "no", "47"], ["Oman (‫عُمان‬‎)", "om", "968"], ["Pakistan (‫پاکستان‬‎)", "pk", "92"], ["Palau", "pw", "680"], ["Palestine (‫فلسطين‬‎)", "ps", "970"], ["Panama (Panamá)", "pa", "507"], ["Papua New Guinea", "pg", "675"], ["Paraguay", "py", "595"], ["Peru (Perú)", "pe", "51"], ["Philippines", "ph", "63"], ["Poland (Polska)", "pl", "48"], ["Portugal", "pt", "351"], ["Puerto Rico", "pr", "1", 3, ["787", "939"]], ["Qatar (‫قطر‬‎)", "qa", "974"], ["Réunion (La Réunion)", "re", "262"], ["Romania (România)", "ro", "40"], ["Russia (Россия)", "ru", "7", 0], ["Rwanda", "rw", "250"], ["Saint Barthélemy (Saint-Barthélemy)", "bl", "590", 1], ["Saint Helena", "sh", "290"], ["Saint Kitts and Nevis", "kn", "1869"], ["Saint Lucia", "lc", "1758"], ["Saint Martin (Saint-Martin (partie française))", "mf", "590", 2], ["Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)", "pm", "508"], ["Saint Vincent and the Grenadines", "vc", "1784"], ["Samoa", "ws", "685"], ["San Marino", "sm", "378"], ["São Tomé and Príncipe (São Tomé e Príncipe)", "st", "239"], ["Saudi Arabia (‫المملكة العربية السعودية‬‎)", "sa", "966"], ["Senegal (Sénégal)", "sn", "221"], ["Serbia (Србија)", "rs", "381"], ["Seychelles", "sc", "248"], ["Sierra Leone", "sl", "232"], ["Singapore", "sg", "65"], ["Sint Maarten", "sx", "1721"], ["Slovakia (Slovensko)", "sk", "421"], ["Slovenia (Slovenija)", "si", "386"], ["Solomon Islands", "sb", "677"], ["Somalia (Soomaaliya)", "so", "252"], ["South Africa", "za", "27"], ["South Korea (대한민국)", "kr", "82"], ["South Sudan (‫جنوب السودان‬‎)", "ss", "211"], ["Spain (España)", "es", "34"], ["Sri Lanka (ශ්‍රී ලංකාව)", "lk", "94"], ["Sudan (‫السودان‬‎)", "sd", "249"], ["Suriname", "sr", "597"], ["Swaziland", "sz", "268"], ["Sweden (Sverige)", "se", "46"], ["Switzerland (Schweiz)", "ch", "41"], ["Syria (‫سوريا‬‎)", "sy", "963"], ["Taiwan (台灣)", "tw", "886"], ["Tajikistan", "tj", "992"], ["Tanzania", "tz", "255"], ["Thailand (ไทย)", "th", "66"], ["Timor-Leste", "tl", "670"], ["Togo", "tg", "228"], ["Tokelau", "tk", "690"], ["Tonga", "to", "676"], ["Trinidad and Tobago", "tt", "1868"], ["Tunisia (‫تونس‬‎)", "tn", "216"], ["Turkey (Türkiye)", "tr", "90"], ["Turkmenistan", "tm", "993"], ["Turks and Caicos Islands", "tc", "1649"], ["Tuvalu", "tv", "688"], ["U.S. Virgin Islands", "vi", "1340"], ["Uganda", "ug", "256"], ["Ukraine (Україна)", "ua", "380"], ["United Arab Emirates (‫الإمارات العربية المتحدة‬‎)", "ae", "971"], ["United Kingdom", "gb", "44"], ["United States", "us", "1", 0], ["Uruguay", "uy", "598"], ["Uzbekistan (Oʻzbekiston)", "uz", "998"], ["Vanuatu", "vu", "678"], ["Vatican City (Città del Vaticano)", "va", "39", 1], ["Venezuela", "ve", "58"], ["Vietnam (Việt Nam)", "vn", "84"], ["Wallis and Futuna", "wf", "681"], ["Yemen (‫اليمن‬‎)", "ye", "967"], ["Zambia", "zm", "260"], ["Zimbabwe", "zw", "263"]];

	// loop over all of the countries above
	var result = allCountries.map(function (country) {
	  return {
	    name: country[0],
	    iso2: country[1],
	    dialCode: country[2],
	    priority: country[3] || 0,
	    areaCodes: country[4] || null
	  };
	});

	module.exports = result;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  Copyright (c) 2015 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/

	(function () {
		'use strict';

		function classNames () {

			var classes = '';

			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;

				var argType = typeof arg;

				if ('string' === argType || 'number' === argType) {
					classes += ' ' + arg;

				} else if (Array.isArray(arg)) {
					classes += ' ' + classNames.apply(null, arg);

				} else if ('object' === argType) {
					for (var key in arg) {
						if (arg.hasOwnProperty(key) && arg[key]) {
							classes += ' ' + key;
						}
					}
				}
			}

			return classes.substr(1);
		}

		if (true) {
			// AMD. Register as an anonymous module.
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return classNames;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof module !== 'undefined' && module.exports) {
			module.exports = classNames;
		} else {
			window.classNames = classNames;
		}

	}());


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var React = _interopRequire(__webpack_require__(1));

	var classNames = _interopRequire(__webpack_require__(4));

	var utils = _interopRequire(__webpack_require__(2));

	module.exports = React.createClass({
	  displayName: "CountryList",

	  propTypes: {
	    isMobile: React.PropTypes.bool,
	    countries: React.PropTypes.array,
	    preferredCountries: React.PropTypes.array,
	    showDropdown: React.PropTypes.bool
	  },

	  handleChangeCountry: function handleChangeCountry(e) {
	    this.selectFlag(e.target.value);
	  },

	  selectFlag: function selectFlag(iso2) {
	    this.props.selectFlag(iso2);
	  },

	  appendListItem: function appendListItem(countries, className) {
	    var _this = this;

	    var preferredCountriesCount = this.props.preferredCountries.length;
	    return countries.map(function (country, index) {
	      if (_this.props.isMobile) {
	        return React.createElement(
	          "option",
	          { key: "country-" + index, "data-dial-code": country.dialCode, value: country.iso2 },
	          country.name + " +" + country.dialCode
	        );
	      } else {
	        var actualIndex = className === "preferred" ? index : index + preferredCountriesCount;
	        var countryClassObj = {
	          country: true,
	          highlight: _this.props.highlightedCountry === actualIndex
	        },
	            countryClass = undefined;
	        countryClassObj[className] = true;
	        countryClass = classNames(countryClassObj);

	        return React.createElement(
	          "li",
	          { key: "country-" + index,
	            className: countryClass,
	            "data-dial-code": country.dialCode,
	            "data-country-code": country.iso2,
	            onMouseOver: _this.handleMouseOver,
	            onClick: _this.selectFlag.bind(_this, country.iso2) },
	          React.createElement(
	            "div",
	            { ref: "selectedFlag", className: "flag" },
	            React.createElement("div", { ref: "selectedFlagInner", className: "iti-flag " + country.iso2 })
	          ),
	          React.createElement(
	            "span",
	            { className: "country-name" },
	            country.name
	          ),
	          React.createElement(
	            "span",
	            { className: "dial-code" },
	            country.dialCode
	          )
	        );
	      }
	    });
	  },

	  handleMouseOver: function handleMouseOver(e) {
	    if (e.currentTarget.getAttribute("class").indexOf("country") > -1) {
	      var selectedIndex = utils.retrieveLiIndex(e.currentTarget);
	      this.props.changeHighlightCountry(selectedIndex);
	    }
	  },

	  componentDidMount: function componentDidMount() {},

	  setDropdownPosition: function setDropdownPosition() {
	    var inputTop = this.props.inputTop,
	        windowTop = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop,
	        windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
	        inputOuterHeight = this.props.inputOuterHeight,
	        countryListOuterHeight = utils.getOuterHeight(React.findDOMNode(this.refs.listElement)),
	        dropdownFitsBelow = inputTop + inputOuterHeight + countryListOuterHeight < windowTop + windowHeight,
	        dropdownFitsAbove = inputTop - countryListOuterHeight > windowTop;

	    // dropdownHeight - 1 for border
	    var cssTop = !dropdownFitsBelow && dropdownFitsAbove ? "-" + (countryListOuterHeight - 1) + "px" : "";
	    React.findDOMNode(this.refs.listElement).style.top = cssTop;
	    React.findDOMNode(this.refs.listElement).setAttribute("class", "country-list");
	  },

	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    if (nextProps.showDropdown && !nextProps.isMobile) {
	      React.findDOMNode(this.refs.listElement).setAttribute("class", "country-list v-hide");
	      this.setDropdownPosition();

	      // show it
	      // React.findDOMNode(this.refs.listElement).setAttribute('class', 'country-list');
	      // if (activeListItem.length) {
	      //this.scrollTo(activeListItem);
	      // }

	      // bind all the dropdown-related listeners: mouseover, click, click-off, keydown
	      //this.bindDropdownListeners();
	    }
	  },

	  render: function render() {
	    var options = "",
	        preferredCountries = this.props.preferredCountries,
	        preferredOptions = undefined,
	        countries = this.props.countries,
	        className = classNames({
	      "country-list": true,
	      hide: !this.props.showDropdown
	    }),
	        divider = undefined;

	    if (this.props.isMobile) {
	      options = this.appendListItem(countries, "");

	      return React.createElement(
	        "select",
	        { className: "iti-mobile-select", onChange: this.handleChangeCountry },
	        options
	      );
	    } else {
	      if (preferredCountries.length) {
	        preferredOptions = this.appendListItem(preferredCountries, "preferred");
	        divider = React.createElement("div", { className: "divider" });
	      }

	      options = this.appendListItem(countries, "");

	      return React.createElement(
	        "ul",
	        { ref: "listElement", className: className },
	        preferredOptions,
	        divider,
	        options
	      );

	      // this is useful in lots of places
	      // this.countryListItems = this.countryList.children(".country");
	    }
	  }
	});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var React = _interopRequire(__webpack_require__(1));

	var classNames = _interopRequire(__webpack_require__(4));

	var CountryList = _interopRequire(__webpack_require__(5));

	var utils = _interopRequire(__webpack_require__(2));

	module.exports = React.createClass({
	  displayName: "FlagDropDown",

	  propTypes: {
	    countryCode: React.PropTypes.string,
	    showDropdown: React.PropTypes.bool,
	    clickSelectedFlag: React.PropTypes.func,
	    handleSelectedFlagKeydown: React.PropTypes.func,
	    isMobile: React.PropTypes.bool,
	    selectFlag: React.PropTypes.func,
	    countries: React.PropTypes.array,
	    inputTop: React.PropTypes.number,
	    inputOuterHeight: React.PropTypes.number,
	    preferredCountries: React.PropTypes.array,
	    highlightedCountry: React.PropTypes.number,
	    changeHighlightCountry: React.PropTypes.func
	  },

	  render: function render() {
	    var flagClassObj = {
	      "iti-flag": true
	    },
	        flagClass = undefined,
	        selectedCountryData = this.props.countryCode && this.props.countryCode !== "auto" ? utils.getCountryData(this.props.countryCode, false) : {},
	        titleTip = selectedCountryData ? selectedCountryData.name + ": +" + selectedCountryData.dialCode : "Unknown",
	        arrowClass = classNames({
	      arrow: true,
	      up: this.props.showDropdown
	    });

	    if (this.props.countryCode) {
	      flagClassObj[this.props.countryCode] = true;
	    }

	    flagClass = classNames(flagClassObj);

	    return React.createElement(
	      "div",
	      { className: "flag-dropdown" },
	      React.createElement(
	        "div",
	        { className: "selected-flag", tabIndex: "0",
	          onClick: this.props.clickSelectedFlag,
	          onKeyDown: this.props.handleSelectedFlagKeydown,
	          title: titleTip },
	        React.createElement("div", { className: flagClass }),
	        React.createElement("div", { className: arrowClass })
	      ),
	      React.createElement(CountryList, { ref: "countryList",
	        isMobile: this.props.isMobile,
	        showDropdown: this.props.showDropdown,
	        selectFlag: this.props.selectFlag,
	        countries: this.props.countries,
	        inputTop: this.props.inputTop,
	        inputOuterHeight: this.props.inputOuterHeight,
	        preferredCountries: this.props.preferredCountries,
	        highlightedCountry: this.props.highlightedCountry,
	        changeHighlightCountry: this.props.changeHighlightCountry })
	    );
	  }
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var React = _interopRequire(__webpack_require__(1));

	module.exports = React.createClass({
	  displayName: "TelInput",

	  propTypes: {
	    className: React.PropTypes.string,
	    disabled: React.PropTypes.bool,
	    readonly: React.PropTypes.bool,
	    fieldName: React.PropTypes.string,
	    value: React.PropTypes.string,
	    handleInputChange: React.PropTypes.func,
	    handleKeyPress: React.PropTypes.func,
	    handleKeyUp: React.PropTypes.func
	  },

	  render: function render() {
	    return React.createElement("input", { type: "tel", autoComplete: "off",
	      className: this.props.className,
	      disabled: this.props.disabled ? "disabled" : false,
	      readOnly: this.props.readonly ? "readonly" : false,
	      name: this.props.fieldName,
	      value: this.props.value,
	      onChange: this.props.handleInputChange,
	      onKeyPress: this.props.handleKeyPress,
	      onKeyUp: this.props.handleKeyUp });
	  }
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * Cookies.js - 1.2.1
	 * https://github.com/ScottHamper/Cookies
	 *
	 * This is free and unencumbered software released into the public domain.
	 */
	(function (global, undefined) {
	    'use strict';

	    var factory = function (window) {
	        if (typeof window.document !== 'object') {
	            throw new Error('Cookies.js requires a `window` with a `document` object');
	        }

	        var Cookies = function (key, value, options) {
	            return arguments.length === 1 ?
	                Cookies.get(key) : Cookies.set(key, value, options);
	        };

	        // Allows for setter injection in unit tests
	        Cookies._document = window.document;

	        // Used to ensure cookie keys do not collide with
	        // built-in `Object` properties
	        Cookies._cacheKeyPrefix = 'cookey.'; // Hurr hurr, :)
	        
	        Cookies._maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');

	        Cookies.defaults = {
	            path: '/',
	            secure: false
	        };

	        Cookies.get = function (key) {
	            if (Cookies._cachedDocumentCookie !== Cookies._document.cookie) {
	                Cookies._renewCache();
	            }

	            return Cookies._cache[Cookies._cacheKeyPrefix + key];
	        };

	        Cookies.set = function (key, value, options) {
	            options = Cookies._getExtendedOptions(options);
	            options.expires = Cookies._getExpiresDate(value === undefined ? -1 : options.expires);

	            Cookies._document.cookie = Cookies._generateCookieString(key, value, options);

	            return Cookies;
	        };

	        Cookies.expire = function (key, options) {
	            return Cookies.set(key, undefined, options);
	        };

	        Cookies._getExtendedOptions = function (options) {
	            return {
	                path: options && options.path || Cookies.defaults.path,
	                domain: options && options.domain || Cookies.defaults.domain,
	                expires: options && options.expires || Cookies.defaults.expires,
	                secure: options && options.secure !== undefined ?  options.secure : Cookies.defaults.secure
	            };
	        };

	        Cookies._isValidDate = function (date) {
	            return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
	        };

	        Cookies._getExpiresDate = function (expires, now) {
	            now = now || new Date();

	            if (typeof expires === 'number') {
	                expires = expires === Infinity ?
	                    Cookies._maxExpireDate : new Date(now.getTime() + expires * 1000);
	            } else if (typeof expires === 'string') {
	                expires = new Date(expires);
	            }

	            if (expires && !Cookies._isValidDate(expires)) {
	                throw new Error('`expires` parameter cannot be converted to a valid Date instance');
	            }

	            return expires;
	        };

	        Cookies._generateCookieString = function (key, value, options) {
	            key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
	            key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
	            value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
	            options = options || {};

	            var cookieString = key + '=' + value;
	            cookieString += options.path ? ';path=' + options.path : '';
	            cookieString += options.domain ? ';domain=' + options.domain : '';
	            cookieString += options.expires ? ';expires=' + options.expires.toUTCString() : '';
	            cookieString += options.secure ? ';secure' : '';

	            return cookieString;
	        };

	        Cookies._getCacheFromString = function (documentCookie) {
	            var cookieCache = {};
	            var cookiesArray = documentCookie ? documentCookie.split('; ') : [];

	            for (var i = 0; i < cookiesArray.length; i++) {
	                var cookieKvp = Cookies._getKeyValuePairFromCookieString(cookiesArray[i]);

	                if (cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] === undefined) {
	                    cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
	                }
	            }

	            return cookieCache;
	        };

	        Cookies._getKeyValuePairFromCookieString = function (cookieString) {
	            // "=" is a valid character in a cookie value according to RFC6265, so cannot `split('=')`
	            var separatorIndex = cookieString.indexOf('=');

	            // IE omits the "=" when the cookie value is an empty string
	            separatorIndex = separatorIndex < 0 ? cookieString.length : separatorIndex;

	            return {
	                key: decodeURIComponent(cookieString.substr(0, separatorIndex)),
	                value: decodeURIComponent(cookieString.substr(separatorIndex + 1))
	            };
	        };

	        Cookies._renewCache = function () {
	            Cookies._cache = Cookies._getCacheFromString(Cookies._document.cookie);
	            Cookies._cachedDocumentCookie = Cookies._document.cookie;
	        };

	        Cookies._areEnabled = function () {
	            var testKey = 'cookies.js';
	            var areEnabled = Cookies.set(testKey, 1).get(testKey) === '1';
	            Cookies.expire(testKey);
	            return areEnabled;
	        };

	        Cookies.enabled = Cookies._areEnabled();

	        return Cookies;
	    };

	    var cookiesExport = typeof global.document === 'object' ? factory(global) : factory;

	    // AMD support
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () { return cookiesExport; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    // CommonJS/Node.js support
	    } else if (typeof exports === 'object') {
	        // Support Node.js specific `module.exports` (which can be a function)
	        if (typeof module === 'object' && typeof module.exports === 'object') {
	            exports = module.exports = cookiesExport;
	        }
	        // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
	        exports.Cookies = cookiesExport;
	    } else {
	        global.Cookies = cookiesExport;
	    }
	})(typeof window === 'undefined' ? this : window);

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var EventEmitter = __webpack_require__(12).EventEmitter,
	    queryString = __webpack_require__(10);

	function tryParseJson(data){
	    try{
	        return JSON.parse(data);
	    }catch(error){
	        return error;
	    }
	}

	function timeout(){
	   this.request.abort();
	   this.emit('timeout');
	}

	function Ajax(settings){
	    var queryStringData,
	        ajax = this;

	    if(typeof settings === 'string'){
	        settings = {
	            url: settings
	        };
	    }

	    if(typeof settings !== 'object'){
	        settings = {};
	    }

	    ajax.settings = settings;
	    ajax.request = new window.XMLHttpRequest();
	    ajax.settings.method = ajax.settings.method || 'get';

	    if(ajax.settings.cors){
	        //http://www.html5rocks.com/en/tutorials/cors/
	        if ('withCredentials' in ajax.request) {
	            ajax.request.withCredentials = true;
	        } else if (typeof XDomainRequest !== 'undefined') {
	            // Otherwise, check if XDomainRequest.
	            // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
	            ajax.request = new window.XDomainRequest();
	        } else {
	            // Otherwise, CORS is not supported by the browser.
	            ajax.emit('error', new Error('Cors is not supported by this browser'));
	        }
	    }

	    if(ajax.settings.cache === false){
	        ajax.settings.data = ajax.settings.data || {};
	        ajax.settings.data._ = new Date().getTime();
	    }

	    if(ajax.settings.method.toLowerCase() === 'get' && typeof ajax.settings.data === 'object'){
	        var urlParts = ajax.settings.url.split('?');

	        queryStringData = queryString.parse(urlParts[1]);

	        for(var key in ajax.settings.data){
	            queryStringData[key] = ajax.settings.data[key];
	        }

	        ajax.settings.url = urlParts[0] + '?' + queryString.stringify(queryStringData);
	        ajax.settings.data = null;
	    }

	    ajax.request.addEventListener('progress', function(event){
	        ajax.emit('progress', event);
	    }, false);

	    ajax.request.addEventListener('load', function(event){
	        var data = event.target.responseText;

	        if(ajax.settings.dataType && ajax.settings.dataType.toLowerCase() === 'json'){
	            if(data === ''){
	                data = undefined;
	            }else{
	                data = tryParseJson(data);
	                if(data instanceof Error){
	                    ajax.emit('error', event, data);
	                    return;
	                }
	            }
	        }

	        if(event.target.status >= 400){
	            ajax.emit('error', event, data);
	        } else {
	            ajax.emit('success', event, data);
	        }

	    }, false);

	    ajax.request.addEventListener('error', function(event){
	        ajax.emit('error', event);
	    }, false);

	    ajax.request.addEventListener('abort', function(event){
	        ajax.emit('abort', event);
	    }, false);

	    ajax.request.addEventListener('loadend', function(event){
	        clearTimeout(this._requestTimeout);
	        ajax.emit('complete', event);
	    }, false);

	    ajax.request.open(ajax.settings.method || 'get', ajax.settings.url, true);

	    // Set default headers
	    if(ajax.settings.contentType !== false){
	        ajax.request.setRequestHeader('Content-Type', ajax.settings.contentType || 'application/json; charset=utf-8');
	    }
	    ajax.request.setRequestHeader('X-Requested-With', ajax.settings.requestedWith || 'XMLHttpRequest');
	    if(ajax.settings.auth){
	        ajax.request.setRequestHeader('Authorization', ajax.settings.auth);
	    }

	    // Set custom headers
	    for(var headerKey in ajax.settings.headers){
	        ajax.request.setRequestHeader(headerKey, ajax.settings.headers[headerKey]);
	    }

	    if(ajax.settings.processData !== false && ajax.settings.dataType === 'json'){
	        ajax.settings.data = JSON.stringify(ajax.settings.data);
	    }
	}

	Ajax.prototype = Object.create(EventEmitter.prototype);

	Ajax.prototype.send = function(){
	    this._requestTimeout = setTimeout(
	        timeout.bind(this),
	        this.settings.timeout || 120000
	    );
	    this.request.send(this.settings.data && this.settings.data);
	};

	module.exports = Ajax;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*!
		query-string
		Parse and stringify URL query strings
		https://github.com/sindresorhus/query-string
		by Sindre Sorhus
		MIT License
	*/
	(function () {
		'use strict';
		var queryString = {};

		queryString.parse = function (str) {
			if (typeof str !== 'string') {
				return {};
			}

			str = str.trim().replace(/^(\?|#)/, '');

			if (!str) {
				return {};
			}

			return str.trim().split('&').reduce(function (ret, param) {
				var parts = param.replace(/\+/g, ' ').split('=');
				var key = parts[0];
				var val = parts[1];

				key = decodeURIComponent(key);
				// missing `=` should be `null`:
				// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
				val = val === undefined ? null : decodeURIComponent(val);

				if (!ret.hasOwnProperty(key)) {
					ret[key] = val;
				} else if (Array.isArray(ret[key])) {
					ret[key].push(val);
				} else {
					ret[key] = [ret[key], val];
				}

				return ret;
			}, {});
		};

		queryString.stringify = function (obj) {
			return obj ? Object.keys(obj).map(function (key) {
				var val = obj[key];

				if (Array.isArray(val)) {
					return val.map(function (val2) {
						return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
					}).join('&');
				}

				return encodeURIComponent(key) + '=' + encodeURIComponent(val);
			}).join('&') : '';
		};

		if (true) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return queryString; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof module !== 'undefined' && module.exports) {
			module.exports = queryString;
		} else {
			self.queryString = queryString;
		}
	})();


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	(function(root){

	  // Let's borrow a couple of things from Underscore that we'll need

	  // _.each
	  var breaker = {},
	      AP = Array.prototype,
	      OP = Object.prototype,

	      hasOwn = OP.hasOwnProperty,
	      toString = OP.toString,
	      forEach = AP.forEach,
	      indexOf = AP.indexOf,
	      slice = AP.slice;

	  var _each = function( obj, iterator, context ) {
	    var key, i, l;

	    if ( !obj ) {
	      return;
	    }
	    if ( forEach && obj.forEach === forEach ) {
	      obj.forEach( iterator, context );
	    } else if ( obj.length === +obj.length ) {
	      for ( i = 0, l = obj.length; i < l; i++ ) {
	        if ( i in obj && iterator.call( context, obj[i], i, obj ) === breaker ) {
	          return;
	        }
	      }
	    } else {
	      for ( key in obj ) {
	        if ( hasOwn.call( obj, key ) ) {
	          if ( iterator.call( context, obj[key], key, obj) === breaker ) {
	            return;
	          }
	        }
	      }
	    }
	  };

	  // _.isFunction
	  var _isFunction = function( obj ) {
	    return !!(obj && obj.constructor && obj.call && obj.apply);
	  };

	  // _.extend
	  var _extend = function( obj ) {

	    _each( slice.call( arguments, 1), function( source ) {
	      var prop;

	      for ( prop in source ) {
	        if ( source[prop] !== void 0 ) {
	          obj[ prop ] = source[ prop ];
	        }
	      }
	    });
	    return obj;
	  };

	  // $.inArray
	  var _inArray = function( elem, arr, i ) {
	    var len;

	    if ( arr ) {
	      if ( indexOf ) {
	        return indexOf.call( arr, elem, i );
	      }

	      len = arr.length;
	      i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

	      for ( ; i < len; i++ ) {
	        // Skip accessing in sparse arrays
	        if ( i in arr && arr[ i ] === elem ) {
	          return i;
	        }
	      }
	    }

	    return -1;
	  };

	  // And some jQuery specific helpers

	  var class2type = {};

	  // Populate the class2type map
	  _each("Boolean Number String Function Array Date RegExp Object".split(" "), function(name, i) {
	    class2type[ "[object " + name + "]" ] = name.toLowerCase();
	  });

	  var _type = function( obj ) {
	    return obj == null ?
	      String( obj ) :
	      class2type[ toString.call(obj) ] || "object";
	  };

	  // Now start the jQuery-cum-Underscore implementation. Some very
	  // minor changes to the jQuery source to get this working.

	  // Internal Deferred namespace
	  var _d = {};
	  // String to Object options format cache
	  var optionsCache = {};

	  // Convert String-formatted options into Object-formatted ones and store in cache
	  function createOptions( options ) {
	    var object = optionsCache[ options ] = {};
	    _each( options.split( /\s+/ ), function( flag ) {
	      object[ flag ] = true;
	    });
	    return object;
	  }

	  _d.Callbacks = function( options ) {

	    // Convert options from String-formatted to Object-formatted if needed
	    // (we check in cache first)
	    options = typeof options === "string" ?
	      ( optionsCache[ options ] || createOptions( options ) ) :
	      _extend( {}, options );

	    var // Last fire value (for non-forgettable lists)
	      memory,
	      // Flag to know if list was already fired
	      fired,
	      // Flag to know if list is currently firing
	      firing,
	      // First callback to fire (used internally by add and fireWith)
	      firingStart,
	      // End of the loop when firing
	      firingLength,
	      // Index of currently firing callback (modified by remove if needed)
	      firingIndex,
	      // Actual callback list
	      list = [],
	      // Stack of fire calls for repeatable lists
	      stack = !options.once && [],
	      // Fire callbacks
	      fire = function( data ) {
	        memory = options.memory && data;
	        fired = true;
	        firingIndex = firingStart || 0;
	        firingStart = 0;
	        firingLength = list.length;
	        firing = true;
	        for ( ; list && firingIndex < firingLength; firingIndex++ ) {
	          if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
	            memory = false; // To prevent further calls using add
	            break;
	          }
	        }
	        firing = false;
	        if ( list ) {
	          if ( stack ) {
	            if ( stack.length ) {
	              fire( stack.shift() );
	            }
	          } else if ( memory ) {
	            list = [];
	          } else {
	            self.disable();
	          }
	        }
	      },
	      // Actual Callbacks object
	      self = {
	        // Add a callback or a collection of callbacks to the list
	        add: function() {
	          if ( list ) {
	            // First, we save the current length
	            var start = list.length;
	            (function add( args ) {
	              _each( args, function( arg ) {
	                var type = _type( arg );
	                if ( type === "function" ) {
	                  if ( !options.unique || !self.has( arg ) ) {
	                    list.push( arg );
	                  }
	                } else if ( arg && arg.length && type !== "string" ) {
	                  // Inspect recursively
	                  add( arg );
	                }
	              });
	            })( arguments );
	            // Do we need to add the callbacks to the
	            // current firing batch?
	            if ( firing ) {
	              firingLength = list.length;
	            // With memory, if we're not firing then
	            // we should call right away
	            } else if ( memory ) {
	              firingStart = start;
	              fire( memory );
	            }
	          }
	          return this;
	        },
	        // Remove a callback from the list
	        remove: function() {
	          if ( list ) {
	            _each( arguments, function( arg ) {
	              var index;
	              while( ( index = _inArray( arg, list, index ) ) > -1 ) {
	                list.splice( index, 1 );
	                // Handle firing indexes
	                if ( firing ) {
	                  if ( index <= firingLength ) {
	                    firingLength--;
	                  }
	                  if ( index <= firingIndex ) {
	                    firingIndex--;
	                  }
	                }
	              }
	            });
	          }
	          return this;
	        },
	        // Control if a given callback is in the list
	        has: function( fn ) {
	          return _inArray( fn, list ) > -1;
	        },
	        // Remove all callbacks from the list
	        empty: function() {
	          list = [];
	          return this;
	        },
	        // Have the list do nothing anymore
	        disable: function() {
	          list = stack = memory = undefined;
	          return this;
	        },
	        // Is it disabled?
	        disabled: function() {
	          return !list;
	        },
	        // Lock the list in its current state
	        lock: function() {
	          stack = undefined;
	          if ( !memory ) {
	            self.disable();
	          }
	          return this;
	        },
	        // Is it locked?
	        locked: function() {
	          return !stack;
	        },
	        // Call all callbacks with the given context and arguments
	        fireWith: function( context, args ) {
	          args = args || [];
	          args = [ context, args.slice ? args.slice() : args ];
	          if ( list && ( !fired || stack ) ) {
	            if ( firing ) {
	              stack.push( args );
	            } else {
	              fire( args );
	            }
	          }
	          return this;
	        },
	        // Call all the callbacks with the given arguments
	        fire: function() {
	          self.fireWith( this, arguments );
	          return this;
	        },
	        // To know if the callbacks have already been called at least once
	        fired: function() {
	          return !!fired;
	        }
	      };

	    return self;
	  };

	  _d.Deferred = function( func ) {

	    var tuples = [
	        // action, add listener, listener list, final state
	        [ "resolve", "done", _d.Callbacks("once memory"), "resolved" ],
	        [ "reject", "fail", _d.Callbacks("once memory"), "rejected" ],
	        [ "notify", "progress", _d.Callbacks("memory") ]
	      ],
	      state = "pending",
	      promise = {
	        state: function() {
	          return state;
	        },
	        always: function() {
	          deferred.done( arguments ).fail( arguments );
	          return this;
	        },
	        then: function( /* fnDone, fnFail, fnProgress */ ) {
	          var fns = arguments;

	          return _d.Deferred(function( newDefer ) {

	            _each( tuples, function( tuple, i ) {
	              var action = tuple[ 0 ],
	                fn = fns[ i ];

	              // deferred[ done | fail | progress ] for forwarding actions to newDefer
	              deferred[ tuple[1] ]( _isFunction( fn ) ?

	                function() {
	                  var returned;
	                  try { returned = fn.apply( this, arguments ); } catch(e){
	                    newDefer.reject(e);
	                    return;
	                  }

	                  if ( returned && _isFunction( returned.promise ) ) {
	                    returned.promise()
	                      .done( newDefer.resolve )
	                      .fail( newDefer.reject )
	                      .progress( newDefer.notify );
	                  } else {
	                    newDefer[ action !== "notify" ? 'resolveWith' : action + 'With']( this === deferred ? newDefer : this, [ returned ] );
	                  }
	                } :

	                newDefer[ action ]
	              );
	            });

	            fns = null;

	          }).promise();

	        },
	        // Get a promise for this deferred
	        // If obj is provided, the promise aspect is added to the object
	        promise: function( obj ) {
	          return obj != null ? _extend( obj, promise ) : promise;
	        }
	      },
	      deferred = {};

	    // Keep pipe for back-compat
	    promise.pipe = promise.then;

	    // Add list-specific methods
	    _each( tuples, function( tuple, i ) {
	      var list = tuple[ 2 ],
	        stateString = tuple[ 3 ];

	      // promise[ done | fail | progress ] = list.add
	      promise[ tuple[1] ] = list.add;

	      // Handle state
	      if ( stateString ) {
	        list.add(function() {
	          // state = [ resolved | rejected ]
	          state = stateString;

	        // [ reject_list | resolve_list ].disable; progress_list.lock
	        }, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
	      }

	      // deferred[ resolve | reject | notify ] = list.fire
	      deferred[ tuple[0] ] = list.fire;
	      deferred[ tuple[0] + "With" ] = list.fireWith;
	    });

	    // Make the deferred a promise
	    promise.promise( deferred );

	    // Call given func if any
	    if ( func ) {
	      func.call( deferred, deferred );
	    }

	    // All done!
	    return deferred;
	  };

	  // Deferred helper
	  _d.when = function( subordinate /* , ..., subordinateN */ ) {
	    var i = 0,
	      resolveValues = _type(subordinate) === 'array' && arguments.length === 1 ?
	        subordinate : slice.call( arguments ),
	      length = resolveValues.length,

	      // the count of uncompleted subordinates
	      remaining = length !== 1 || ( subordinate && _isFunction( subordinate.promise ) ) ? length : 0,

	      // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
	      deferred = remaining === 1 ? subordinate : _d.Deferred(),

	      // Update function for both resolve and progress values
	      updateFunc = function( i, contexts, values ) {
	        return function( value ) {
	          contexts[ i ] = this;
	          values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
	          if( values === progressValues ) {
	            deferred.notifyWith( contexts, values );
	          } else if ( !( --remaining ) ) {
	            deferred.resolveWith( contexts, values );
	          }
	        };
	      },

	      progressValues, progressContexts, resolveContexts;

	    // add listeners to Deferred subordinates; treat others as resolved
	    if ( length > 1 ) {
	      progressValues = new Array( length );
	      progressContexts = new Array( length );
	      resolveContexts = new Array( length );
	      for ( ; i < length; i++ ) {
	        if ( resolveValues[ i ] && _isFunction( resolveValues[ i ].promise ) ) {
	          resolveValues[ i ].promise()
	            .done( updateFunc( i, resolveContexts, resolveValues ) )
	            .fail( deferred.reject )
	            .progress( updateFunc( i, progressContexts, progressValues ) );
	        } else {
	          --remaining;
	        }
	      }
	    }

	    // if we're not waiting on anything, resolve the master
	    if ( !remaining ) {
	      deferred.resolveWith( resolveContexts, resolveValues );
	    }

	    return deferred.promise();
	  };

	  // Try exporting as a Common.js Module
	  if ( typeof module !== "undefined" && module.exports ) {
	    module.exports = _d;

	  // Or mixin to Underscore.js
	  } else if ( typeof root._ !== "undefined" ) {
	    root._.mixin(_d);

	  // Or assign it to window._
	  } else {
	    root._ = _d;
	  }

	})(this);


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        len = arguments.length;
	        args = new Array(len - 1);
	        for (i = 1; i < len; i++)
	          args[i - 1] = arguments[i];
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    len = arguments.length;
	    args = new Array(len - 1);
	    for (i = 1; i < len; i++)
	      args[i - 1] = arguments[i];

	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    var m;
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  var ret;
	  if (!emitter._events || !emitter._events[type])
	    ret = 0;
	  else if (isFunction(emitter._events[type]))
	    ret = 1;
	  else
	    ret = emitter._events[type].length;
	  return ret;
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ }
/******/ ])
});
