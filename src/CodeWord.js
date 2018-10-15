import React, { Component } from 'react';
import './App.css';

class CodeWord extends Component {

    ActiveCodeMaster() {
        return (
            <form onSubmit={() => {alert("A code was submitted!")}}>
                <label>
                    Code:
                    <input type="text" />
                </label>
                <input type="submit" value="Submit" />
            </form>
        )
    }

    InactiveCodeMaster() {
        return (
            <text>Waiting for the other Code Master!</text>
        )
    }

    ActiveTeam() {
        return (
            <text>Waiting for your Code Master!</text>
        )
    }

    InactiveTeam() {
        return (
            <text>Sit tight!</text>
        )
    }

    render() {

        let codeWord

        if (this.props.codemaster && this.props.active) {
            codeWord = this.ActiveCodeMaster()
        } else if (this.props.codemaster) {
            codeWord = this.InactiveCodeMaster()
        } else if (this.props.active) {
            codeWord = this.ActiveTeam()
        } else {
            codeWord = this.InactiveTeam()
        }

        return (
            <div>
                {codeWord}
            </div>
            )

    }

}

export default CodeWord;
