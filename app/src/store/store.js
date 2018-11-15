import {createStore} from "redux";
import rootReducer from "./reducers";

const initialState =
    {
        display: null,
        players: [],
        codemaster: false
    }

const store = createStore(rootReducer, initialState);

export default store