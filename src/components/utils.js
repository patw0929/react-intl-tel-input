'use strict';

import AllCountries from './AllCountries';

export default {
  // check if (uppercase) string a starts with string b
  startsWith (a, b) {
    return (a.substr(0, b.length).toUpperCase() === b);
  },

  isWindow (obj) {
    return obj !== null && obj === obj.window;
  },

  getWindow (elem) {
    return this.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
  },

  offset (elem) {
    let docElem, win,
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
  getOuterHeight (element) {
    return element.offsetHeight +
           parseFloat(getComputedStyle(element).getPropertyValue("margin-top")) +
           parseFloat(getComputedStyle(element).getPropertyValue("margin-bottom"));
  },

  // find the country data for the given country code
  getCountryData (countryCode, allowFail) {
    let countryList = AllCountries;
    for (let i = 0, max = countryList.length; i < max; i++) {
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
