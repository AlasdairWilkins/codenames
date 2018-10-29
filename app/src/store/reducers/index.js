import { SET_ID } from "../actions";

const initialState = {
    id: null
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ID:
            return { ...state, id: action.id };
        default:
            return state
    }
};

export default rootReducer