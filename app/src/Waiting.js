import React, { Component } from 'react';
import './App.css';
import Pluralize from 'react-pluralize'

class Waiting extends Component {
    constructor(props) {
        super(props)

        this.state = {
            entry: null,
            ready: false,
            invites: []
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleChangeInvite = this.handleChangeInvite.bind(this)
        this.handleClickInvite = this.handleClickInvite.bind(this)
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
        this.props.api.sendReady()
        event.preventDefault()
    }

    handleChangeInvite(event) {
        let index = event.target.getAttribute('i')
        let invites = this.state.invites
        if (invites.length === index) {
            invites.push(event.target.value)
        } else {
            invites[index] = event.target.value
        }
        this.setState({invites: invites})
    }

    handleClickInvite(event) {
        console.log(event.target.getAttribute('i'))
        let invites = this.state.invites
        if (!invites.length) {
            invites.push("")
        }
        invites.push("")
        this.setState({invites: invites})
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

    setDisplayInvites(invites) {

        let inputs = (invites.length) ?
            invites.map((invite, i) => this.setDisplayInviteInput(i)) :
            this.setDisplayInviteInput()

        return (
            <div>
                <form>
                    {inputs}
                </form>
            </div>
        )
    }

    setDisplayInviteInput(i) {
        let key = (i) ? i : 0
        return <div key={key}>
            <input
                i={key}
                placeholder="Enter email address"
                onChange={this.handleChangeInvite}
                type="text" />
            <button i={key} onClick={this.handleClickInvite}>+</button>
        </div>
    }

    setDisplayOthers(players, total) {
        let others = (this.state.nameSubmitted) ? total - players.length : total - players.length - 1
        if (others > 1) {
            return <div><Pluralize singular="other player" count={others}/> joining!</div>
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
        let invite = (this.props.displayName) ? this.setDisplayInvites(this.state.invites) : null
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