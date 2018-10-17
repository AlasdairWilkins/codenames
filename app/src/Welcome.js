import React, { Component } from 'react';
import './App.css';

class Welcome extends Component {

    constructor(props) {
        super(props)

        this.state = {
            getNew: false,
            enterExisting: false,
        }

    }

    setDisplay() {

        if (this.state.getNew) {
            return(
                <div>
                    <p>Hello!</p>
                </div>
            )
        }
        if (this.state.enterExisting) {
            return (
                <div>
                    <p>Ahoy hoy!</p>
                </div>
            )
        }
        return (
            <div>
                <p>Welcome to Codenames!</p>
                <button onClick={() => this.props.onClickNewCode()}>
                    Get a new game code.
                </button>
                <button onClick={() => {this.setState({enterExisting: true})}}>
                    Enter an existing code.
                </button>
            </div>
        )
    }

    render() {

        let welcome = this.setDisplay()

        return (
            welcome
        )

    }

}

export default Welcome;