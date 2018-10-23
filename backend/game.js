const words = require('./words')

module.exports = class Game {
    constructor(players) {
        this.words = this.makeWords(words, 25)
        this.teams = this.makeTeams(players)
    }

    makeTeams(players) {
        let teams ={'blue': new Team(), 'red': new Team()}
        let unsorted = []
        for (let i in players) {
            if (players[i].team === 'blue') {
                teams.blue.players.push(players[i])
            } else if (players[i].team === 'red') {
                teams.red.players.push(players[i])
            } else {
                unsorted.push(players[i])
            }
        }

        let order = this.shuffle(unsorted.length)

        let max = Math.ceil(players.length / 2)

        for (let i = 0; i < order.length; i++) {
            if (teams.blue.players.length < max && teams.red.players.length < max) {
                let color = (Math.random() < .5) ? "blue" : "red"
                unsorted[order[i]].team = color
                teams[color].players.push(unsorted[order[i]])
            } else if (teams.blue.players.length === max) {
                unsorted[order[i]].color = 'red'
                teams.red.players.push(unsorted[order[i]])
            } else {
                unsorted[order[i]].color = 'blue'
                teams.blue.players.push(unsorted[order[i]])
            }
        }

        return teams
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

    makeWords(words, num) {

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

}


class Word {
    constructor(word, value) {
        this.word = word;
        this.value = value
    }
}

class Team {
    constructor() {
        this.players = []
        this.codemaster = null
    }
}


