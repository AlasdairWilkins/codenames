import React, { Component } from 'react';
import './App.css';
import {bindActionCreators} from "redux";
import {set, updateWord} from "./store/actions";
import connect from "react-redux/es/connect/connect";
import {api} from "./Api";

class Square extends Component {

    handleClick() {
        api.set('guess', this.props.square.word, (err, msg) => {
            this.props.updateWord(this.props.row, this.props.column, msg.type)
        })
    }

    set() {

        let onClick = (!this.props.codemaster && (this.props.team === this.props.turn)) ?
            () => this.handleClick() : null

        return (
            <div className={this.props.square.type} onClick={onClick}>{this.props.square.word}</div>
        )
    }


    render() {

        let display = this.set()

        return (
            display
        )

    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        codemaster: state.codemaster,
        square: state.words[ownProps.row][ownProps.column],
        team: state.team,
        turn: state.turn
    }
}

const mapDispatchToProps = dispatch => {
    return {
        set: bindActionCreators(set, dispatch),
        updateWord: bindActionCreators(updateWord, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Square);
