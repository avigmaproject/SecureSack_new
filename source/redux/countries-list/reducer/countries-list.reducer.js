import {ActionType} from '../../types/action.types';

const intialState = {
  country: [],
};

const countryList = (state = intialState, action) => {
  switch (action.type) {
    case ActionType.COUNTRIES:
      return {
        ...state,
        country: action.payload,
      };
      break;

    default:
      return state;
  }
};

export default countryList;