import {combineReducers} from 'redux';
import userInfo from '../user-info/reducer/user-info.reducer';
import countryList from '../countries-list/reducer/countries-list.reducer';

export default combineReducers({
  userInfo,
  countryList
});
