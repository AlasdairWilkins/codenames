import React, { Component } from 'react';
import './App.css';
import Pluralize from 'react-pluralize'

class Waiting extends Component {
    constructor(props) {
        super(props)

        this.state = {
            entry: null,
            ready: false,
            invites: [""]
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleChangeInvite = this.handleChangeInvite.bind(this)
        this.handleClickInvitePlus = this.handleClickInvitePlus.bind(this)
        this.handleClickInviteMinus = this.handleClickInviteMinus.bind(this)
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

    handleClickInvitePlus(event) {
        console.log(event.target.getAttribute('i'))
        let invites = this.state.invites
        if (!invites.length) {
            invites.push("")
        }
        invites.push("")
        this.setState({invites: invites})
    }

    handleClickInviteMinus(event) {
        let invites = this.state.invites
        let lastBlank = this.findLastBlank(invites)
        console.log(lastBlank)
        invites.splice(lastBlank, 1)
        console.log(invites)
        this.setState({invites: invites})
    }

    findLastBlank(invites) {
        console.log(invites)
        for (let i = invites.length - 1; 0 <= i; i-- ) {
            console.log(invites[i])
            if (!invites[i].length) {
                console.log("hey hey")
                return [i]
            }
        }
        console.log('ahoy hoy')
        return invites.length - 1
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

        let inputs = invites.map((invite, i) => {
            let input = this.setDisplayInviteInput(invite, i)
            let button = this.setDisplayInviteButton(i, invites)
            return (
                <div key={i}>
                    {input}
                    {button}
                </div>
            )
        })
        return (
            <div>
                <p>Invite others to join!</p>
                {inputs}
                <button>Click to send invitations!</button>
            </div>

        )

    }

    setDisplayInviteInput(invite, i) {

        let value = (invite.length) ? this.state.invites[i] : null

        return <input
            i={i}
            placeholder="Enter email address"
            value={value}
            onChange={this.handleChangeInvite}
            type="text" />
    }

    setDisplayInviteButton(i, invites) {
        if (i === 0) {
            return <button i={i} onClick={this.handleClickInvitePlus}>+</button>
        }
        if (i === invites.length - 1) {
            return <button i={i} onClick={this.handleClickInviteMinus}>-</button>
        }
        return null
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

        console.log(this.state.invites)

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