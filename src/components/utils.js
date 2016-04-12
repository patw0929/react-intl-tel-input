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
        num++;
      }
    }
    return -1;
  },

  // extract the numeric digits from the given string
  getNumeric(s) {
    return s.replace(/\D/g, '');
  },

  getClean(s) {
    const prefix = (s.charAt(0) === '+') ? '+' : '';
    return prefix + this.getNumeric(s);
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
    let docElem = undefined;
    let win = undefined;
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
  getCountryData(countryCode, allowFail, errorHandler) {
    const countryList = AllCountries.getCountries();
    for (let i = 0, max = countryList.length; i < max; i++) {
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

  // get the number of numeric digits to the right of the cursor so we can reposition
  // the cursor correctly after the reformat has happened
  getDigitsOnRight(val, selectionEnd) {
    let digitsOnRight = 0;
    for (let i = selectionEnd, max = val.length; i < max; i++) {
      if (this.isNumeric(val.charAt(i))) {
        digitsOnRight++;
      }
    }
    return digitsOnRight;
  },

  // we start from the position in guessCursor, and work our way left
  // until we hit the originalLeftChars or a number to make sure that
  // after reformatting the cursor has the same char on the left in the case of a delete etc
  getCursorFromLeftChar(val, guessCursor, originalLeftChars) {
    for (let i = guessCursor; i > 0; i--) {
      const leftChar = val.charAt(i - 1);
      if (this.isNumeric(leftChar) || val.substr(i - 2, 2) === originalLeftChars) {
        return i;
      }
    }
    return 0;
  },

  // after a reformat we need to make sure there are still the same number
  // of digits to the right of the cursor
  getCursorFromDigitsOnRight(val, digitsOnRight) {
    for (let i = val.length - 1; i >= 0; i--) {
      if (this.isNumeric(val.charAt(i))) {
        if (--digitsOnRight === 0) {
          return i;
        }
      }
    }
    return 0;
  },
};
