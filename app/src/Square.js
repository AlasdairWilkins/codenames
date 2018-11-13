import React, { Component } from 'react';
import './App.css';
import {bindActionCreators} from "redux";
import {set} from "./store/actions";
import connect from "react-redux/es/connect/connect";

class Square extends Component {

    handleClick() {
        if (this.props.active) {
            alert(`This is ${this.props.square.type}.`)
        }
    }

    render() {

        let type = (this.props.codemaster) ? this.props.square.type : null;

        return <button className={type} onClick={() => this.handleClick()}>{this.props.square.word}</button>

    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        square: state.words[ownProps.row][ownProps.column]
    }
}

const mapDispatchToProps = dispatch => {
    return {
        set: bindActionCreators(set, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Square);
