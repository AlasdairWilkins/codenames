import React, { Component } from 'react';
import { connect } from 'react-redux'
import './App.css';
import store from './store/store';
import {api, player, ready, select} from "./Api";
import {bindActionCreators} from "redux";
import {set, clear} from "./store/actions";

class Select extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ready: false
        }

        api.socket.off(player)
        api.get(select, (err, msg) => {
            this.props.set('players', msg.players)
            this.props.set('blueMax', msg.blueMax)
            this.props.set('redMax', msg.redMax)
        })

        this.handleClick = this.handleClick.bind(this)

    }

    handleClick(event) {

        if (event.target.value === "ready") {

            this.setState({ready: true})
            api.set(ready, 'selectReady', (err) => {
                api.get('team', (err, msg) => {
                    this.props.set('team', msg.team)
                    this.props.set('display', 'game')
                })
            });
            this.props.clear('display')

        } else {

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
                <p><button value="ready" onClick={this.handleClick}>Click when ready!</button></p>
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

const mapStateToProps = (state, ownProps) => {
    return {
        players: state.players,
        blueMax: state.blueMax,
        redMax: state.redMax
    }
}

const mapDispatchToProps = dispatch => {
    return {
        set: bindActionCreators(set, dispatch),
        clear: bindActionCreators(clear, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Select);