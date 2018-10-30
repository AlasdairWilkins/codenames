import React, { Component } from 'react';
import { connect } from 'react-redux'
import './App.css';
import store from './store/store';
import {api, select} from "./Api";

class Select extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ready: false
        }

        // api.get(select, (err, players) => this.setState({players: players}))

    }

    handleClick(event) {

        let currentTeam = event.target.parentNode.className;
        let click = event.target.value;
        if (currentTeam === 'blue' || currentTeam === 'red') {
            api.set(select, null)
        } else if (click === 'left') {
            api.set(select, 'blue')
        } else {
            api.set(select, 'red')
        }
    }

    setDisplay(players) {

        return players.map((player, i) => {

            if (player.socketID !== store.getState().id || this.state.ready) {
                let className = player.team;
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
                let leftButton = (this.props.blueMax) ? null: <button value="left" onClick={this.handleClick} >&lt;</button>
                let rightButton = (this.props.redMax) ? null: <button value="right" onClick={this.handleClick} >&gt;</button>
                return (
                    <div key={i}>
                        {leftButton}
                        {player.name}
                        {rightButton}
                    </div>
                )
            }
        })
    }

    render() {

        let select = this.setDisplay(this.props.players);
        let buttons = (!this.state.ready) ?
            <div>
                <p>Choose your team, or leave your name in the middle to be randomly assigned!</p>
                <p><button onClick={() => {
                    this.setState({ready: true})
                    this.props.handleClickSelect()}}
                >Click when ready!</button></p>
            </div>
            :
            <div><p>Great! We're starting soon.</p></div>
        let blueMax = (this.props.blueMax) ? <p>Blue team is full!</p> : null
        let redMax = (this.props.redMax) ? <p>Red team is full!</p> : null

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
                {buttons}
                <div>
                    {blueMax}
                    {redMax}
                </div>
            </div>
        )
    }
}

export default Select