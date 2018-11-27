import Pluralize from "react-pluralize";
import React, {Component} from "react";
import connect from "react-redux/es/connect/connect";

class Others extends Component {

    set() {
        if (this.props.joining > 0) {
            return <div><p><Pluralize singular="other player" count={this.props.joining}/> joining!</p></div>
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