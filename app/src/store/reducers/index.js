import {SET, CLEAR} from "../../constants";

const initialState = {
    id: null
};

const rootReducer = (state = initialState, action) => {

    switch (action.type) {

        case SET:
            let header = Object.keys(action)[1]
            return { ...state, [header]: action[header]}

        case CLEAR:
            return {...state, [action.header]: null}

        case "UPDATE_MESSAGES":
            return {...state, messages: [...state.messages, action.message]}

        default:
            return state
    }

};

export default rootReducer