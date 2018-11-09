import React, { Component } from 'react';
import '../App.css';
import connect from "react-redux/es/connect/connect";

class Invite extends Component {
    constructor(props) {
        super(props);

        this.state = {
            invites: [""]
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(event) {
        let index = parseInt(event.target.getAttribute('i'), 10);
        this.setState({invites: [...this.state.invites.slice(0, index),
                event.target.value, ...this.state.invites.slice(index + 1)]})
    }

    handleClick(event) {
        if (event.target.value === 'plus') {
            this.setState({invites: [...this.state.invites, ""]})
        } else {
            let remove = this.findLastBlank()
            this.setState({invites: [...this.state.invites.slice(0, remove), ...this.state.invites.slice(remove + 1)]})
        }
    }

    findLastBlank() {
        for (let i = this.state.invites.length - 1; 0 <= i; i-- ) {
            if (!this.state.invites[i].length) {
                return i
            }
        }
        return this.state.invites.length - 1
    }



    setInvites() {
        let inviteMax = this.state.invites.length - 1
        return this.state.invites.map((invite, i) => {
            let input = this.setInput(invite, i);
            let button = this.setButton(i, inviteMax);
            return (
                <div key={i}>
                    {input}
                    {button}
                </div>
            )
        })
    }

    setInput(invite, i) {

        let value = (invite.length) ? this.state.invites[i] : "";

        return <input
            i={i}
            placeholder="Enter email address"
            value={value}
            onChange={this.handleChange}
            type="text" />
    }

    setButton(i, inviteMax) {
        if (i === 0) {
            return <button i={i} value="plus" onClick={this.handleClick}>+</button>
        }
        if (i === inviteMax) {
            return <button i={i} value="minus" onClick={this.handleClick}>-</button>
        }
        return null
    }

    set() {
        let inputs = this.setInvites(this.state.invites);

        return (
            <div>
                <p>Invite others to join!</p>
                {inputs}
                <button>Click to send invitations!</button>
            </div>
        )
    }

    render() {

        let display = this.props.name ? this.set() : null

        return (
            display
        )


    }

}

const mapStateToProps = state => {
    return {
        name: state.name
    }
}

export default connect(mapStateToProps)(Invite);