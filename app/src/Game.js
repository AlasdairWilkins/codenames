import React, { Component } from 'react';
import './App.css';
import Board from './Board';
import Codeword from './Codeword';
import {api} from './Api';
import {bindActionCreators} from "redux";
import {set} from "./store/actions";
import connect from "react-redux/es/connect/connect";
import Loading from "./Loading";

class Game extends Component {

    componentDidMount() {

        api.receive('words', (err, msg) => {
            this.props.set('words', msg)
        });

        api.receive('team', (err, msg) => {
            this.props.set('team', msg)
        });

        api.receive('codemaster', (err, msg) => {
            this.props.set('codemaster', msg)
        });

        api.subscribe('active', (err, msg) => {
            console.log(msg)
        });

        api.subscribe('codeword', (err, msg) => {
            this.props.set('codeword', msg.codeword);
            this.props.set('number', msg.number)
        });

        api.request('gameInfo')


    }

    set() {

        return (
            <div>
                <Board/>
                <Codeword/>
            </div>
        )
    }

    render() {

        let display = (this.props.words && this.props.turn) ? this.set() : <Loading/>;

        return (
            display
        );
    }
}

const mapStateToProps = (state) => {
    return {
        words: state.words,
        turn: state.turn,
        codemaster: state.codemaster
    }
};

const mapDispatchToProps = dispatch => {
    return {
        set: bindActionCreators(set, dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
