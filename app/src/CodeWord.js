import React, { Component } from 'react';
import './App.css';
import {bindActionCreators} from "redux";
import {set} from "./store/actions";
import connect from "react-redux/es/connect/connect";
import {api} from "./Api"

class CodeWord extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // code: null,
            // number: null,
            submitted: false
        };

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(event) {

        let codeword = event.target.elements.code.value;
        let number =  event.target.elements.number.options[event.target.elements.number.selectedIndex].value;
        // let msg = {code, number}

        api.set('codeword', {codeword, number});
        this.props.clear('words');
        api.get('game');


        this.setState({submitted: true});
        event.preventDefault()
    }

    activeCodeMaster() {
        if (this.props.codeword && this.props.number) {
            return (
                <p>The hint is '{this.props.codeword}' for {this.props.number} words.</p>
            )
        }

        let choices = [];

        for (let i = 0; i < this.props.remaining; i++) {
            choices.push(i + 1)
        }

        return (
            <form onSubmit={this.handleSubmit}>
                <label htmlFor="code">Code:</label>
                <input id="code" type="text" />
                <label htmlFor="number">Words:</label>
                <select id="number">
                    {choices.map((choice) =>
                        <option key={choice} value={choice}>{choice}</option>
                    )}
                </select>
                <input type="submit" value="Submit" />
            </form>

        )
    }

    inactiveCodeMaster() {
        return (
            <p>Waiting for the other Code Master!</p>
        )
    }

    activeTeam() {
        if (this.props.codeword && this.props.number) {
            return (
                <p>The hint is '{this.props.codeword}' for {this.props.number} words.</p>
            )
        }

        return (
            <p>Waiting for your Code Master!</p>
        )
    }

    inactiveTeam() {
        if (this.props.codeword && this.props.number) {
            return (
                <p>The other team's hint is '{this.props.codeword}' for {this.props.number} words.</p>
            )
        }
        return (
            <p>Sit tight!</p>
        )
    }

    setDisplay() {
        if (this.props.codemaster && this.props.team === this.props.turn) {
            return this.activeCodeMaster()
        }
        if (this.props.codemaster) {
            return this.inactiveCodeMaster()
        }
        if (this.props.team === this.props.turn) {
            return this.activeTeam()
        }
        return this.inactiveTeam()
    }

    render() {

        let codeWord = this.setDisplay();

        return (
            <div>
                {codeWord}
            </div>
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

