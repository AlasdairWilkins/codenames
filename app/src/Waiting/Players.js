import React, {Component} from "react";
import connect from "react-redux/es/connect/connect";

class Players extends Component {

    set() {

        if (!this.props.players.length || (this.props.name && this.props.players.length <= 1)) {
            return (
                <div>
                    <p>Waiting for other players to join!</p>
                </div>
            )
        }

        let finalPlayer = this.props.players.length - 1;

        return (
            <div>
                Here's who's playing: {this.props.players.join(", ")}
            </div>
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
        players: state.players,
    }
};

const mapDispatchToProps = dispatch => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Players);