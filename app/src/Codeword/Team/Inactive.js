import React, { Component } from 'react';
import '../../App.css';
import connect from "react-redux/es/connect/connect";

class CodeWord extends Component {

    set() {
        if (this.props.codeword && this.props.number) {
            return (
                <p>The other team's hint is '{this.props.codeword}' for {this.props.number} words.</p>
            )
        }
        return (
            <p>Sit tight!</p>
        )
    }

    render() {

        let display = this.set()

        return (
            display
        )

    }

}

const mapStateToProps = (state) => {
    return {
        codeword: state.codeword,
        number: state.number
    }
};

export default connect(mapStateToProps)(CodeWord);

