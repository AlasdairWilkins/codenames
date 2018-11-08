import {SET, CLEAR} from "../../constants"

export function set(header, id) {
    return {type: SET, [header]: id}
}

export function clear(id) {
    return {type: CLEAR, header: id}
}