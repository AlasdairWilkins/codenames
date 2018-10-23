import React, { Component } from 'react';
import './App.css';

class Select extends Component {
    constructor(props) {
        super(props)


    }

    setDisplay(players) {



        return players.map((player, i) => {

            console.log(player)

            let className = (player.team) ? player.team : 'unsorted'
            return (
                <div key={i} className={className}>{player.name}<button>&gt;</button></div>
            )
        })

        //     if (player.team === 'blue') {
        //         return (
        //             <div key={i} className='blue'>{player.name}<button>&gt;</button></div>
        //         )
        //     } else if (player.team === 'red') {
        //         return (
        //             <div key={i} className='red'><button>&lt;</button>{player.name}</div>
        //         )
        //     } else {
        //         return (
        //             <div key={i} className='unsorted'><button>&lt;</button>{player.name}<button>&gt;</button></div>
        //         )
        //     }
        // })
    }

    render() {

        let select = this.setDisplay(this.props.players)


        return (
            <div>
                <div className="row">
                    <div className="column">Blue Team</div>
                    <div className="column"><strong>Pick your team!</strong></div>
                    <div className="column">Red Team</div>
                </div>
                <div className="select">
                    {select}
                </div>
            </div>
        )
    }
}

export default Select;