import * as types from '../constants/actionTypes';

export function getPropsData(telInputValue, countryCode = 'us') {
  return {
    type: types.GET_PROPS_DATA,
    data: {
      telInput: {
        value: telInputValue
      },
      countryCode: countryCode
    }
  };
}

export function changeHighlightCountry(showDropdown, highlightedCountry) {
  return {
    type: types.CHANGE_HIGHLIGHT_COUNTRY,
    data: {
      countryList: {
        showDropdown: showDropdown,
        highlightedCountry: highlightedCountry
      }
    }
  };
}

export function handleUpDownKey(showDropdown, highlightedCountry) {
  return {
    type: types.HANDLE_UPDOWN_KEY,
    data: {
      countryList: {
        showDropdown: showDropdown,
        highlightedCountry: highlightedCountry
      }
    }
  };
}

export function handleEnterKey(showDropdown, highlightedCountry, countryCode) {
  return {
    type: types.HANDLE_ENTER_KEY,
    data: {
      countryList: {
        showDropdown: showDropdown,
        highlightedCountry: highlightedCountry
      },
      countryCode: countryCode
    }
  };
}

export function searchForCountry(showDropdown, highlightedCountry) {
  return {
    type: types.SEARCH_FOR_COUNTRY,
    data: {
      countryList: {
        showDropdown: showDropdown,
        highlightedCountry: highlightedCountry
      }
    }
  };
}

export function handleDocumentKeydown(showDropdown) {
  return {
    type: types.HANDLE_DOCUMENT_KEYDOWN,
    data: {
      countryList: {
        showDropdown: showDropdown
      }
    }
  };
}

export function handleDocumentClick(showDropdown) {
  return {
    type: types.HANDLE_DOCUMENT_CLICK,
    data: {
      countryList: {
        showDropdown: showDropdown
      }
    }
  };
}

export function updateVal(showDropdown, telInputValue) {
  return {
    type: types.UPDATE_VAL,
    data: {
      countryList: {
        showDropdown: showDropdown
      },
      telInput: {
        value: telInputValue
      }
    }
  };
}

export function selectFlag(showDropdown, countryCode) {
  return {
    type: types.SELECT_FLAG,
    data: {
      countryList: {
        showDropdown: showDropdown
      },
      countryCode: countryCode
    }
  };
}

export function toggleDropdown(showDropdown) {
  return {
    type: types.TOGGLE_DROPDOWN,
    data: {
      countryList: {
        showDropdown: showDropdown
      }
    }
  };
}

export function clickSelectedFlag(showDropdown, offsetTop, outerHeight) {
  return {
    type: types.CLICK_SELECTED_FLAG,
    data: {
      countryList: {
        showDropdown: showDropdown
      },
      telInput: {
        offsetTop: offsetTop,
        outerHeight: outerHeight
      }
    }
  };
}

export function ensurePlus(telInputValue) {
  return {
    type: types.ENSURE_PLUS,
    data: {
      telInput: {
        value: telInputValue
      }
    }
  };
}

export function handleInputChange(telInputValue) {
  return {
    type: types.HANDLE_INPUT_CHANGE,
    data: {
      telInput: {
        value: telInputValue
      }
    }
  };
}
