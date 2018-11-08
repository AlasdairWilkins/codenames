import React, { Component } from 'react';
import './App.css';
import {api} from "./Api";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {set, clear} from './store/actions'
import {namespace, player, session} from "./constants"


class Welcome extends Component {

    constructor(props) {
        super(props);

        this.state = {
            existing: false,
            code: null
        }

        this.onClick = this.onClick.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onClick(event) {
        if (event.target.value === "new") {
            // this.props.clear('display')
            api.get(namespace, (err, msg) => {
                this.props.set('nsp', msg.namespace)
                api.get(session, (err, msg) => {
                    document.cookie = msg
                    this.props.set('display', 'waiting')
                })
            })
        } else if (event.target.value === "existing") {
            this.setState({existing: true})
        }
    }

    onSubmit(event) {
        event.preventDefault()
        api.set(namespace, this.state.code, (err, msg) => {
            if (msg) {
                this.props.set('nsp', this.state.code)
                api.get(session, (err, msg) => {
                    document.cookie = msg
                    this.props.set('display', 'waiting')
                });
            } else {
                console.log("Whoops")
            }
        })
    }

    onChange(event) {
        this.setState({code: event.target.value})
    }

    set() {

        if (this.state.existing) {
            return (
                <div>
                    <p>Enter your game code below!</p>
                    <form onSubmit={this.onSubmit}>
                        <label htmlFor="code">
                            <input onChange={this.onChange} placeholder="Game Code" type="text" />
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
}

const mapDispatchToProps = dispatch => {
    return {
        set: bindActionCreators(set, dispatch),
        clear: bindActionCreators(clear, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);