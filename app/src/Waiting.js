import React, { Component } from 'react';
import './App.css';
import Pluralize from 'react-pluralize'

import Invite from './Waiting/Invite'

class Waiting extends Component {
    constructor(props) {
        super(props)

        this.state = {
            entry: null,
            ready: false,
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    handleSubmit(event) {
        this.props.onSubmit(this.state.entry)
        event.preventDefault()
    }

    handleChange(event) {
        this.setState({entry: event.target.value})
    }

    handleClick(event) {
        this.setState({ready: true})
        this.props.handleReady()
        event.preventDefault()
    }

    setDisplayName() {
        if (!this.props.displayName) {
            return (
                <div>
                    <p>Please enter your name.</p>
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
                Here's who's playing: {players.map((player, i) => {
                if (i === players.length - 1) {
                    return player.name
                }
                return player.name + ", "
            })}
            </div>
        )
    }

    setDisplayOthers(players, total) {
        let others = (this.props.displayName) ? total - players.length : total - players.length - 1
        if (others > 0) {
            return <div><p><Pluralize singular="other player" count={others}/> joining!</p></div>
        }
        return null
    }

    setDisplayReady() {
        if (!this.state.ready) {
            return <p id="ready"><button onClick={this.handleClick}>Press this when everyone is ready to play!</button></p>
        }
        return <p id="ready">Great! We'll be starting soon.</p>
    }

    render() {

        let waiting = this.setDisplayName()
        let players = this.setDisplayPlayers(this.props.players)
        let invite = (this.props.displayName) ? <Invite /> : null
        let others = this.setDisplayOthers(this.props.players, this.props.total)
        let ready = (this.props.displayName) ? this.setDisplayReady() : null
        return (
            <div>
                {waiting}
                <p>Your game code is {this.props.gameCode}</p>
                {players}
                {invite}
                {others}
                {ready}
            </div>
        )


    }

}

export default Waiting;