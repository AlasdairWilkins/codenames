import React, { Component } from 'react';
import './App.css';
import Board from './Board';
import CodeWord from './CodeWord';
import {api} from './Api';
import {bindActionCreators} from "redux";
import {set} from "./store/actions";
import connect from "react-redux/es/connect/connect";
import Loading from "./Loading";

class Game extends Component {

    componentDidMount() {
        api.get('game', (err, msg) => {
            this.props.set('words', msg)
        })

        api.get('turn', (err, msg) => {
            console.log(msg)
            this.props.set('turn', msg.turn)

            //testing only below
            this.props.set('team', msg.turn)

            if (msg.remaining) {
                this.props.set('remaining', msg.remaining)
            }
        })
    }

    set() {
        return (
            <div>
                <Board/>
                <div>
                    <CodeWord/>
                </div>
            </div>
        )
    }

    render() {

        let display = (this.props.words && this.props.turn) ? this.set() : <Loading/>

        return (
            display
        );
    }
}

const mapStateToProps = (state) => {
    return {
        words: state.words,
        turn: state.turn
    }
}

const mapDispatchToProps = dispatch => {
    return {
        set: bindActionCreators(set, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
