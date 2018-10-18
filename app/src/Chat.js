import React, { Component } from 'react';
import './App.css';

class Chat extends Component {
    constructor(props) {
        super(props)



    }


    render() {
        return (
            <div>
                <ul id="chatroom"></ul>
                <form id="message">
                    <input id="m" autoComplete="off" /><button>Send</button>
                </form>
            </div>

        )
    }


}

export default Chat