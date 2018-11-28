import React, { Component } from 'react';
import '../../App.css';
import {bindActionCreators} from "redux";
import {set} from "../../store/actions";
import connect from "react-redux/es/connect/connect";
import {api} from "../../Api"

class Active extends Component {

    constructor(props) {
        super(props);
        this.state = {
            submitted: false
        };

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(event) {

        let codeword = event.target.elements.code.value;
        let number =  event.target.elements.number.options[event.target.elements.number.selectedIndex].value;
        // let msg = {code, number}

        api.set('codeword', {codeword, number});
        this.props.clear('words');
        api.get('game');


        this.setState({submitted: true});
        event.preventDefault()
    }

    set() {
        if (this.props.codeword && this.props.number) {
            return (
                <p>The hint is '{this.props.codeword}' for {this.props.number} words.</p>
            )
        }

        let choices = [];

        for (let i = 0; i < this.props.remaining; i++) {
            choices.push(i + 1)
        }

        return (
            <form onSubmit={this.handleSubmit}>
                <label htmlFor="code">Code:</label>
                <input id="code" type="text" />
                <label htmlFor="number">Words:</label>
                <select id="number">
                    {choices.map((choice) =>
                        <option key={choice} value={choice}>{choice}</option>
                    )}
                </select>
                <input type="submit" value="Submit" />
            </form>

        )
    }

    render() {

        let display = this.set();

        return (
            display
        )

    }

}

const mapStateToProps = (state) => {
    return {
        remaining: state.remaining,
        codeword: state.codeword,
        number: state.number
    }
};

const mapDispatchToProps = dispatch => {
    return {
        set: bindActionCreators(set, dispatch),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Active);

