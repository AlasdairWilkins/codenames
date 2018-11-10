import React, { Component } from 'react';
import '../App.css';
import Entry from "./Entry"
import Messages from "./Messages";

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