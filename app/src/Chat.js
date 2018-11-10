import React, { Component } from 'react';
import './App.css';
import Entry from "./Chat/Entry"
import Messages from "./Chat/Messages";

class Chat extends Component {

    render() {

        return (
            <div>
                <div id="chat-container">
                    <ul id="chatroom">
                        <Messages/>
                    </ul>
                </div>
                <Entry/>
            </div>
        )
    }

}

export default Chat