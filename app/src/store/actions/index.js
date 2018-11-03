//action types

export const SET = "SET";
export const CLEAR = "CLEAR";
// export const SET_ID = "SET_ID";
// export const SET_NSP = "SET_NSP";
// export const SET_DISPLAY = "SET_DISPLAY";
// export const SET_NAME = "SET_NAME";
// export const SET_PLAYERS = "SET_PLAYERS";
// export const SET_JOINING = "SET_JOINING";
// export const SET_BLUE_MAX = "SET_BLUE_MAX";
// export const SET_RED_MAX = "SET_RED_MAX";
// export const SET_TEAM = "SET_TEAM";

//action creators

export function set(header, id) {
    return {type: SET, [header]: id}
}

export function clear(id) {
    return {type: CLEAR, header: id}
}
//
// export function setID(id) {
//     return {type: SET, id}
// }
//
// export function setNSP(nsp) {
//     return {type: SET, nsp}
// }
//
// export function setDisplay(display) {
//     return {type: SET, display}
// }
//
// export function setName(name) {
//     return {type: SET, name}
// }
//
// export function setPlayers(players) {
//     return {type: SET, players}
// }
//
// export function setJoining(joining) {
//     return {type: SET, joining}
// }
//
// export function setBlueMax(blueMax) {
//     return {type: SET, blueMax}
// }
//
// export function setRedMax(redMax) {
//     return {type: SET, redMax}
// }
//
// export function setTeam(team) {
//     return {type: SET, team}
// }
