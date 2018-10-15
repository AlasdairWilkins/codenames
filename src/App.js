import React, { Component } from 'react';
import './App.css';
import Board from './Board'
import CodeWord from './CodeWord'

class App extends Component {
    constructor(props) {
        super(props);

        const words = ["utopian", "look", "polite", "wicked", "advice", "curtain", "tramp", "bad", "fabulous", "wool",
            "jog", "apologise", "heavy", "nest", "heat", "debt", "roof", "whole", "arithmetic", "bear", "ski",
            "beginner", "jam", "yell", "attract"];

        let first = (Math.random() <= .5) ? "Red" : "Blue"

        this.state = {
            words: colorCode(words, first),
            codemaster: true,
            active: false
        }
    }




    render() {

        let codemaster = this.state.codemaster
        let active = this.state.active

        return (
            <div>
                <Board words={this.state.words} codemaster={codemaster} active={active} />
                <div>
                    <CodeWord codemaster={codemaster} active = {active} />
                </div>
            </div>


        );
    }
}

class Word {
    constructor(word, value) {
        this.word = word;
        this.value = value
    }
}

function colorCode(words, first) {

    let list = []
    let order = shuffle(25)

    let second = (first === "Red") ? "Blue" : "Red"


    for (let i = 0; i < words.length; i++) {

        if (order[i] <= 9) {
            list.push(new Word(words[i], first))
        } else if (10 <= order[i] && order[i] <= 17) {
            list.push(new Word(words[i], second))
        } else if (order[i] === 18) {
            list.push(new Word(words[i], "Assassin"))
        } else {
            list.push(new Word(words[i], "Decoy"))
        }

    }

    return list
}

function shuffle(length) {
    let array = []

    for (let i = 1; i <= length; i++) {
        array.push(i)
    }

    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }

    return array
}

export default App;
