// const express = require('express');
//
// const app = express();
// const port = process.env.PORT || 5000;
//
// app.get('/api/hello', (req, res) => {
//     res.send({ express: 'Hello From Express' });
// });
//
// app.listen(port, () => console.log(`Listening on port ${port}`));

const io = require('socket.io')();
const shortid = require('shortid')

io.on('connection', function(socket) {

    socket.on('newCode', function() {
        console.log("Request received!")
        let gameCode = shortid.generate()
        console.log(gameCode)
        socket.emit('newCode', gameCode)
    })

})

const port = 5000;
io.listen(port);
console.log('Listening on port', port);