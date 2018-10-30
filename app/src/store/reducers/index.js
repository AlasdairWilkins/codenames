import { SET_ID, SET_NSP, SET_DISPLAY } from "../actions";

const initialState = {
    id: null
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ID:
            return { ...state, id: action.id };
        case SET_NSP:
            return { ...state, nsp: action.nsp };
        case SET_DISPLAY:
            return { ...state, display: action.display }
        default:
            return state
    }
};

export default rootReducer