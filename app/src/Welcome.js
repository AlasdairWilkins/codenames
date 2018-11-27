import React, { Component } from 'react';
import './App.css';
import {api} from "./Api";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {set, clear} from './store/actions'
import Loading from './Loading'
import Header from './header'

const session = new Header('session');
const namespace = new Header('namespace');


class Welcome extends Component {

    constructor(props) {
        super(props);

        this.state = {
            existing: false,
            loading: false
        };

        this.onClick = this.onClick.bind(this);
        this.onSubmit = this.onSubmit.bind(this)
    }

    onClick(event) {
        if (event.target.value === "new") {
            this.setState({loading: true});
            api.get(namespace.get, (err, nspID) => {
                this.handleNamespace(err, nspID)
            })
        } else if (event.target.value === "existing") {
            this.setState({existing: true})
        }
    }

    onSubmit(event) {
        event.preventDefault();
        this.setState({loading: true});
        api.set(namespace.post, event.target.elements.code.value, (err, nspID) => {
            this.handleNamespace(err, nspID)
        })
    }

    handleNamespace(err, nspID) {
        if (err) {
            //handle error
        } else {
            api.address = nspID;
            this.props.set('nsp', nspID);
            api.get('session', (err, cookie) => {
                if (err) {
                    //handle error
                } else {
                    document.cookie = cookie;
                    this.props.set('display', 'waiting')
                }
            })
        }
    }

    set() {

        if (this.state.loading) {
            return <Loading />
        }

        if (this.state.existing) {
            return (
                <div>
                    <p>Enter your game code below!</p>
                    <form onSubmit={this.onSubmit}>
                        <label htmlFor="code">
                            <input id="code" placeholder="Game Code" type="text" />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            )
        }

        return (
            <div>
                <p>Welcome to Codenames!</p>
                <button value="new" onClick={this.onClick}>
                    Get a new game code.
                </button>
                <button value="existing" onClick={this.onClick}>
                    Enter an existing code.
                </button>
            </div>
        )
    }

    render() {

        let display = this.set();

        return (
            display
        )

    }

}

const mapStateToProps = (state, ownProps) => {
    return {}
};

const mapDispatchToProps = dispatch => {
    return {
        set: bindActionCreators(set, dispatch),
        clear: bindActionCreators(clear, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);