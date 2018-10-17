import React, { Component } from 'react';
import './App.css';

class Waiting extends Component {
    constructor(props) {
        super(props)

        this.state = {nameSubmitted: false}

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(event) {
        this.setState({nameSubmitted: true})
        this.props.onSubmit()
        event.preventDefault()
    }

    setDisplayName() {
        if (!this.state.nameSubmitted) {
            return (
                <div>
                    <p>Your game code is {this.props.gameCode}. Enter your name.</p>
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="name">
                            <input onChange={this.props.onChange} placeholder="Your name" type="text" />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            )
        }
        return (
            <div><p>Hi, {this.props.displayName}!</p></div>
        )

    }

    setDisplayPlayers(players) {
        if (!players.length || (this.state.nameSubmitted && players.length <= 1)) {
            return (
                <div>
                    <p>Waiting for other players to join!</p>
                </div>
            )
        }

        return (
            <div>
                {players.map((player) => <p key={player}>{player}</p>)}
            </div>
        )
    }

    render() {

        let waiting = this.setDisplayName()
        let players = this.setDisplayPlayers(this.props.players)
        return (
            <div>
                {waiting}
                {players}
            </div>
        )


    }

}

export default Waiting;