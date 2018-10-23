import React, { Component } from 'react';
import './App.css';
import Welcome from './Welcome'
import Waiting from './Waiting'
import Select from './Select'
import Game from './Game'
import Chat from './Chat'
import api from "./Api";

class App extends Component {

    constructor(props) {
        super(props)

        this.state = {
            display: 'welcome',
            gameCode: null,
            displayName: null,
            players: [],
            total: null,
        }

        this.handleSubmitDisplayName = this.handleSubmitDisplayName.bind(this)
        this.handleGetGameCode = this.handleGetGameCode.bind(this)
        this.handleSendGameCode = this.handleSendGameCode.bind(this)
        this.handleSetWaiting = this.handleSetWaiting.bind(this)
        this.handleReady = this.handleReady.bind(this)

        if (document.cookie) {
            api.getNamespace((err, res) => {

                if (res.player) {
                    this.setState({displayName: res.player.name})
                }

                this.setState({display: 'waiting', gameCode: res.namespace})
                api.setNamespace(this.state.gameCode)
                api.getPlayers((err, msg) => this.setState({players: msg.players, total: msg.total}))
            })
        }

        let loc = new URL(window.location)
        let params = new URLSearchParams(loc.search)
        if (params.has('code')) {
            this.handleParamsCode(params)
        }

    }

    handleSubmitDisplayName(displayName) {
        this.setState({displayName: displayName})
        api.sendNewPlayer(displayName)
    }

    handleGetGameCode(err, code) {
        this.setState({gameCode: code})
        this.handleSetWaiting()
    }

    handleSendGameCode(err, status) {
        if (status) {
            this.handleSetWaiting()
        } else {
            console.log("Whoops")
            //Handle incorrect game code
        }
    }

    handleParamsCode(params) {
        api.sendGameCode(params.get('code'), (err, status) => {
            if (status) {
                this.setState({gameCode: params.get('code')})
                this.handleSetWaiting()
            } else {
                console.log("Whoops")
                //Handle incorrect game code
            }
        })
    }

    handleSetWaiting() {
        this.setState({display: 'waiting'})
        api.setNamespace(this.state.gameCode)
        api.getCookie(this.state.gameCode)
        api.getPlayers((err, msg) => this.setState({players: msg.players, total: msg.total}))
    }

    handleReady() {
        api.sendReady((err) => this.setState({display: 'select'}))
        api.getSelects((err, players) => this.setState({players: players}))
    }

    set(display) {

        switch (display) {

            default:
            case 'welcome':
                return (
                    <Welcome
                        onClickNewCode={() => api.getGameCode(this.handleGetGameCode)}
                        onChange={(event) => this.setState({gameCode: event.target.value})}
                        onSubmit={(event) => {
                            api.sendGameCode(this.state.gameCode, this.handleSendGameCode)
                            event.preventDefault()
                        }}
                    />
                )

            case 'waiting':
                let chat = (this.state.players.length) ? <Chat api={api} displayName={this.state.displayName}/> : null
                return (
                    <div>
                        <Waiting
                            gameCode={this.state.gameCode}
                            displayName={this.state.displayName}
                            players={this.state.players}
                            total={this.state.total}
                            onSubmit={this.handleSubmitDisplayName}
                            handleReady={this.handleReady}
                        />
                        {chat}
                    </div>
                )

            case 'select':
                return (
                    <div>
                        <Select players={this.state.players} handleClick={this.handleClickSelect}/>
                        <Chat displayName={this.state.displayName}/>
                    </div>
                )
            case 'game':
                return (
                    <div>
                        <Game/>
                        <Chat displayName={this.state.displayName}/>
                    </div>
                )
        }
    }


    render() {

        let app = this.set(this.state.display)

        return (
            app
        )

    }

}

export default App;