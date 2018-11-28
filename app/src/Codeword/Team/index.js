import React, { Component } from 'react';
import '../../App.css';
import connect from "react-redux/es/connect/connect";
import Active from "./Active"
import Inactive from "./Inactive"


class Team extends Component {

    render() {

        let team = (this.props.active) ? <Active/> : <Inactive/>

        return (
            team
        )

    }

}

const mapStateToProps = (state) => {
    return {
        active: state.active
    }
};


export default connect(mapStateToProps)(Team);

