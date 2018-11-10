import React, { Component } from 'react';
import './App.css';
import Board from './Board';
import CodeWord from './CodeWord';
import {api} from './Api';
import {bindActionCreators} from "redux";
import {clear, set} from "./store/actions";
import connect from "react-redux/es/connect/connect";

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
        api.get('game', (words) => {
            console.log(words)
        })
    }

    render() {

        let codemaster = this.state.codemaster;
        let active = this.state.active;
        let remaining = this.state.remaining;

        return (
            <div>
                <Board words={this.props.words} codemaster={codemaster} active={active} />
                <div>
                    <CodeWord codemaster={codemaster} active = {active} remaining = {remaining} />
                </div>
            </div>


        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        words: state.words
    }
}

const mapDispatchToProps = dispatch => {
    return {
        set: bindActionCreators(set, dispatch),
        clear: bindActionCreators(clear, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
