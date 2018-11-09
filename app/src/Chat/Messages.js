import React, { Component } from 'react';
import '../App.css';
import { api } from "../Api";
import {message, messages} from "../constants"
import connect from "react-redux/es/connect/connect";
import {bindActionCreators} from "redux";
import {clear, set, update} from "../store/actions";

class Messages extends Component {

    componentDidMount() {
        api.get(message, (err, msg) => {
            if (!this.props.messages) {
                this.props.set(messages, msg)
            } else {
                this.props.update(messages, msg)
            }
        });
    }

    componentWillUnmount() {
        api.socket.off(message)
        this.props.clear(messages)
    }

    set() {
        return (this.props.messages.map((item, i) => {
            if (this.props.id === item.socketID) {
                return <li key={i} className="own">{item.entry}</li>
            } else {
                return <li key={i}>{item.name}: {item.entry}</li>
            }
        }))
    }

    render() {


        let display = (this.props.messages) ? this.set() : null;

        return (
            <div id="chat-container">
                <ul id="chatroom">
                    {display}
                </ul>
            </div>
        )
    }

}


const mapStateToProps = state => {
    return {
        id: state.id,
        messages: state.messages
    }
}

const mapDispatchToProps = dispatch => {
    return {
        set: bindActionCreators(set, dispatch),
        clear: bindActionCreators(clear, dispatch),
        update: bindActionCreators(update, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);