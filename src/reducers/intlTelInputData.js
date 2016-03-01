import * as types from '../constants/actionTypes';

export const initialState = {
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

export default function intlTelInputReducer(state = {}, action) {
  switch (action.type) {
    case types.INITIALIZE:
      return {
        ...state,
        [action.id]: initialState,
      };

    case types.GET_PROPS_DATA:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          telInput: {
            value: action.data.telInput.value,
            disabled: state[action.id].telInput.disabled,
            readonly: state[action.id].telInput.readonly,
            offsetTop: state[action.id].telInput.offsetTop,
            outerHeight: state[action.id].telInput.outerHeight,
          },
          countryCode: action.data.countryCode,
        },
      };

    case types.CHANGE_HIGHLIGHT_COUNTRY:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          countryList: {
            showDropdown: action.data.countryList.showDropdown,
            highlightedCountry: action.data.countryList.highlightedCountry,
          },
        },
      };

    case types.HANDLE_UPDOWN_KEY:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          countryList: {
            showDropdown: action.data.countryList.showDropdown,
            highlightedCountry: action.data.countryList.highlightedCountry,
          },
        },
      };

    case types.HANDLE_ENTER_KEY:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          countryList: {
            showDropdown: action.data.countryList.showDropdown,
            highlightedCountry: action.data.countryList.highlightedCountry,
          },
          countryCode: action.data.countryCode,
        },
      };

    case types.SEARCH_FOR_COUNTRY:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          countryList: {
            showDropdown: action.data.countryList.showDropdown,
            highlightedCountry: action.data.countryList.highlightedCountry,
          },
        },
      };

    case types.HANDLE_DOCUMENT_KEYDOWN:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          countryList: {
            showDropdown: action.data.countryList.showDropdown,
            highlightedCountry: state[action.id].countryList.highlightedCountry,
          },
        },
      };

    case types.HANDLE_DOCUMENT_CLICK:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          countryList: {
            showDropdown: action.data.countryList.showDropdown,
            highlightedCountry: state[action.id].countryList.highlightedCountry,
          },
        },
      };

    case types.UPDATE_VAL:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          countryList: {
            showDropdown: action.data.countryList.showDropdown,
            highlightedCountry: state[action.id].countryList.highlightedCountry,
          },
          telInput: {
            value: action.data.telInput.value,
            disabled: state[action.id].telInput.disabled,
            readonly: state[action.id].telInput.readonly,
            offsetTop: state[action.id].telInput.offsetTop,
            outerHeight: state[action.id].telInput.outerHeight,
          },
        },
      };

    case types.SELECT_FLAG:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          countryList: {
            showDropdown: action.data.countryList.showDropdown,
            highlightedCountry: state[action.id].countryList.highlightedCountry,
          },
          countryCode: action.data.countryCode,
        },
      };

    case types.TOGGLE_DROPDOWN:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          countryList: {
            showDropdown: action.data.countryList.showDropdown,
            highlightedCountry: state[action.id].countryList.highlightedCountry,
          },
        },
      };

    case types.CLICK_SELECTED_FLAG:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          countryList: {
            showDropdown: action.data.countryList.showDropdown,
            highlightedCountry: state[action.id].countryList.highlightedCountry,
          },
          telInput: {
            value: state[action.id].telInput.value,
            disabled: state[action.id].telInput.disabled,
            readonly: state[action.id].telInput.readonly,
            offsetTop: action.data.telInput.offsetTop,
            outerHeight: action.data.telInput.outerHeight,
          },
        },
      };

    case types.ENSURE_PLUS:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          telInput: {
            value: action.data.telInput.value,
            disabled: state[action.id].telInput.disabled,
            readonly: state[action.id].telInput.readonly,
            offsetTop: state[action.id].telInput.offsetTop,
            outerHeight: state[action.id].telInput.outerHeight,
          },
        },
      };

    case types.HANDLE_INPUT_CHANGE:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          telInput: {
            value: action.data.telInput.value,
            disabled: state[action.id].telInput.disabled,
            readonly: state[action.id].telInput.readonly,
            offsetTop: state[action.id].telInput.offsetTop,
            outerHeight: state[action.id].telInput.outerHeight,
          },
        },
      };

    default:
      return state;
  }
}
