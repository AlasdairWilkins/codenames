//action types

export const SET_ID = "SET_ID";
export const SET_NSP = "SET_NSP";
export const SET_DISPLAY = "SET_DISPLAY"

//action creators

export function setID(id) {
    return {type: SET_ID, id}
}

export function setNSP(nsp) {
    return {type: SET_NSP, nsp}
}

export function setDisplay(display) {
    return {type: SET_DISPLAY, display}
}