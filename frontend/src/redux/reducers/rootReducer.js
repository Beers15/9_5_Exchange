import {combineReducers} from 'redux';
import userReducer from './userReducer';
import itemReducer from './itemReducer';

export default combineReducers({
    userReducer,
    itemReducer,
});