import AllCountries from './AllCountries';

export default {
  arraysEqual (a, b) {
    if (a === b) {
      return true;
    }
    if (a == null || b == null) {
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

  shallowEquals (a, b) {
    if (a === b) {
      return true;
    }

    for (let key in a) {
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

    for (let key in b) {
      if (a.hasOwnProperty(key) === false) {
        return false;
      }
    }
    return true;
  },

  trim (str) {
    // Make sure we trim BOM and NBSP
    let rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    if (!str) {
      return '';
    }
    return str.replace(rtrim, '');
  },

  isNumeric (obj) {
    return obj - parseFloat(obj) >= 0;
  },

  retrieveLiIndex (node) {
    var children = node.parentNode.childNodes;
    var num = 0;
    for (var i = 0, max = children.length; i < max; i++) {
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
  getNumeric (s) {
    return s.replace(/\D/g, '');
  },

  getClean (s) {
    let prefix = (s.charAt(0) === '+') ? '+' : '';
    return prefix + this.getNumeric(s);
  },

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
           parseFloat(getComputedStyle(element).getPropertyValue('margin-top')) +
           parseFloat(getComputedStyle(element).getPropertyValue('margin-bottom'));
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
      throw new Error('No country data for "' + countryCode + '"');
    }
  },

  // Copied from http://jaketrent.com/post/addremove-classes-raw-javascript/
  hasClass (el, className) {
    if (el.classList) {
      return el.classList.contains(className);
    } else {
      return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    }
  },

  addClass (el, className) {
    if (el.classList) {
      el.classList.add(className);
    } else if (!this.hasClass(el, className)) {
      el.className += ' ' + className;
    }
  },

  removeClass (el, className) {
    if (el.classList) {
      el.classList.remove(className);
    } else if (this.hasClass(el, className)) {
      let reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
      el.className = el.className.replace(reg, ' ');
    }
  },
};
