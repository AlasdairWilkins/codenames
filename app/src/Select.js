import React, { Component } from 'react';
import './App.css';
import store from './store/store'
import api from "./Api";

class Select extends Component {
    // constructor(props) {
    //     super(props)
    //
    //
    // }

    handleClick(event) {

        let currentTeam = event.target.parentNode.className
        let click = event.target.value
        if (currentTeam === 'blue' || currentTeam === 'red') {
            api.sendSelect(null)
        } else if (click === 'left') {
            api.sendSelect('blue')
        } else {
            api.sendSelect('red')
        }
    }

    setDisplay(players) {

        return players.map((player, i) => {

            if (player.socketID !== store.getState().id) {
                let className = (player.team) ? player.team : 'unsorted'
                return (
                    <div key={i} className={className}>{player.name}</div>
                )
            }

            if (player.team === 'blue') {
                return (
                    <div key={i} className='blue'>{player.name}<button onClick={this.handleClick} >&gt;</button></div>
                )
            } else if (player.team === 'red') {
                return (
                    <div key={i} className='red'><button onClick={this.handleClick} >&lt;</button>{player.name}</div>
                )
            } else {
                return (
                    <div key={i} className='unsorted'>
                        <button value="left" onClick={this.handleClick} >&lt;</button>
                        {player.name}
                        <button value="right" onClick={this.handleClick} >&gt;</button>
                    </div>
                )
            }
        })
    }

    render() {

        let select = this.setDisplay(this.props.players)


        return (
            <div id="select-container">
                <div className="row">
                    <div className="column">Blue Team</div>
                    <div className="column"><strong>Pick your team!</strong></div>
                    <div className="column">Red Team</div>
                </div>
                <div className="select">
                    {select}
                </div>
                <div>
                    <button>Click when ready!</button>
                    <button>Or pick my team at random!</button>
                </div>
            </div>
        )
    }
}

export default Select;