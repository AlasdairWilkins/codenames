import React, { Component } from 'react';
import './App.css';

class Chat extends Component {
    constructor(props) {
        super(props)

        this.state = {
            messages: [],
            entry: ""
            //handle allowed in chat yes or no
        }


        this.props.api.getMessages((err, messages) => this.setState({messages: messages}))
        console.log(this.state)

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    handleChange(event) {
        this.setState({entry: event.target.value})
    }

    handleSubmit(event) {
        this.props.api.sendMessage({name: this.props.displayName, entry: this.state.entry})
        this.setState({entry: ""})
        event.preventDefault()
    }

    setDisplay() {
        if (this.props.displayName) {
            return (
                <form id="message" onSubmit={this.handleSubmit}>
                    <input id="m" autoComplete="off" onChange={this.handleChange} value={this.state.entry} /><input id="s" type="submit" value="Send" />
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
                <ul id="chatroom">
                    {messages}
                </ul>
                {entry}
            </div>

        )
    }


}

export default Chat