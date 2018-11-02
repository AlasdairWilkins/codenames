import {
    SET
} from "../actions";

const initialState = {
    id: null
};

const rootReducer = (state = initialState, action) => {

    switch (action.type) {

        case SET:
            let header = Object.keys(action)[1]
            return { ...state, [header]: action[header]}

        default:
            return state
    }
};

export default rootReducer