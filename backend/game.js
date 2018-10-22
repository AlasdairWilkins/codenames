const words = require('./words')

module.exports = class Game {
    constructor() {
        this.players = ['Ben', 'Aneliese', 'Ezra', 'Katherine']
        this.words = this.create(words, 25)
    }

    create(words, num) {

        let arr = []
        let cards = this.shuffle(words.length, num)
        let order = this.shuffle(num)

        let [first, second] = (Math.random() < .5) ? ['Blue', 'Red'] : ['Red',
        'Blue']

        for (let i = 0; i < num; i++) {

            if (order[i] <= 8) {
                arr.push(new Word(words[cards[i]], first))
            } else if (9 <= order[i] && order[i] <= 16) {
                arr.push(new Word(words[cards[i]], second))
            } else if (order[i] === 17) {
                arr.push(new Word(words[cards[i]], 'Assassin'))
            } else {
                arr.push(new Word(words[cards[i]], 'Decoy'))
            }

        }

        return arr
    }

    shuffle(length, subset) {

        let arr = []

        for (let i = 0; i < length; i++) {
            arr.push(i)
        }

        for (let i = arr.length - 1; (subset) ? i >= arr.length - subset : i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1))
            let temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
        }

        if (subset) {
            return arr.slice(arr.length - subset)
        }

        return arr

    }
}


class Word {
    constructor(word, value) {
        this.word = word;
        this.value = value
    }
}


