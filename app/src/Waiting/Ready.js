import React, {Component} from "react";
import {api} from "../Api";
import {ready} from "../constants";
import {bindActionCreators} from "redux";
import {set} from "../store/actions";
import connect from "react-redux/es/connect/connect";


class Ready extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ready: false,
        };

        this.handleClick = this.handleClick.bind(this)

    }

    handleClick(event) {
        api.ping('waitingReady', (err) => {
            console.log("here!")
            this.setState({ready: true})
        });
        event.preventDefault()
    }

    set() {
        if (!this.state.ready) {
            return <p id="ready"><button onClick={this.handleClick}>Press this when everyone is ready to play!</button></p>
        }
        return <p id="ready">Great! We'll be starting soon.</p>
    }

    render() {

        let display = this.props.name ? this.set() : null;

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
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Ready);