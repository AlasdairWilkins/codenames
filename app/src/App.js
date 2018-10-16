import React, { Component } from 'react';
import './App.css';
import Welcome from './Welcome'
import Waiting from './Waiting'
import Game from './Game'
import { getGameCode } from "./Api";

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            welcome: true,
            waiting: false,
            game: true,
            gameCode: null
        }
    }

    setDisplay() {
        if (this.state.welcome) {
            return ( <Welcome onClickNewCode={() => getGameCode((err, code) => this.setState({gameCode: code, welcome: false, waiting: true}))}/> )
        }
        if (this.state.waiting) {
            return ( <Waiting gameCode={this.state.gameCode}/> )
        }
        return ( <Game /> )
    }


    render() {

        console.log("Game code: ", this.state.gameCode)

        let app = this.setDisplay()

        return (
            app
        )

    }

}

export default App;