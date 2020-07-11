import {
    MAP_CHANGED, PROPERTY_SELECTED, OPEN_CLOSE_PANEL, FETCH_PROPERTY_DETAIL, FETCH_PROPERTY_SUCCESS, 
    FETCH_PROPERTY_FAIL, ALLOW_ANIMATE, ADD_PROPERTY_MARKER, SEARCH_ID, UPDATE_PROPERTY_MARKER, 
    ALLOW_VIEW_DETAIL, SHOW_HIDE_PROPERTY_MODAL, SELECTED_PROP_ARRAY
} from '../utils/constants';
import axios from 'axios';


export const mapChanged = ({ lat, lon }) => {
    return {
        type: MAP_CHANGED,
        payload: { lat, lon }
    }
}

export const propertySelect = (data) => {
    return {
        type: PROPERTY_SELECTED,
        payload: data
    }
}

export const selPropArray = (data) => {
    return {
        type: SELECTED_PROP_ARRAY,
        payload: data
    }
}

export const panelOpenStatus = (status) => {
    return {
        type: OPEN_CLOSE_PANEL,
        payload: status
    }
}

export const addPropertyMarker = (marker) => {
    return {
        type: ADD_PROPERTY_MARKER,
        payload: marker
    }
}

export const updatePropertyMarker = (marker) => {
    return {
        type: UPDATE_PROPERTY_MARKER,
        payload: marker
    }
}

export const searchId = (id) => {
    return {
        type: SEARCH_ID,
        payload: id
    }
}

export const showPropModal = (showhide) => {
    return{
        type: SHOW_HIDE_PROPERTY_MODAL, 
        payload: showhide
    }
}


export const allowAnimate = (animate) => {
    return {
        type: ALLOW_ANIMATE,
        payload: animate
    }
}

export const allowViewDetails = (allowDrag) => {
    return {
        type: ALLOW_VIEW_DETAIL,
        payload: allowDrag
    }
}

// Location IQ api for reverse geocoding
// TOKEN NO = ef765cafb676c5
// https://us1.locationiq.com/v1/reverse.php?key=<TOKEN NO>&lat=28.537480,&lon=77.398432&format=json

export const fetchProperty = () => {
    return (dispatch) => {
        dispatch({
            type: FETCH_PROPERTY_DETAIL
        });

        axios.get('http://13.235.156.167:1025/loginws_dev/rest/property_detail/fetchProperty')
            .then(response => {
                console.log(response.data.data);
                dispatch({
                    type: FETCH_PROPERTY_SUCCESS,
                    payload: response.data.data
                });
            })
            .catch(error => {
                dispatch({
                    type: FETCH_PROPERTY_FAIL
                })
            });
    }
}