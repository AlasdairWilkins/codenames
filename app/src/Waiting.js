import React, { Component } from 'react';

import './App.css';

import Invite from './Waiting/Invite'
import Others from './Waiting/Others'
import Players from './Waiting/Players'
import Name from './Waiting/Name'
import Ready from './Waiting/Ready'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { set, clear } from "./store/actions";
import {api} from "./Api";
import {player} from "./constants";
import Loading from "./Loading";

class Waiting extends Component {

    componentDidMount() {
        api.get(player, (err, msg) => {
            this.props.set('players', msg.players)
            this.props.set('joining', msg.joining)
            if (msg.name) {
                this.props.set('name', msg.name)
                this.props.set('display', 'waiting')
            }
        })
    }

    componentWillUnmount() {
        this.props.clear('players')
        api.socket.off(player)
    }

    set() {
        return (
            <div>
                <Name />
                <p>Your game code is {this.props.code}</p>
                <Players />
                <Invite />
                <Others />
                <Ready />
            </div>
        )
    }

    render() {

        let display = (this.props.players) ? this.set() : <Loading/>

        return (
            display
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
        set: bindActionCreators(set, dispatch),
        clear: bindActionCreators(clear, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Waiting);