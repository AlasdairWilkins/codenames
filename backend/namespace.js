module.exports = class Namespace {

    constructor(io, gameCode) {

        let players = ['Ben', 'Aneliese', 'Ezra', 'Katherine']

        let address = "/" + gameCode

        let nsp = io.of(address)
        // console.log(nsp)

        nsp.on('connection', function(socket) {

            socket.on('players', () => {
                console.log("player request received!", players)
                socket.emit('players', players)
            })

            socket.on('newPlayer', player => {
                players.push(players)
            })


        })




    }

}