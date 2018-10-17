import React, { Component } from 'react';
import './App.css';

class Square extends Component {

    handleClick() {
        if (this.props.active) {
            let value = this.props.item.value
            alert(`This is ${value}.`)
        }
    }


    render() {

        let value = (this.props.codemaster) ? this.props.item.value : null
        let word = this.props.item.word

        return <button className={value} onClick={() => this.handleClick()}>{word}</button>
    }
}

export default Square;