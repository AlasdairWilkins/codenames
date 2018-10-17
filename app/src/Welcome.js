import React, { Component } from 'react';
import './App.css';

class Welcome extends Component {

    constructor(props) {
        super(props)

        this.state = {
            enterExisting: false,
        }

    }

    setDisplay() {

        if (this.state.enterExisting) {
            return (
                <div>
                    <div>
                        <p>Enter your game code below!</p>
                        <form onSubmit={this.props.onSubmit}>
                            <label htmlFor="code">
                                <input onChange={this.props.onChange} placeholder="Game Code" type="text" />
                            </label>
                            <input type="submit" value="Submit" />
                        </form>
                    </div>
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