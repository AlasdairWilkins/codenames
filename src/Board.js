import React, { Component } from 'react';
import './App.css';
import Square from './Square'

class Board extends Component {

    render() {

        console.log("hi")

        let rows = split(this.props.words);
        let codemaster = this.props.codemaster;
        let active = this.props.active;

        return (
            <div id="Board">{rows.map((row) =>
                <div className = "Row" key={rows.indexOf(row)}>
                    {row.map((item) =>
                        <Square key={item.word} item = {item} codemaster = {codemaster} active = {active}  />
                    )}
                </div>)}
            </div>
        );
    }

}


function split(words) {
    let rows = []
    for (let i = 0; i < 5; i++) {
        rows.push(words.slice(i * 5, i * 5 + 5))
    }
    return rows
}

export default Board;
