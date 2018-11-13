import React, { Component } from 'react';
import './App.css';
import {bindActionCreators} from "redux";
import {set, setWord } from "./store/actions";
import connect from "react-redux/es/connect/connect";
import {api} from "./Api";

class Square extends Component {

    handleClick() {
        api.set('word', {row: this.props.row, column: this.props.column}, (err, msg) => {
            console.log(msg)
            this.props.setWord(this.props.row, this.props.column, msg.type)
        })
    }

    set() {

        let onClick = (this.props.codemaster) ? null : () => this.handleClick()

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
        square: state.words[ownProps.row][ownProps.column],
        codemaster: state.codemaster
    }
}

const mapDispatchToProps = dispatch => {
    return {
        set: bindActionCreators(set, dispatch),
        setWord: bindActionCreators(setWord, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Square);
