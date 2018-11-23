import React, { Component } from 'react';

import '../App.css';

import Invite from './Invite'
import Others from './Others'
import Players from './Players'
import Name from './Name'
import Ready from './Ready'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { set, clear } from "../store/actions";
import {api} from "../Api";
import {player} from "../constants";
import Loading from "../Loading";

class Waiting extends Component {

    componentDidMount() {

        api.subscribe('players', (err, players) => {
            if (err) {
                console.log(err)
            } else {
                console.log("players received", players)
                this.props.set('players', players)
            }
        })

        api.subscribe('joining', (err, joining) => {
            if (err) {
                console.log(err)
            } else {
                console.log("Joining received", joining)
                this.props.set('joining', joining)
            }
        })

    }

    componentWillUnmount() {
        this.props.clear('players');
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

        let display = (this.props.players) ? this.set() : <Loading/>;

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
};

const mapDispatchToProps = dispatch => {
    return {
        set: bindActionCreators(set, dispatch),
        clear: bindActionCreators(clear, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Waiting);