import React, { Component } from 'react';
import './App.css';
import { api } from "./Api";
import { message } from "./constants"
import { set, clear, updateMessages } from "./store/actions"
import { bindActionCreators } from "redux";
import connect from "react-redux/es/connect/connect";

class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            entry: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    componentDidMount() {
        api.get(message, (err, msg) => {
            if (!this.props.messages) {
                this.props.set("messages", msg)
            } else {
                this.props.updateMessages(msg)
            }
        });
    }

    componentWillUnmount() {
        api.socket.off(message)
        this.props.clear("messages")
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

    setDisplay() {
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


        let messages;

        if (this.props.messages) {
            messages = (this.props.messages.map((item, i) => {
                if (this.props.id === item.socketID) {
                    return <li key={i} className="own">{item.entry}</li>
                } else {
                    return <li key={i}>{item.name}: {item.entry}</li>
                }
            }))
        }

        let entry = this.setDisplay();

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

class Message {
    constructor(text, id, name) {
        this.entry = text
        this.socketID = id
        this.name = name
    }
}

const mapStateToProps = state => {
    return {
        name: state.name,
        id: state.id,
        messages: state.messages
    }
}

const mapDispatchToProps = dispatch => {
    return {
        set: bindActionCreators(set, dispatch),
        clear: bindActionCreators(set, dispatch),
        updateMessages: bindActionCreators(updateMessages, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);