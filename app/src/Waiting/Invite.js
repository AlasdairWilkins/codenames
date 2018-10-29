import React, { Component } from 'react';
import '../App.css';

class Invite extends Component {
    constructor(props) {
        super(props);

        this.state = {
            invites: [""]
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleClickPlus = this.handleClickPlus.bind(this);
        this.handleClickMinus = this.handleClickMinus.bind(this)
    }

    handleChange(event) {
        let index = event.target.getAttribute('i');
        let invites = this.state.invites;
        if (invites.length === index) {
            invites.push(event.target.value)
        } else {
            invites[index] = event.target.value
        }
        this.setState({invites: invites})
    }

    handleClickPlus(event) {
        let invites = this.state.invites;
        if (!invites.length) {
            invites.push("")
        }
        invites.push("");
        this.setState({invites: invites})
    }

    handleClickMinus(event) {
        let invites = this.state.invites;
        let lastBlank = this.findLastBlank(invites);
        invites.splice(lastBlank, 1);
        this.setState({invites: invites})
    }

    findLastBlank(invites) {
        for (let i = invites.length - 1; 0 <= i; i-- ) {
            if (!invites[i].length) {
                return [i]
            }
        }
        return invites.length - 1
    }



    setInvites(invites) {
        return invites.map((invite, i) => {
            let input = this.setInput(invite, i);
            let button = this.setButton(i, invites);
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

    setButton(i, invites) {
        if (i === 0) {
            return <button i={i} onClick={this.handleClickPlus}>+</button>
        }
        if (i === invites.length - 1) {
            return <button i={i} onClick={this.handleClickMinus}>-</button>
        }
        return null
    }

    render() {

        let inputs = this.setInvites(this.state.invites);

        return (
            <div>
                <p>Invite others to join!</p>
                {inputs}
                <button>Click to send invitations!</button>
            </div>
        )


    }

}

export default Invite