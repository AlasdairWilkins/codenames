const words = require('./words');
const { blue, red } = require('./constants')

class Game {

    makeTeams(players, counts) {
        let blueCount = counts.blueCount
        let redCount = counts.redCount

        let order = this.shuffle(players.length);
        let max = Math.ceil(counts.total / 2);

        for (let i = 0; i < order.length; i++) {
            if (blueCount < max && redCount < max) {
                let color = (Math.random() < .5) ? blue : red;
                (color === blue) ? blueCount++ : redCount++
                players[order[i]].team = color;
            } else if (blueCount === max) {
                players[order[i]].team = red;
            } else {
                players[order[i]].team = blue;
            }
        }

        return players
    }

    shuffle(length, subset) {

        let arr = [];

        for (let i = 0; i < length; i++) {
            arr.push(i)
        }

        for (let i = arr.length - 1; (subset) ? i >= arr.length - subset : i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp
        }

        if (subset) {
            return arr.slice(arr.length - subset)
        }

        return arr

    }

    makeWords(num) {

        let arr = [];
        let cards = this.shuffle(words.length, num);
        let order = this.shuffle(num);

        let [first, second] = (Math.random() < .5) ? ['Blue', 'Red'] : ['Red',
        'Blue'];

        for (let i = 0; i < num; i++) {

            if (order[i] <= 8) {
                arr.push(new Word(words[cards[i]], first, i))
            } else if (9 <= order[i] && order[i] <= 16) {
                arr.push(new Word(words[cards[i]], second, i))
            } else if (order[i] === 17) {
                arr.push(new Word(words[cards[i]], 'Assassin', i))
            } else {
                arr.push(new Word(words[cards[i]], 'Decoy', i))
            }

        }

        console.log(arr)

        return [[arr.map(item => item.word),
            arr.map(item => item.value),
            arr.map(item => item.row),
            arr.map(item => item.column)],
            [arr.map(() => '?').join()]]
    }

};


class Word {
    constructor(word, value, index) {
        this.word = word;
        this.value = value
        this.row = Math.floor(index / 5)
        this.column = index % 5
    }
}

class Team {
    constructor() {
        this.players = [];
        this.codemaster = null
    }
}

module.exports = new Game()


