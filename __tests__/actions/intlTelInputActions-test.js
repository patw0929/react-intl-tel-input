import '../../.auto_mock_off';

import * as types from '../../src/constants/actionTypes';
import * as actions from '../../src/actions/intlTelInputActions';

describe('actions', () => {
  it('getPropsData should create GET_PROPS_DATA action', () => {
    expect(actions.getPropsData('', undefined)).toEqual({
      type: types.GET_PROPS_DATA,
      data: {
        telInput: {
          value: '',
        },
        countryCode: 'us',
      },
    });
  });

  it('changeHighlightCountry should create CHANGE_HIGHLIGHT_COUNTRY action', () => {
    expect(actions.changeHighlightCountry(true, 5)).toEqual({
      type: types.CHANGE_HIGHLIGHT_COUNTRY,
      data: {
        countryList: {
          showDropdown: true,
          highlightedCountry: 5,
        },
      },
    });
  });

  it('handleUpDownKey should create HANDLE_UPDOWN_KEY action', () => {
    expect(actions.handleUpDownKey(true, 15)).toEqual({
      type: types.HANDLE_UPDOWN_KEY,
      data: {
        countryList: {
          showDropdown: true,
          highlightedCountry: 15,
        },
      },
    });
  });

  it('handleEnterKey should create HANDLE_ENTER_KEY action', () => {
    expect(actions.handleEnterKey(true, 8, 'tw')).toEqual({
      type: types.HANDLE_ENTER_KEY,
      data: {
        countryList: {
          showDropdown: true,
          highlightedCountry: 8,
        },
        countryCode: 'tw',
      },
    });
  });

  it('searchForCountry should create SEARCH_FOR_COUNTRY action', () => {
    expect(actions.searchForCountry(true, 3)).toEqual({
      type: types.SEARCH_FOR_COUNTRY,
      data: {
        countryList: {
          showDropdown: true,
          highlightedCountry: 3,
        },
      },
    });
  });

  it('handleDocumentKeydown should create HANDLE_DOCUMENT_KEYDOWN action', () => {
    expect(actions.handleDocumentKeydown(true)).toEqual({
      type: types.HANDLE_DOCUMENT_KEYDOWN,
      data: {
        countryList: {
          showDropdown: true,
        },
      },
    });
  });

  it('handleDocumentClick should create HANDLE_DOCUMENT_CLICK action', () => {
    expect(actions.handleDocumentClick(true)).toEqual({
      type: types.HANDLE_DOCUMENT_CLICK,
      data: {
        countryList: {
          showDropdown: true,
        },
      },
    });
  });

  it('updateVal should create UPDATE_VAL action', () => {
    expect(actions.updateVal(false, '0912 345 678')).toEqual({
      type: types.UPDATE_VAL,
      data: {
        countryList: {
          showDropdown: false,
        },
        telInput: {
          value: '0912 345 678',
        },
      },
    });
  });

  it('selectFlag should create SELECT_FLAG action', () => {
    expect(actions.selectFlag(false, 'tw')).toEqual({
      type: types.SELECT_FLAG,
      data: {
        countryList: {
          showDropdown: false,
        },
        countryCode: 'tw',
      },
    });
  });

  it('toggleDropdown should create TOGGLE_DROPDOWN action', () => {
    expect(actions.toggleDropdown(false)).toEqual({
      type: types.TOGGLE_DROPDOWN,
      data: {
        countryList: {
          showDropdown: false,
        },
      },
    });
  });

  it('clickSelectedFlag should create CLICK_SELECTED_FLAG action', () => {
    expect(actions.clickSelectedFlag(true, 100, 500)).toEqual({
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
    });
  });

  it('ensurePlus should create ENSURE_PLUS action', () => {
    expect(actions.ensurePlus('+886912345678')).toEqual({
      type: types.ENSURE_PLUS,
      data: {
        telInput: {
          value: '+886912345678',
        },
      },
    });
  });

  it('handleInputChange should create HANDLE_INPUT_CHANGE action', () => {
    expect(actions.handleInputChange('0912 3')).toEqual({
      type: types.HANDLE_INPUT_CHANGE,
      data: {
        telInput: {
          value: '0912 3',
        },
      },
    });
  });
});
