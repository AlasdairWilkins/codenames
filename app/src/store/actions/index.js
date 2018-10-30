//action types

export const SET_ID = "SET_ID";
export const SET_NSP = "SET_NSP";
export const SET_DISPLAY = "SET_DISPLAY"
export const SET_NAME = "SET_NAME"
export const SET_PLAYERS = "SET_PLAYERS"
export const SET_JOINING = "SET_JOINING"

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

export function setName(name) {
    return {type: SET_NAME, name}
}

export function setPlayers(players) {
    return {type: SET_PLAYERS, players}
}

export function setJoining(joining) {
    return {type: SET_JOINING, joining}
}