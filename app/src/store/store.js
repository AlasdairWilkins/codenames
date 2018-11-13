import {createStore} from "redux";
import rootReducer from "./reducers";

const initialState =
    {
        display: null,
        players: [],
        codemaster: true
    }

const store = createStore(rootReducer, initialState);

export default store