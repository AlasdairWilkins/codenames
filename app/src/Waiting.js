import React, { Component } from 'react';

import './App.css';
import Pluralize from 'react-pluralize'

import Invite from './Waiting/Invite'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { setDisplay, setNSP, setName, setPlayers, setJoining } from "./store/actions";
import {api, player, ready} from "./Api";

class Waiting extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: null,
            ready: false,
        };

        api.get(player, (err, msg) => {
            this.props.setPlayers(msg.players)
            this.props.setJoining(msg.joining)
        })

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this)
    }

    handleSubmit(event) {
        api.set(player, {name: this.state.name, cookie: document.cookie})
        this.props.setName(this.state.name)
        event.preventDefault()
    }

    handleChange(event) {
        this.setState({name: event.target.value})
    }

    handleClick(event) {
        this.setState({ready: true});
        api.set(ready, document.cookie, (err) => this.props.setDisplay('select'));
        event.preventDefault()
    }

    setDisplayName() {
        if (!this.props.name) {
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
            <div><p>Hi, {this.props.name}!</p></div>
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
        let others = (this.props.name) ? total : total - 1;
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

        let waiting = this.setDisplayName();
        let players = this.setDisplayPlayers(this.props.players);
        let invite = (this.props.name) ? <Invite /> : null;
        let others = this.setDisplayOthers(this.props.players, this.props.joining);
        let ready = (this.props.name) ? this.setDisplayReady() : null;
        return (
            <div>
                {waiting}
                <p>Your game code is {this.props.code}</p>
                {players}
                {invite}
                {others}
                {ready}
            </div>
        )


    }

}


const mapStateToProps = (state, ownProps) => {
    return {
        code: state.nsp,
        name: state.name,
        players: state.players,
        joining: state.joining
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setDisplay: bindActionCreators(setDisplay, dispatch),
        setNSP: bindActionCreators(setNSP, dispatch),
        setName: bindActionCreators(setName, dispatch),
        setPlayers: bindActionCreators(setPlayers, dispatch),
        setJoining: bindActionCreators(setJoining, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Waiting);