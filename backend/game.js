const words = require('./words');

class Game {

    makeTeams(players) {
        let sorted = []
        let unsorted = [];
        let blue = 0
        let red = 0
        for (let i in players) {
            if (players[i].team === 'blue') {
                sorted.push(Object.assign({}, players[i]))
                blue++
            } else if (players[i].team === 'red') {
                sorted.push(Object.assign({}, players[i]))
                red++
            } else {
                unsorted.push(Object.assign({}, players[i]))
            }
        }

        let order = this.shuffle(unsorted.length);

        let max = Math.ceil(players.length / 2);

        for (let i = 0; i < order.length; i++) {
            if (blue < max && red < max) {
                let color = (Math.random() < .5) ? "blue" : "red";
                (color === 'blue') ? blue++ : red++
                unsorted[order[i]].team = color;
                sorted.push(unsorted[order[i]])
            } else if (blue === max) {
                unsorted[order[i]].color = 'red';
                sorted.push(unsorted[order[i]])
            } else {
                unsorted[order[i]].color = 'blue';
                sorted.push(unsorted[order[i]])
            }
        }

        return sorted
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


