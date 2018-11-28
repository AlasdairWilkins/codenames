import React, { Component } from 'react';
import '../App.css';
import connect from "react-redux/es/connect/connect";
import Codemaster from "./Codemaster"
import Team from "./Team"

class Codeword extends Component {

    render() {

        let codeword = (this.props.codemaster) ? <Codemaster/> : <Team/>;

        return (
            codeword
        )

    }

}

const mapStateToProps = (state) => {
    return {
        codemaster: state.codemaster
    }
};

export default connect(mapStateToProps)(Codeword);

