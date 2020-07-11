import { combineReducers } from 'redux';
import MapReducer from './MapReducer';
import PropDetailReducer from './PropDetailReducer';

export default combineReducers({
    map: MapReducer,
    prop: PropDetailReducer
});