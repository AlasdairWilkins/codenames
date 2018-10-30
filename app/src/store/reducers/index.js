import {
    SET_ID, SET_NSP, SET_DISPLAY, SET_NAME, SET_PLAYERS, SET_JOINING,
    SET_BLUE_MAX, SET_RED_MAX
} from "../actions";

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
        case SET_NAME:
            return { ...state, name: action.name }
        case SET_PLAYERS:
            return { ...state, players: action.players }
        case SET_JOINING:
            return { ...state, joining: action.joining }
        case SET_BLUE_MAX:
            return { ...state, blueMax: action.blueMax }
        case SET_RED_MAX:
            return { ...state, redMax: action.redMax }
        default:
            return state
    }
};

export default rootReducer