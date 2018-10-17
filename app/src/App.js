import React, { Component } from 'react';
import './App.css';
import Welcome from './Welcome'
import Waiting from './Waiting'
import Game from './Game'
import Api from "./Api";

const api = new Api()

class App extends Component {

    constructor(props) {
        super(props)

        this.state = {
            welcome: true,
            waiting: false,
            game: false,
            gameCode: null,
            displayName: null,
            players: []
        }

        this.handleChangeDisplayName = this.handleChangeDisplayName.bind(this)
        this.handleSubmitDisplayName = this.handleSubmitDisplayName.bind(this)

    }

    handleSubmitDisplayName(event) {
        api.sendNewPlayer(this.state.gameCode, this.state.displayName)
    }

    handleChangeDisplayName(event) {
        this.setState({displayName: event.target.value})
        console.log(this.state.displayName)
    }

    setDisplay() {
        if (this.state.welcome) {
            return ( <Welcome
                onClickNewCode={() => api.getGameCode((err, code) => {
                    this.setState({gameCode: code, welcome: false, waiting: true})
                    api.getPlayers(this.state.gameCode, (err, players) => this.setState({players: players}))
                })}/> )
        }
        if (this.state.waiting) {
            return ( <Waiting
                gameCode={this.state.gameCode}
                displayName={this.state.displayName}
                players={this.state.players}
                onChange={this.handleChangeDisplayName}
                onSubmit={this.handleSubmitDisplayName}
            /> )
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