import React, { Component } from 'react';
import './App.css';
import api from "./Api";

class Chat extends Component {
    constructor(props) {
        super(props)

        this.state = {
            messages: [],
            entry: ""
            //handle allowed in chat yes or no
        }

        api.getMessages((err, messages) => this.setState({messages: messages}))

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    handleChange(event) {
        this.setState({entry: event.target.value})
    }

    handleSubmit(event) {
        if (this.state.entry.length) {
            api.sendMessage({name: this.props.displayName, entry: this.state.entry})
            this.setState({entry: ""})
        }
        event.preventDefault()
    }

    setDisplay() {
        if (this.props.displayName) {
            return (
                <form id="message" onSubmit={this.handleSubmit}>
                    <input id="m" autoComplete="off" onChange={this.handleChange} value={this.state.entry} /><button>Send</button>
                </form>
            )
        }
        return null
    }

    render() {

        let messages = (this.state.messages.map((item, i) => {
            if (this.props.displayName === item.name) {
                return <li key={i} className="own">{item.entry}</li>
            } else {
                return <li key={i}>{item.name}: {item.entry}</li>
            }
        }))

        let entry = this.setDisplay()

        return (
            <div>
                <div id="chat-container">
                    <ul id="chatroom">
                        {messages}
                    </ul>
                </div>
                {entry}
            </div>

        )
    }


}

export default Chat