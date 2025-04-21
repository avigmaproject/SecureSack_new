import {ActionType} from '../../types/action.types';

export const countries = (country) => {
    return {
        type: ActionType.COUNTRIES,
        payload: country
    }
}