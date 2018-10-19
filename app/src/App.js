import React, { Component } from 'react';
import './App.css';
import Welcome from './Welcome'
import Waiting from './Waiting'
import Game from './Game'
import Chat from './Chat'
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
            players: [],
            total: null
        }

        this.handleSubmitDisplayName = this.handleSubmitDisplayName.bind(this)
        this.handleSendGameCode = this.handleSendGameCode.bind(this)

        let loc = new URL(window.location)
        let params = new URLSearchParams(loc.search)
        if (params.has('code')) {
            api.sendGameCode(params.get('code'), (err, status) => {
                if (status) {
                    this.setState({welcome: false, waiting: true, gameCode: params.get('code')})
                    console.log(this.state.gameCode)
                    api.setNamespace(this.state.gameCode)
                    api.getPlayers((err, msg) => this.setState({players: msg.players, total: msg.total}))
                } else {
                    console.log("Whoops")
                    //Handle incorrect game code
                }
            })
        }

    }

    handleSubmitDisplayName(displayName) {
        this.setState({displayName: displayName})
        api.sendNewPlayer(displayName)
    }

    handleSendGameCode(err, status) {
        if (status) {
            this.setState({welcome: false, waiting: true})
            api.setNamespace(this.state.gameCode)
            api.getPlayers((err, msg) => this.setState({players: msg.players, total: msg.total}))
        } else {
            console.log("Whoops")
            //Handle incorrect game code
        }
    }

    setDisplay() {
        if (this.state.welcome) {
            return ( <Welcome
                onClickNewCode={() => api.getGameCode((err, code) => {
                    this.setState({gameCode: code, welcome: false, waiting: true})
                    api.setNamespace(this.state.gameCode)
                    api.getPlayers((err, msg) => this.setState({players: msg.players, total: msg.total}))
                })}
                onChange={(event) => this.setState({gameCode: event.target.value})}
                onSubmit={(event) => {
                    api.sendGameCode(this.state.gameCode, this.handleSendGameCode)
                    event.preventDefault()
                }}
            /> )
        }
        if (this.state.waiting) {
            let chat = (this.state.players.length) ? <Chat api={api} displayName = {this.state.displayName}/> : null
            return (
                <div>
                    <Waiting
                        gameCode={this.state.gameCode}
                        displayName={this.state.displayName}
                        players={this.state.players}
                        total={this.state.total}
                        onSubmit={this.handleSubmitDisplayName}
                        api={api}
                    />
                    {chat}
                </div>
            )
        }
        return (
            <div>
                <Game />
                <Chat />
            </div>
        )
    }


    render() {

        let app = this.setDisplay()

        return (
            app
        )

    }

}

export default App;