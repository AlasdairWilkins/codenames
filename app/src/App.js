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
            namespace: null,
            displayName: null,
            players: []
        }

        this.handleChangeDisplayName = this.handleChangeDisplayName.bind(this)
        this.handleSubmitDisplayName = this.handleSubmitDisplayName.bind(this)

    }

    handleSubmitDisplayName(event) {
        api.sendNewPlayer(this.state.namespace, this.state.displayName)
    }

    handleChangeDisplayName(event) {
        this.setState({displayName: event.target.value})
    }

    setDisplay() {
        if (this.state.welcome) {
            return ( <Welcome
                onClickNewCode={() => api.getGameCode((err, code) => {
                    this.setState({gameCode: code, welcome: false, waiting: true, namespace: api.setNamespace(code)})
                    api.getPlayers(this.state.namespace, (err, players) => this.setState({players: players}))
                })}
                onChange={(event) => this.setState({gameCode: event.target.value})}
                onSubmit={(event) => {
                    api.sendGameCode(this.state.gameCode, (err, status) => {
                        if (status) {
                            this.setState({welcome: false, waiting: true, namespace: api.setNamespace(this.state.gameCode)})
                            api.getPlayers(this.state.namespace, (err, players) => this.setState({players: players}))
                        } else {
                            console.log("Whoops")
                            //Handle incorrect game code
                        }
                    })
                    event.preventDefault()
                }}
            /> )
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