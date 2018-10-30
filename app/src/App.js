import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './App.css';
import Welcome from './Welcome'
import Waiting from './Waiting'
import Select from './Select'
import Game from './Game'
import Chat from './Chat'
import {api, player, select, namespace, ready, resume, session} from "./Api";
import {setDisplay, setNSP} from "./store/actions";


class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            displayName: null,
            players: [],
            total: null,
            blueMax: null,
            redMax: null
        };

        this.handleSubmitDisplayName = this.handleSubmitDisplayName.bind(this);
        // this.handleGetGameCode = this.handleGetGameCode.bind(this);
        // this.handleSendGameCode = this.handleSendGameCode.bind(this);
        this.handleSetWaiting = this.handleSetWaiting.bind(this);
        this.handleReady = this.handleReady.bind(this);

        if (document.cookie) {
            api.get(resume, (err, msg) => {
                if (msg.displayName) {
                    this.setState({displayName: msg.displayName})
                }
                this.props.setNSP(msg.namespace)
                this.props.setDisplay('waiting')
                // above should become dynamic
                api.get(player, (err, msg) => this.setState({players: msg.players, total: msg.total}))
            })
        }

        let loc = new URL(window.location);
        let params = new URLSearchParams(loc.search);
        if (params.has('code')) {
            this.handleParamsCode(params)
        }

    }

    handleSubmitDisplayName(displayName) {
        this.setState({displayName: displayName});
        api.set(player, {name: displayName, cookie: document.cookie})
    }

    handleParamsCode(params) {
        api.set(namespace, params.get('code'), (err, status) => {
            if (status) {
                this.setState({gameCode: params.get('code')});
                this.handleSetWaiting()
            } else {
                console.log("Whoops")
                //Handle incorrect game code
            }
        })
    }

    handleSetWaiting() {
        this.setState({display: 'waiting'});
        api.get(session, (err, cookie) => {
            document.cookie = cookie
        });
        api.get(player, (err, msg) => {
            this.setState({players: msg.players, total: msg.total, blueMax: msg.blueMax, redMax: msg.redMax})
            console.log(this.state)
        })
    }

    handleReady() {
        api.set(ready, document.cookie, (err) => this.setState({display: 'select'}));
        api.get(select, (err, players) => this.setState({players: players}))
    }

    set(display) {

        switch (display) {

            default:
            case 'welcome':
                return (
                    <Welcome/>
                );

            case 'waiting':
                let chat = (this.state.players.length) ? <Chat api={api} displayName={this.state.displayName}/> : null;
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
                );

            case 'select':
                return (
                    <div>
                        <Select
                            players={this.state.players}
                            blueMax={this.state.blueMax}
                            redMax={this.state.redMax}
                            handleClick={this.handleClickSelect}
                        />
                        <Chat displayName={this.state.displayName}/>
                    </div>
                );
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

        let app = this.set(this.props.display);

        return (
            app
        )

    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        display: state.display
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setDisplay: bindActionCreators(setDisplay, dispatch),
        setNSP: bindActionCreators(setNSP, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);