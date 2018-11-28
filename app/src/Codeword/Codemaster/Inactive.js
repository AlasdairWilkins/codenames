import React, { Component } from 'react';
import '../../App.css';
import {bindActionCreators} from "redux";
import {set} from "../../store/actions";
import connect from "react-redux/es/connect/connect";

class CodeWord extends Component {

    set() {
        return (
            <p>Waiting for the other Code Master!</p>
        )
    }

    render() {

        let display = this.set()

        return (
            display
        )

    }

}

const mapStateToProps = (state) => {
    return {
        codemaster: state.codemaster,
        remaining: state.remaining,
        team: state.team,
        turn: state.turn,
        codeword: state.codeword,
        number: state.number
    }
};

const mapDispatchToProps = dispatch => {
    return {
        set: bindActionCreators(set, dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CodeWord);

