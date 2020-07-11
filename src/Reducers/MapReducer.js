import {
    MAP_CHANGED, PROPERTY_SELECTED, OPEN_CLOSE_PANEL, FETCH_PROPERTY_SUCCESS,
    ALLOW_ANIMATE,
    ADD_PROPERTY_MARKER,
    SEARCH_ID,
    UPDATE_PROPERTY_MARKER,
    ALLOW_VIEW_DETAIL,
    FETCH_PROPERTY_DETAIL,
    FETCH_PROPERTY_FAIL,
    SHOW_HIDE_PROPERTY_MODAL,
    SELECTED_PROP_ARRAY
} from '../utils/constants';
import { createFilter } from 'react-native-search-filter';

const INITIAL_STATE = {
    latitude: 42.3967,
    longitude: -71.1223,
    propertyData: null,
    panelStatus: false,
    markers: [],
    animate: true,
    sellatitude: null,
    sellongitude: null,
    searchedItems: [],
    allowDrag: false,
    showFetchProgress: false,
    locations: null,
    show_hide: false,
    sel_prop_arr: null
}

export default MapReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case MAP_CHANGED:
            return { ...state, latitude: action.payload.lat, longitude: action.payload.lon };
        case PROPERTY_SELECTED:
            return { ...state, propertyData: action.payload };
        case OPEN_CLOSE_PANEL:
            return { ...state, panelStatus: action.payload };
        case FETCH_PROPERTY_DETAIL:
            return { ...state, showFetchProgress: true };
        case FETCH_PROPERTY_FAIL:
            return { ...state, showFetchProgress: false };
        case SHOW_HIDE_PROPERTY_MODAL:
            return { ...state, show_hide: action.payload };
        case FETCH_PROPERTY_SUCCESS:
            const fetched_zero = action.payload[0];
            const locs = new Map();

            fetched_zero.map((item) => {
                const locStr = item.cap_location.loc_latitude + "," + item.cap_location.loc_longitude;
                if (locs.get(locStr) == null) {
                    var itemsArr = new Array();
                    itemsArr.push(item);
                    locs.set(locStr, itemsArr);
                } else {
                    locs.get(locStr).push(item);
                }
            });

            return { ...state, markers: fetched_zero, showFetchProgress: false, locations: locs };
        case SELECTED_PROP_ARRAY:
            return { ...state, sel_prop_arr: action.payload.value };
        case ALLOW_ANIMATE:
            return { ...state, animate: action.payload };
        case ADD_PROPERTY_MARKER:
            const locStr = action.payload.cap_location.loc_latitude + "," + action.payload.cap_location.loc_longitude;

            ///////////To Be IMPLEMENTED //////////////////
            if (state.locations.get(locStr) == null) {
                var itemsArr = new Array();
                itemsArr.push(action.payload);
                state.locations.set(locStr, itemsArr);
            } else {
                state.locations.get(locStr).push(action.payload);
            }
            //////////////////////////////////////

            state = { ...state, markers: [...state.markers, action.payload] };
            return state;

        case UPDATE_PROPERTY_MARKER:
            // const newstate = {
            //     ...state, markers: state.markers.map((item) => {
            //         if (item.gisid === action.payload.gisid) {
            //             const locStr = action.payload.cap_location.loc_latitude + "," + action.payload.cap_location.loc_longitude;

            ///////////To Be IMPLEMENTED //////////////////
            // if (state.locations.get(locStr) == null) {
            //     var itemsArr = new Array();
            //     itemsArr.push(action.payload);
            //     state.locations.set(locStr, itemsArr);
            // } else {
            //     state.locations.get(locStr).push(action.payload);
            // }
            ////////////////////////////////////////////////

            //             return action.payload;
            //         }
            //         return item;
            //     })
            // }
            const locs1 = new Map();

            const new_markers = state.markers.map((item) => {
                var locStr = item.cap_location.loc_latitude + "," + item.cap_location.loc_longitude;
                if (locs1.get(locStr) == null) {
                    var itemsArr = new Array();

                    if (item.gisid === action.payload.gisid) {
                        locStr = action.payload.cap_location.loc_latitude + "," + action.payload.cap_location.loc_longitude;
                        itemsArr.push(action.payload);
                    } else {
                        itemsArr.push(item);
                    }
                    locs1.set(locStr, itemsArr);
                } else {
                    if (item.gisid === action.payload.gisid) {
                        locStr = action.payload.cap_location.loc_latitude + "," + action.payload.cap_location.loc_longitude;
                        locs1.get(locStr).push(action.payload);
                    } else {
                        locs1.get(locStr).push(item);
                    }
                }

                if (item.gisid === action.payload.gisid) {
                    return action.payload;
                } else {
                    return item;
                }

            });

            const newstate = { ...state, locations: locs1, markers: new_markers };

            return newstate;
        case SEARCH_ID:
            if (action.payload.length > 0) {
                const filterText = state.markers.filter(createFilter(action.payload, ['gisid']))
                return { ...state, searchedItems: filterText };
            } else {
                return { ...state, searchedItems: [] };
            }
        case ALLOW_VIEW_DETAIL:
            state = {
                ...state, allowDrag: action.payload
            };
            return state;
    }
    return state;
}