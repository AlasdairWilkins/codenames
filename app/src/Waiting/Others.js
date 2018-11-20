import Pluralize from "react-pluralize";
import React, {Component} from "react";
import connect from "react-redux/es/connect/connect";

class Others extends Component {

    set() {
        let others = (this.props.name) ? this.props.joining : this.props.joining - 1;
        if (others > 0) {
            return <div><p><Pluralize singular="other player" count={others}/> joining!</p></div>
        }
        return null
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
        players: state.players,
        joining: state.joining
    }
};

const mapDispatchToProps = dispatch => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Others);