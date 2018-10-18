import React, { Component } from 'react';
import './App.css';
import Pluralize from 'react-pluralize'

class Waiting extends Component {
    constructor(props) {
        super(props)

        this.state = {entry: null}

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleSubmit(event) {
        this.props.onSubmit(this.state.entry)
        event.preventDefault()
    }

    handleChange(event) {
        this.setState({entry: event.target.value})
    }


    setDisplayName() {
        if (!this.props.displayName) {
            return (
                <div>
                    <p>Your game code is {this.props.gameCode}. Enter your name.</p>
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="name">
                            <input onChange={this.handleChange} placeholder="Your name" type="text" />
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
                {players.map((player) => <p key={player.name}>{player.name}</p>)}
            </div>
        )
    }

    setDisplayOthers(players, total) {
        let others = (this.state.nameSubmitted) ? total - players.length : total - players.length - 1
        if (others > 1) {
            return <div><Pluralize singular="other player" count={others}/> joining!</div>
        }
        return null
    }

    render() {

        let waiting = this.setDisplayName()
        let players = this.setDisplayPlayers(this.props.players)
        let others = this.setDisplayOthers(this.props.players, this.props.total)
        return (
            <div>
                {waiting}
                {players}
                {others}
            </div>
        )


    }

}

export default Waiting;