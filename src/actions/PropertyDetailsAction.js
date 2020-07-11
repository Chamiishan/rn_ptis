import {
    ADD_PROPERTY, CHANGE_PROPERTY_VALUE, CHANGE_TAX_VALUE, SAVE_INITIATED, ADD_IMG,
    REMOVE_IMG, UPLOAD_IMG, FILE_UPLOADED, FILE_UPLOADED_FAILED, SELECTED_LOCATION,
    SAVE_DETAIL_SUCCESS, SAVE_DETAIL_FAILED, SAVE_DETAIL_PROGRESS, RESET_VALUES, ADD_IMG_FRM_PROP,
    REMOVE_SERVER_IMG, ALLOW_ADD_LOCATION, IN_AREA_LOCS, CHANGE_LOCATION_VALUE, FETCH_ADDRESS_SUCCESS,
    FETCH_ADDRESS_FAIL, CHANGE_ADD_VALUE, FETCH_ALL_LOCATIONS_SUCCESS, FETCH_ALL_LOCATIONS_FAIL, ADD_LOCATION_SUCCESS, ADD_LOCATION_FAILURE, CHANGE_NEW_LOCATION_VALUE, SET_NEW_LOCATION_VALUE
} from '../utils/constants'
import axios from 'axios';
import RNFS from "react-native-fs";

export const allowAddLocation = (to_add_loc) => {
    return {
        type: ALLOW_ADD_LOCATION,
        payload: to_add_loc
    }
}

export const addLocation = (loc_detail) => {

    const url = "http://13.235.156.167:1025/loginws_dev/rest/property_detail/addLocation";
    const headers = {
        'Content-Type': 'application/json'
    }
    const data = {
        loc_country: loc_detail.address.country,
        loc_address: loc_detail.display_name,
        loc_city: loc_detail.address.state_district,
        loc_state: loc_detail.address.state,
        loc_latitude: loc_detail.lat,
        loc_longitude: loc_detail.lon
    }

    return (dispatch) => {
        axios.post(url, data, { headers: headers })
            .then(response => {
                dispatch({
                    type: ADD_LOCATION_SUCCESS,
                    payload: response
                });
            })
            .catch(error => {
                dispatch({
                    type: ADD_LOCATION_FAILURE,
                    payload: error
                })
            });
    }

}

export const addProperty = (property) => {
    return {
        type: ADD_PROPERTY,
        payload: property
    }
}

export const addImgFrmProp = (property) => {
    return {
        type: ADD_IMG_FRM_PROP,
        payload: property
    }
}

export const changePropValue = ({ key, value }) => {
    return {
        type: CHANGE_PROPERTY_VALUE,
        payload_one: key,
        payload_two: value
    }
}

export const changeAddValue = (value) => {
    return {
        type: CHANGE_ADD_VALUE,
        payload: value
    }
}

export const changeTaxValue = ({ key, value }) => {
    return {
        type: CHANGE_TAX_VALUE,
        payload_one: key,
        payload_two: value
    }
}

export const changeLocValue = ({ key, value }) => {
    return {
        type: CHANGE_LOCATION_VALUE,
        payload_one: key,
        payload_two: value
    }
}

export const setNewLocValue = (value) => {
    return {
        type: SET_NEW_LOCATION_VALUE,
        payload: value
    }
}

export const changeNewLocValue = ({ key, value }) => {
    return {
        type: CHANGE_NEW_LOCATION_VALUE,
        payload_one: key,
        payload_two: value
    }
}

export const saveInitiated = (init) => {
    return {
        type: SAVE_INITIATED,
        payload: init
    }
}

export const setSelMarker = (location) => {
    return {
        type: SELECTED_LOCATION,
        payload: location
    }
}

export const resetValues = () => {
    return {
        type: RESET_VALUES
    }
}

export const get_in_area_locs = (curr_location) => {
    return {
        type: IN_AREA_LOCS,
        payload: curr_location
    }
}

export const fetchAddress = (location) => {

    const url = "https://us1.locationiq.com/v1/reverse.php?key=ef765cafb676c5&lat=" + location.latitude + "&lon=" + location.longitude + "&format=json";

    return (dispatch) => {
        axios.get(url)
            .then(response => {
                dispatch({
                    type: FETCH_ADDRESS_SUCCESS,
                    payload: response.data
                });
            })
            .catch(error => {
                dispatch({
                    type: FETCH_ADDRESS_FAIL,
                    payload: error
                })
            });
    }
}

export const fetchLocs = () => {

    return (dispatch) => {
        axios.get('http://13.235.156.167:1025/loginws_dev/rest/property_detail/fetchAllLocs',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                dispatch({
                    type: FETCH_ALL_LOCATIONS_SUCCESS,
                    payload: response.data.data
                });
            })
            .catch(error => {
                console.log("fetch all locations failure ", error);
                dispatch({
                    type: FETCH_ALL_LOCATIONS_FAIL,
                    payload: error
                })
            });
    }
}

export const saveDetail = (property) => {
    return (dispatch) => {

        dispatch({
            type: SAVE_DETAIL_PROGRESS
        });

        // console.log("Saving details: ", property.property.gisid);

        if (property.property.gisid) {

            // console.log("updating property", {
            //     "property": property,
            //     "imgArr": imgArr
            // });

            axios.post('http://13.235.156.167:1025/loginws_dev/rest/property_detail/updateProperty',
                property,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    console.log("property detail send success ", response);
                    dispatch({
                        type: SAVE_DETAIL_SUCCESS,
                        payload: response
                    });
                })
                .catch(error => {
                    console.log("property detail send failure ", error);
                    dispatch({
                        type: SAVE_DETAIL_FAILED,
                        payload: error
                    })
                });

        } else {
            console.log("inserting property");

            axios.post('http://13.235.156.167:1025/loginws_dev/rest/property_detail/saveProperty', property, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
                .then(response => {
                    console.log("property detail send success: ", response);
                    dispatch({
                        type: SAVE_DETAIL_SUCCESS,
                        payload: response
                    });
                })
                .catch(error => {
                    console.log("property detail send failure ", error);
                    dispatch({
                        type: SAVE_DETAIL_FAILED,
                        payload: error
                    })
                });
        }
    }
}

export const addImg = (img) => {
    return {
        type: ADD_IMG,
        payload: img
    }
}

export const remImg = (img) => {
    return {
        type: REMOVE_IMG,
        payload: img
    }
}

export const remServerImg = (img) => {
    return {
        type: REMOVE_SERVER_IMG,
        payload: img
    }
}

export const uploadImg = (img) => {
    return (dispatch) => {

        RNFS.readFile(img.path, 'base64')
            .then(res => {
                const imgdetail = { "name": img.fileName, "img": res };

                dispatch({
                    type: UPLOAD_IMG,
                    payload: img
                });

                axios.post('http://13.235.156.167:1025/loginws_dev/rest/property_detail/updateMyProfile', imgdetail, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })
                    .then(response => {
                        console.log("file upload success", response);
                        dispatch({
                            type: FILE_UPLOADED,
                            payload: img
                        });
                    })
                    .catch(error => {
                        console.log("file upload failure", error);
                        dispatch({
                            type: FILE_UPLOADED_FAILED,
                            payload: img
                        })
                    });

            })
    }
}