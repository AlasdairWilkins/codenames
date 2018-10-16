import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5000/');

function getGameCode(cb) {
    socket.on('newCode', code => {
        socket.off('newCode')
        cb(null, code)
    })
    socket.emit('newCode');
}

export { getGameCode }