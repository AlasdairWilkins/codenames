import {SET, CLEAR, UPDATE} from "../constants"

export function set(header, id) {
    return {type: SET, [header]: id}
}

export function setWord(row, column, value) {
    return {type: "SET_WORD", row: row, column: column, value: value}
}

export function clear(id) {
    return {type: CLEAR, header: id}
}

export function update(header, payload) {
    return {type: UPDATE, [header]: payload}
}