import React, { Component } from 'react';
import './App.css';
import Welcome from './Welcome'
import Waiting from './Waiting'
import Game from './Game'

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            welcome: false,
            waiting: false,
            game: true
        }
    }

    setDisplay() {
        if (this.state.welcome) {
            return ( <Welcome /> )
        }
        if (this.state.waiting) {
            return ( <Waiting /> )
        }
        return ( <Game /> )
    }


    render() {

        let app = this.setDisplay()

        return (
            app
        )

    }

}

export default App;