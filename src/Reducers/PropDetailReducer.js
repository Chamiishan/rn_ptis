import {
    ADD_PROPERTY, CHANGE_PROPERTY_VALUE, CHANGE_TAX_VALUE, SAVE_INITIATED,
    ADD_IMG, REMOVE_IMG, FILE_UPLOADED, SELECTED_LOCATION, SAVE_DETAIL_SUCCESS, SAVE_DETAIL_FAILED,
    SAVE_DETAIL_PROGRESS, FILE_UPLOADED_FAILED, UPLOAD_IMG, RESET_VALUES, ADD_IMG_FRM_PROP, REMOVE_SERVER_IMG,
    ALLOW_ADD_LOCATION, IN_AREA_LOCS, CHANGE_LOCATION_VALUE, FETCH_ADDRESS_SUCCESS, FETCH_ADDRESS_FAIL,
    CHANGE_ADD_VALUE, FETCH_ALL_LOCATIONS_SUCCESS, FETCH_ALL_LOCATIONS_FAIL, ADD_LOCATION, ADD_LOCATION_SUCCESS,
    ADD_LOCATION_FAILURE,
    CHANGE_NEW_LOCATION_VALUE,
    SET_NEW_LOCATION_VALUE
} from '../utils/constants';
import Snackbar from 'react-native-snackbar';
// import PropertyDetail from '../Component/PropertyDetail';

const INITIAL_STATE = {
    propertyDetail: null,
    saveInit: false,
    imgArr: [],
    uploaded_img: null,
    allow_save: false,
    saving_details: false,
    details_saved: false,
    to_add_loc: false,
    fetched_locs: [],
    locations: [],
    fetched_add: null,
    new_cap_location: null
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

export default PropDetailReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case ADD_PROPERTY:
            return { ...state, propertyDetail: action.payload };
        case CHANGE_PROPERTY_VALUE:
            return { ...state, propertyDetail: { ...state.propertyDetail, [action.payload_one]: action.payload_two } };
        case CHANGE_TAX_VALUE:
            state = { ...state, propertyDetail: { ...state.propertyDetail, propertyTax: { ...state.propertyDetail.propertyTax, [action.payload_one]: action.payload_two } } };
            return state;
        case ADD_LOCATION:
            return state;
        case CHANGE_LOCATION_VALUE:
            state = { ...state, propertyDetail: { ...state.propertyDetail, cap_location: { ...state.propertyDetail.cap_location, [action.payload_one]: action.payload_two } } };
            return state;
        case CHANGE_NEW_LOCATION_VALUE:
            state = { ...state, new_cap_location: { ...state.new_cap_location, [action.payload_one]: action.payload_two } };
            return state;
        case SET_NEW_LOCATION_VALUE:
            state = { ...state, new_cap_location: action.payload } ;
            return state;
        case SAVE_INITIATED:
            return { ...state, saveInit: action.payload };
        case SELECTED_LOCATION:
            return {
                ...state, propertyDetail: {
                    ...state.propertyDetail, latitude: action.payload.latitude,
                    longitude: action.payload.longitude
                }
            };
        case ADD_IMG:
            return {
                ...state, imgArr: state.imgArr.concat({
                    key: state.imgArr.length + 1,
                    uri: action.payload.uri,
                    // data: action.payload.data,
                    path: action.payload.path,
                    fileName: action.payload.fileName,
                    upload_status: action.payload.upload_status
                })
            }
        case REMOVE_IMG:
            return {
                ...state, imgArr: state.imgArr.filter(function (ele) {
                    return ele != action.payload;
                })
            }
        case REMOVE_SERVER_IMG:
            const imageNameArr = state.propertyDetail.images.split(",");
            newstate4 = {
                ...state, propertyDetail: {
                    ...state.propertyDetail, images: ''
                }
            }

            imageNameArr.map((imgname) => {
                if (imgname.trim() !== action.payload.trim()) {
                    if (newstate4.propertyDetail.images.length == 0)
                        newstate4 = {
                            ...newstate4, propertyDetail: { ...newstate4.propertyDetail, images: imgname }
                        }
                    else
                        newstate4 = {
                            ...newstate4, propertyDetail: { ...newstate4.propertyDetail, images: (newstate4.propertyDetail.images + ", " + imgname) }
                        }
                }
            });
            return newstate4;
        case UPLOAD_IMG:
            const newstate1 = {
                ...state, imageArr: state.imgArr.map((item) => {
                    if (item.fileName === action.payload.fileName) {
                        return { ...item, upload_status: "uploading" }
                    }

                    return item;
                })
            }
            return { ...state, imgArr: newstate1.imageArr };
        case FILE_UPLOADED_FAILED:
            const newstate2 = {
                ...state, imageArr: state.imgArr.map((item) => {
                    if (item.fileName === action.payload.fileName) {
                        return { ...item, upload_status: "not_uploaded" }
                    }

                    return item;
                })
            }
            return { ...state, imgArr: newstate2.imageArr };

        case FILE_UPLOADED:
            console.log("file uploaded");
            const newstate3 = {
                ...state, imageArr: state.imgArr.map((item) => {
                    if (item.fileName === action.payload.fileName) {
                        const tmpState = { ...item, upload_status: "uploaded" };
                        console.log("file uploaded item", item);
                        return tmpState;
                    }
                    return item;
                })
            }

            return { ...state, imgArr: newstate3.imageArr };
        case SAVE_DETAIL_PROGRESS:
            return { ...state, saving_details: true };
        case SAVE_DETAIL_SUCCESS:
            if (action.payload.data.result.toUpperCase() === 'success'.toUpperCase()) {
                state = { ...state, saving_details: false, details_saved: true, propertyDetail: { ...state.propertyDetail, gisid: action.payload.data.data[0].gisid }, imgArr: [] };
            } else {
                // Snackbar.show({
                //     title: 'Details could not be saved',
                //     duration: Snackbar.LENGTH_LONG,
                //     color: '#fff',
                //     backgroundColor: '#000'
                // });
                state = {
                    ...state, saving_details: false, details_saved: false
                };
            }
            return state;
        case SAVE_DETAIL_FAILED:
            Snackbar.show({
                title: 'Details could not be saved',
                duration: Snackbar.LENGTH_LONG,
                color: '#fff',
                backgroundColor: '#000'
            });
            return { ...state, saving_details: false, details_saved: false };
        case RESET_VALUES:
            return { ...state, details_saved: false, saveInit: false, imgArr: [], new_cap_location: null };
        case ALLOW_ADD_LOCATION:
            return { ...state, to_add_loc: action.payload };
        case FETCH_ALL_LOCATIONS_FAIL:
            return state;
        case FETCH_ALL_LOCATIONS_SUCCESS:
            return { ...state, fetched_locs: action.payload };
        case IN_AREA_LOCS:
            if (state.fetched_locs.length == 0 || action.payload.loc_latitude == null) {
                return state;
            }
            const location = action.payload;
            const newstate4 = {
                ...state, locations: state.fetched_locs.filter(function (item) {
                    const dist = getDistanceFromLatLonInKm(location.loc_latitude, location.loc_longitude,
                        item.loc_latitude, item.loc_longitude);
                    if (dist < 1) {
                        return item;
                    }
                })
            }
            return newstate4;
        // return { ...state, locations: action.payload };
        case ADD_IMG_FRM_PROP:
            return {
                ...state, imgArr: state.imgArr.concat({
                    key: state.imgArr.length + 1,
                    uri: action.payload.uri,
                    path: action.payload.path,
                    fileName: action.payload.fileName,
                    upload_status: action.payload.upload_status
                })
            }
        case FETCH_ADDRESS_SUCCESS:
            return state = { ...state, fetched_add: action.payload };
        case FETCH_ADDRESS_FAIL:
            // console.log("Address fetch fail");
            return state;
        case CHANGE_ADD_VALUE:
            return state = { ...state, fetched_add: { ...state.fetched_add, display_name: action.payload } };
        case ADD_LOCATION_SUCCESS:
            if (action.payload.data.result === "success") {
                return state = {
                    ...state, fetched_locs: state.fetched_locs.concat(
                        action.payload.data.data[0]
                    ), locations: state.locations.concat(
                        action.payload.data.data[0]
                    ), to_add_loc: false
                };
            } else {
                return { ...state, to_add_loc: false };
            }
        case ADD_LOCATION_FAILURE:
            return state;
    };
    return state;
}