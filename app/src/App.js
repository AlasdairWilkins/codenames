import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Loading from './Loading'
import Welcome from './Welcome'
import Waiting from './Waiting'
import Select from './Select'
import Game from './Game'
import Chat from './Chat'
import Startup from './Startup'


class App extends Component {

    componentDidMount() {
        new Startup()
    }

    set() {

        switch (this.props.display) {

            case 'welcome':
                return (
                    <Welcome/>
                );

            case 'waiting':
                let chat = (this.props.players) ? <Chat/> : null;
                return (
                    <div>
                        <Waiting/>
                        {chat}
                    </div>
                );

            case 'select':
                return (
                    <div>
                        <Select/>
                        <Chat/>
                    </div>
                );
            case 'game':
                return (
                    <div>
                        <Game/>
                        <Chat/>
                    </div>
                )

            default:
                return (
                    <Loading/>
                )
        }
    }

    render() {

        let app = this.set();

        return (
            app
        )

    }

}

const mapStateToProps = (state) => {
    return {
        display: state.display,
        players: state.players
    }
}


export default connect(mapStateToProps)(App);