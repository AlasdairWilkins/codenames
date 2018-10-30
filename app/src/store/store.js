import {createStore} from "redux";
import rootReducer from "./reducers";

const initialState =
    {
        display: 'welcome'
    }

const store = createStore(rootReducer, initialState);

export default store