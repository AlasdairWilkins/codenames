module.exports = class Player {
    constructor(displayName, cookie, socketID) {
        this.name = displayName;
        this.cookie = cookie;
        this.socketID = socketID;
        this.ready = false;
        this.team = null
    }
};