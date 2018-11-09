import React, { Component } from 'react';
import '../App.css';
import { api } from "../Api";
import { message } from "../constants"
import connect from "react-redux/es/connect/connect";

class Entry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            entry: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    handleChange(event) {
        this.setState({entry: event.target.value})
    }

    handleSubmit(event) {
        if (this.state.entry.length) {
            api.set(message, new Message(this.state.entry, this.props.id, this.props.name));
            this.setState({entry: ""})
        }
        event.preventDefault()
    }

    set() {
        if (this.props.name) {
            return (
                <form id="message" onSubmit={this.handleSubmit}>
                    <input id="m" autoComplete="off" onChange={this.handleChange} value={this.state.entry} /><button>Send</button>
                </form>
            )
        }
        return null
    }

    render() {


        let display = this.set();

        return (
            display
        )
    }
    
}

class Message {
    constructor(text, id, name) {
        this.entry = text;
        this.socketID = id;
        this.name = name
    }
}

const mapStateToProps = state => {
    return {
        name: state.name,
        id: state.id,
    }
};

export default connect(mapStateToProps)(Entry);