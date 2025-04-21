import {ActionType} from '../../types/action.types';

const initialState = {
  userData: null,
};

const userInfo = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.USER_INFO:
      return {
        ...state,
        userData: action.payload,
      };
      break;

    default:
      return state;
      break;
  }
};

export default userInfo;
