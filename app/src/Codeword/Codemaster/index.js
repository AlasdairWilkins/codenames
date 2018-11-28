import React, { Component } from 'react';
import '../../App.css';
import connect from "react-redux/es/connect/connect";
import Active from "./Active"
import Inactive from "./Inactive"

class Codemaster extends Component {

    render() {

        let codemaster = (this.props.active) ? <Active/> : <Inactive/>

        return (
            codemaster
        )

    }

}

const mapStateToProps = (state) => {
    return {
        active: state.active
    }
};


export default connect(mapStateToProps)(Codemaster);

