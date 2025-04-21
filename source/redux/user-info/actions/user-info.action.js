import {ActionType} from '../../types/action.types';

export const userInfo = (userData) => {
  return {
    type: ActionType.USER_INFO,
    payload: userData,
  };
};