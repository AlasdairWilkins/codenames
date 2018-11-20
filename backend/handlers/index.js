const chat = require('./chat');
const game = require('./game');
const gamecode = require('./gamecode');
const guess = require('./guess');
const namespace = require('./namespace');
const player = require('./player');
const ready = require('./ready');
const resume = require('./resume');
const session = require('./session');
const turn = require('./turn');
const words = require('./words')

module.exports =
    {...chat, ...game, ...gamecode, ...guess, ...namespace, ...player,
        ...ready, ...resume, ...session, ...turn, ...words};