import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './App.css';
import Welcome from './Welcome'
import Waiting from './Waiting'
import Select from './Select'
import Game from './Game'
import Chat from './Chat'
import { startup } from './Startup'
import { api } from "./Api";
import { setDisplay, setNSP, setName, setJoining } from "./store/actions";


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

    }

    set(display) {

        switch (display) {

            default:
            case 'welcome':
                return (
                    <Welcome/>
                );

            case 'waiting':
                let chat = (this.props.players.length) ? <Chat displayName={this.state.displayName}/> : null;
                return (
                    <div>
                        <Waiting/>
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
        display: state.display,
        players: state.players
    }
}

const mapDispatchToProps = dispatch => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);