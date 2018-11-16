import {SET, CLEAR, UPDATE} from "../constants";

const initialState = {
    id: null
};

const rootReducer = (state = initialState, action) => {

    let header = Object.keys(action)[1]

    switch (action.type) {

        case "UPDATE_WORD":
            const row = state.words[action.row]
            const column = state.words[action.row][action.column]
            return { ...state,
                words: { ...state.words,
                    [action.row]: {...row,
                        [action.column]: action.value}}}

        case SET:
            return { ...state, [header]: action[header]}

        case CLEAR:
            return {...state, [action.header]: null}

        case UPDATE:
            return {...state, [header]: [...state[header], action[header]]}

        default:
            return state
    }

};


export default rootReducer