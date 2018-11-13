import React, { Component } from 'react';
import './App.css';
import {bindActionCreators} from "redux";
import {set} from "./store/actions";
import connect from "react-redux/es/connect/connect";

class CodeWord extends Component {

    constructor(props) {
        super(props);
        this.state = {
            code: '',
            number: 1,
            submitted: false
        };

        this.handleChangeCode = this.handleChangeCode.bind(this);
        this.handleChangeNumber = this.handleChangeNumber.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChangeCode(event) {
        this.setState({code: event.target.value})
    }

    handleChangeNumber(event) {
        this.setState({number: event.target.value})
    }

    handleSubmit(event) {
        this.setState({submitted: true});
        event.preventDefault()
    }

    activeCodeMaster() {
        if (this.state.submitted) {
            return (
                <p>The hint is '{this.state.code}' for {this.state.number} words.</p>
            )
        }

        let choices = new Array(this.props.remaining);

        for (let i = 0; i < choices.length; i++) {
            choices[i] = i + 1
        }

        return (
            <form onSubmit={this.handleSubmit}>
                <label htmlFor="code">
                    Code:
                    <input onChange={this.handleChangeCode} value={this.state.code} type="text" />
                </label>
                <label htmlFor="number">
                    Words:
                    <select onChange={this.handleChangeNumber} value={this.state.number}>
                        {choices.map((choice) =>
                            <option key={choice} value={choice}>{choice}</option>
                        )}
                    </select>
                </label>
                <input type="submit" value="Submit" />
            </form>

        )
    }

    inactiveCodeMaster() {
        return (
            <text>Waiting for the other Code Master!</text>
        )
    }

    activeTeam() {
        return (
            <text>Waiting for your Code Master!</text>
        )
    }

    inactiveTeam() {
        return (
            <text>Sit tight!</text>
        )
    }

    setDisplay() {
        if (this.props.codemaster && this.props.active) {
            return this.activeCodeMaster()
        }
        if (this.props.codemaster) {
            return this.inactiveCodeMaster()
        }
        if (this.props.active) {
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
        codemaster: state.codemaster
    }
}

const mapDispatchToProps = dispatch => {
    return {
        set: bindActionCreators(set, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CodeWord);

