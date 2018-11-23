import {api} from "../Api";
import React, { Component } from "react";
import {bindActionCreators} from "redux";
import {set, clear} from "../store/actions";
import connect from "react-redux/es/connect/connect";


class Name extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: null,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    handleSubmit(event) {
        api.set('displayName', this.state.name, (err, name) => {
            this.props.set('name', name);
            this.props.set('display', 'waiting')
        });
        // this.props.clear('players');
        event.preventDefault()
    }

    handleChange(event) {
        this.setState({name: event.target.value})
    }

    set() {
        if (!this.props.name) {
            return (
                <div>
                    <p>Please enter your name.</p>
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="name">
                            <input onChange={this.handleChange} placeholder="Your name" type="text" />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            )
        }
        return (
            <div><p>Hi, {this.props.name}!</p></div>
        )
    }

    render() {

        let display = this.set();

        return (
            display
        )

    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        name: state.name,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        set: bindActionCreators(set, dispatch),
        clear: bindActionCreators(clear, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Name);