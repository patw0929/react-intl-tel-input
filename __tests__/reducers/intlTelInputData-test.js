import '../../.auto_mock_off';

import * as types from '../../src/constants/actionTypes';
import { intlTelInputData as reducer } from '../../src/reducers/index';

describe('reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
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
    });
  });

  it('should handle GET_PROPS_DATA', () => {
    expect(reducer({
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
    }, {
      type: types.GET_PROPS_DATA,
      data: {
        telInput: {
          disabled: false,
          value: '0912 345 678',
        },
        countryCode: 'tw',
      },
    })).toEqual({
      countryList: {
        showDropdown: false,
        highlightedCountry: 0,
      },
      telInput: {
        value: '0912 345 678',
        disabled: false,
        readonly: false,
        offsetTop: 0,
        outerHeight: 0,
      },
      countryCode: 'tw',
    });
  });

  it('should handle CHANGE_HIGHLIGHT_COUNTRY', () => {
    expect(reducer({
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
    }, {
      type: types.CHANGE_HIGHLIGHT_COUNTRY,
      data: {
        countryList: {
          showDropdown: true,
          highlightedCountry: 27,
        },
      },
    })).toEqual({
      countryList: {
        showDropdown: true,
        highlightedCountry: 27,
      },
      telInput: {
        value: '',
        disabled: false,
        readonly: false,
        offsetTop: 0,
        outerHeight: 0,
      },
      countryCode: 'us',
    });
  });

  it('should handle HANDLE_UPDOWN_KEY', () => {
    expect(reducer({
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
    }, {
      type: types.HANDLE_UPDOWN_KEY,
      data: {
        countryList: {
          showDropdown: true,
          highlightedCountry: 29,
        },
      },
    })).toEqual({
      countryList: {
        showDropdown: true,
        highlightedCountry: 29,
      },
      telInput: {
        value: '',
        disabled: false,
        readonly: false,
        offsetTop: 0,
        outerHeight: 0,
      },
      countryCode: 'us',
    });
  });

  it('should handle HANDLE_ENTER_KEY', () => {
    expect(reducer({
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
    }, {
      type: types.HANDLE_ENTER_KEY,
      data: {
        countryList: {
          showDropdown: true,
          highlightedCountry: 20,
        },
        countryCode: 'tw',
      },
    })).toEqual({
      countryList: {
        showDropdown: true,
        highlightedCountry: 20,
      },
      telInput: {
        value: '',
        disabled: false,
        readonly: false,
        offsetTop: 0,
        outerHeight: 0,
      },
      countryCode: 'tw',
    });
  });

  it('should handle SEARCH_FOR_COUNTRY', () => {
    expect(reducer({
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
    }, {
      type: types.SEARCH_FOR_COUNTRY,
      data: {
        countryList: {
          showDropdown: true,
          highlightedCountry: 30,
        },
      },
    })).toEqual({
      countryList: {
        showDropdown: true,
        highlightedCountry: 30,
      },
      telInput: {
        value: '',
        disabled: false,
        readonly: false,
        offsetTop: 0,
        outerHeight: 0,
      },
      countryCode: 'us',
    });
  });

  it('should handle HANDLE_DOCUMENT_KEYDOWN', () => {
    expect(reducer({
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
    }, {
      type: types.HANDLE_DOCUMENT_KEYDOWN,
      data: {
        countryList: {
          showDropdown: false,
        },
      },
    })).toEqual({
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
    });
  });

  it('should handle HANDLE_DOCUMENT_CLICK', () => {
    expect(reducer({
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
    }, {
      type: types.HANDLE_DOCUMENT_CLICK,
      data: {
        countryList: {
          showDropdown: false,
        },
      },
    })).toEqual({
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
    });
  });

  it('should handle UPDATE_VAL', () => {
    expect(reducer({
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
    }, {
      type: types.UPDATE_VAL,
      data: {
        countryList: {
          showDropdown: false,
        },
        telInput: {
          value: '0912 345 678',
        },
      },
    })).toEqual({
      countryList: {
        showDropdown: false,
        highlightedCountry: 0,
      },
      telInput: {
        value: '0912 345 678',
        disabled: false,
        readonly: false,
        offsetTop: 0,
        outerHeight: 0,
      },
      countryCode: 'us',
    });
  });

  it('should handle SELECT_FLAG', () => {
    expect(reducer({
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
    }, {
      type: types.SELECT_FLAG,
      data: {
        countryList: {
          showDropdown: false,
        },
        countryCode: 'tw',
      },
    })).toEqual({
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
      countryCode: 'tw',
    });
  });

  it('should handle TOGGLE_DROPDOWN', () => {
    expect(reducer({
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
    }, {
      type: types.TOGGLE_DROPDOWN,
      data: {
        countryList: {
          showDropdown: true,
        },
      },
    })).toEqual({
      countryList: {
        showDropdown: true,
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
    });
  });

  it('should handle CLICK_SELECTED_FLAG', () => {
    expect(reducer({
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
    }, {
      type: types.CLICK_SELECTED_FLAG,
      data: {
        countryList: {
          showDropdown: true,
        },
        telInput: {
          offsetTop: 100,
          outerHeight: 500,
        },
      },
    })).toEqual({
      countryList: {
        showDropdown: true,
        highlightedCountry: 0,
      },
      telInput: {
        value: '',
        disabled: false,
        readonly: false,
        offsetTop: 100,
        outerHeight: 500,
      },
      countryCode: 'us',
    });
  });

  it('should handle ENSURE_PLUS', () => {
    expect(reducer({
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
      countryCode: 'tw',
    }, {
      type: types.ENSURE_PLUS,
      data: {
        telInput: {
          value: '+886912345678',
        },
      },
    })).toEqual({
      countryList: {
        showDropdown: false,
        highlightedCountry: 0,
      },
      telInput: {
        value: '+886912345678',
        disabled: false,
        readonly: false,
        offsetTop: 0,
        outerHeight: 0,
      },
      countryCode: 'tw',
    });
  });

  it('should handle HANDLE_INPUT_CHANGE', () => {
    expect(reducer({
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
      countryCode: 'tw',
    }, {
      type: types.HANDLE_INPUT_CHANGE,
      data: {
        telInput: {
          value: '0999 12',
        },
      },
    })).toEqual({
      countryList: {
        showDropdown: false,
        highlightedCountry: 0,
      },
      telInput: {
        value: '0999 12',
        disabled: false,
        readonly: false,
        offsetTop: 0,
        outerHeight: 0,
      },
      countryCode: 'tw',
    });
  });
});
