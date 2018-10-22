module.exports = class Player {
    constructor(displayName, cookie, socketID) {
        console.log(socketID)
        this.name = displayName
        this.cookie = cookie
        this.socketID = socketID
        this.ready = false
    }


}