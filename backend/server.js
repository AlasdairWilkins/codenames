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

io.on('connection', (client) => {
    client.on('subscribeToTimer', (interval) => {
        console.log('client is subscribing to timer with interval ', interval);
        setInterval(() => {
            client.emit('timer', new Date());
        }, interval);
    });
})

const port = 5000;
io.listen(port);
console.log('Listening on port', port);