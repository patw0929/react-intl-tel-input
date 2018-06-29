/* eslint-disable */
import AllCountries from './AllCountries';

export default {
  arraysEqual(a, b) {
    if (a === b) {
      return true;
    }
    if (a === null || b === null) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) {
        return false;
      }
    }

    return true;
  },

  shallowEquals(a, b) {
    if (a === b) {
      return true;
    }

    for (const key in a) {
      if (a[key] !== b[key]) {
        if (Array.isArray(a[key]) && Array.isArray(b[key])) {
          if (!this.arraysEqual(a[key], b[key])) {
            return false;
          }
        } else {
          return false;
        }
      }
    }

    for (const key in b) {
      if (a.hasOwnProperty(key) === false) {
        return false;
      }
    }
    return true;
  },

  trim(str) {
    // Make sure we trim BOM and NBSP
    const rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

    if (!str) {
      return '';
    }

    return str.replace(rtrim, '');
  },

  isNumeric(obj) {
    return obj - parseFloat(obj) >= 0;
  },

  retrieveLiIndex(node) {
    if (!node) {
      return -1;
    }

    const children = node.parentNode.childNodes;
    let num = 0;

    for (let i = 0, max = children.length; i < max; i++) {
      if (children[i] === node) {
        return num;
      }

      if (children[i].nodeType === 1 && children[i].tagName.toLowerCase() === 'li') {
        num += 1;
      }
    }

    return -1;
  },

  // extract the numeric digits from the given string
  getNumeric(s) {
    return s.replace(/\D/g, '');
  },

  // check if (uppercase) string a starts with string b
  startsWith(a, b) {
    return (a.substr(0, b.length).toUpperCase() === b);
  },

  isWindow(obj) {
    return obj !== null && obj === obj.window;
  },

  getWindow(elem) {
    return this.isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
  },

  offset(elem) {
    let docElem = null;
    let win = null;
    let box = { top: 0, left: 0 };
    const doc = elem && elem.ownerDocument;

    docElem = doc.documentElement;

    if (typeof elem.getBoundingClientRect !== typeof undefined) {
      box = elem.getBoundingClientRect();
    }

    win = this.getWindow(doc);

    return {
      top: box.top + win.pageYOffset - docElem.clientTop,
      left: box.left + win.pageXOffset - docElem.clientLeft,
    };
  },

  // retrieve outerHeight of element
  getOuterHeight(element) {
    return element.offsetHeight +
           parseFloat(window.getComputedStyle(element).getPropertyValue('margin-top')) +
           parseFloat(window.getComputedStyle(element).getPropertyValue('margin-bottom'));
  },

  // find the country data for the given country code
  // the ignoreOnlyCountriesOption is only used during init()
  // while parsing the onlyCountries array
  getCountryData(countries, countryCode, ignoreOnlyCountriesOption,
    allowFail, errorHandler) {
    const countryList = ignoreOnlyCountriesOption ?
      AllCountries.getCountries() : countries;

    for (let i = 0; i < countryList.length; i++) {
      if (countryList[i].iso2 === countryCode) {
        return countryList[i];
      }
    }

    if (allowFail) {
      return null;
    }

    if (typeof errorHandler === 'function') {
      errorHandler(countryCode);
    }

    return {};
  },

  // Copied from http://jaketrent.com/post/addremove-classes-raw-javascript/
  hasClass(el, className) {
    if (el.classList) {
      return el.classList.contains(className);
    }

    return !!el.className.match(new RegExp(`(\\s|^)${className}(\\s|$)`));
  },

  addClass(el, className) {
    if (el.classList) {
      el.classList.add(className);
    } else if (!this.hasClass(el, className)) {
      el.className += ` ${className}`;
    }
  },

  removeClass(el, className) {
    if (el.classList) {
      el.classList.remove(className);
    } else if (this.hasClass(el, className)) {
      const reg = new RegExp(`(\\s|^)${className}(\\s|$)`);

      el.className = el.className.replace(reg, ' ');
    }
  },
  findIndex(items, predicate) {
    let index = -1;

    items.some((item, i) => {
        if (predicate(item)) {
          index = i;

          return true;
        }
    });

    return index;
  },
};
