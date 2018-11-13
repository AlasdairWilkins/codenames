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
    constructor(props) {
        super(props);

        this.state = {
            codemaster: true,
            active: true,
            remaining: 8,
        }
    }

    componentDidMount() {
        api.get('game', (err, msg) => {
            console.log(msg)
            this.props.set('words', msg)
            // this.props.set('words', msg)
        })
    }

    set() {

        let codemaster = this.state.codemaster;
        let active = this.state.active;
        let remaining = this.state.remaining;

        return (
            <div>
                <Board codemaster={codemaster} active={active} />
                <div>
                    <CodeWord codemaster={codemaster} active = {active} remaining = {remaining} />
                </div>
            </div>
        )
    }

    render() {

        let display =
            (this.props.words) ? this.set() :
                <Loading/>

        return (
            display
        );
    }
}

const mapStateToProps = (state) => {
    return {
        words: state.words
    }
}

const mapDispatchToProps = dispatch => {
    return {
        set: bindActionCreators(set, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
