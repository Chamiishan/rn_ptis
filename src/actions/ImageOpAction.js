import { FETCH_IMG, ADD_IMG_FRM_PROP } from "../utils/constants"


export const fetchImage = (fileName) => {
    return {
        type: FETCH_IMG,
        payload: fileName
    }
}