class Header {
    constructor(header) {
        this.header = header
    }

    get get() {
        return `${this.header}/get`
    }

    get post() {
        return `${this.header}/post`
    }

    get subscribe() {
        return `${this.header}/subscribe`
    }
}

export default Header