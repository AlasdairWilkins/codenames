import React, { Component } from 'react';
import './App.css';
import Square from './Square'

class Board extends Component {

    render() {

        let rows = split();
        let active = this.props.active;

        return (
            <div id="Board">{rows.map((row, index) =>
                <div className = "Row" key={rows.indexOf(row)}>
                    {row.map((column) =>
                        <Square key={index * 5 + column}  row={index} column={column} active={active}/>
                    )}
                </div>)}
            </div>
        );
    }

}


function split() {
    let rows = [];
    for (let i = 0; i < 5; i++) {
        rows[i] = [0, 1, 2, 3, 4]
    }
    return rows
}

export default Board;
