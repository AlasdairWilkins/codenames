import React, { Component } from 'react';
import './App.css';

class Waiting extends Component {

    render() {

        return (
            <p>Your game code is {this.props.gameCode}. Waiting for others to join!</p>
        )

    }

}

export default Waiting;