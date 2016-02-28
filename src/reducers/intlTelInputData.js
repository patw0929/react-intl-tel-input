import * as types from '../constants/actionTypes';

const initialState = {
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

export default function intlTelInputReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_PROPS_DATA:
      return {
        ...state,
        telInput: {
          value: action.data.telInput.value,
          disabled: action.data.telInput.disabled,
          readonly: state.telInput.readonly,
          offsetTop: state.telInput.offsetTop,
          outerHeight: state.telInput.outerHeight,
        },
        countryCode: action.data.countryCode,
      };

    case types.CHANGE_HIGHLIGHT_COUNTRY:
      return {
        ...state,
        countryList: {
          showDropdown: action.data.countryList.showDropdown,
          highlightedCountry: action.data.countryList.highlightedCountry,
        },
      };

    case types.HANDLE_UPDOWN_KEY:
      return {
        ...state,
        countryList: {
          showDropdown: action.data.countryList.showDropdown,
          highlightedCountry: action.data.countryList.highlightedCountry,
        },
      };

    case types.HANDLE_ENTER_KEY:
      return {
        ...state,
        countryList: {
          showDropdown: action.data.countryList.showDropdown,
          highlightedCountry: action.data.countryList.highlightedCountry,
        },
        countryCode: action.data.countryCode,
      };

    case types.SEARCH_FOR_COUNTRY:
      return {
        ...state,
        countryList: {
          showDropdown: action.data.countryList.showDropdown,
          highlightedCountry: action.data.countryList.highlightedCountry,
        },
      };

    case types.HANDLE_DOCUMENT_KEYDOWN:
      return {
        ...state,
        countryList: {
          showDropdown: action.data.countryList.showDropdown,
          highlightedCountry: state.countryList.highlightedCountry,
        },
      };

    case types.HANDLE_DOCUMENT_CLICK:
      return {
        ...state,
        countryList: {
          showDropdown: action.data.countryList.showDropdown,
          highlightedCountry: state.countryList.highlightedCountry,
        },
      };

    case types.UPDATE_VAL:
      return {
        ...state,
        countryList: {
          showDropdown: action.data.countryList.showDropdown,
          highlightedCountry: state.countryList.highlightedCountry,
        },
        telInput: {
          value: action.data.telInput.value,
          disabled: state.telInput.disabled,
          readonly: state.telInput.readonly,
          offsetTop: state.telInput.offsetTop,
          outerHeight: state.telInput.outerHeight,
        },
      };

    case types.SELECT_FLAG:
      return {
        ...state,
        countryList: {
          showDropdown: action.data.countryList.showDropdown,
          highlightedCountry: state.countryList.highlightedCountry,
        },
        countryCode: action.data.countryCode,
      };

    case types.TOGGLE_DROPDOWN:
      return {
        ...state,
        countryList: {
          showDropdown: action.data.countryList.showDropdown,
          highlightedCountry: state.countryList.highlightedCountry,
        },
      };

    case types.CLICK_SELECTED_FLAG:
      return {
        ...state,
        countryList: {
          showDropdown: action.data.countryList.showDropdown,
          highlightedCountry: state.countryList.highlightedCountry,
        },
        telInput: {
          value: state.telInput.value,
          disabled: state.telInput.disabled,
          readonly: state.telInput.readonly,
          offsetTop: action.data.telInput.offsetTop,
          outerHeight: action.data.telInput.outerHeight,
        },
      };

    case types.ENSURE_PLUS:
      return {
        ...state,
        telInput: {
          value: action.data.telInput.value,
          disabled: state.telInput.disabled,
          readonly: state.telInput.readonly,
          offsetTop: state.telInput.offsetTop,
          outerHeight: state.telInput.outerHeight,
        },
      };

    case types.HANDLE_INPUT_CHANGE:
      return {
        ...state,
        telInput: {
          value: action.data.telInput.value,
          disabled: state.telInput.disabled,
          readonly: state.telInput.readonly,
          offsetTop: state.telInput.offsetTop,
          outerHeight: state.telInput.outerHeight,
        },
      };

    default:
      return state;
  }
}
