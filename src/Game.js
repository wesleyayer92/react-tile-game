import React from 'react';
import Screen from './Screen';
import DPad from './DPad';
import AB from './AB';

import axios from 'axios';
const ENDPOINT = 'https://api.thecatapi.com/v1/images/search';


export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: [
                        ['X', 'X', 'X', 'X', 'X', 'X', 'O', 'X', 'X', 'X', 'X', 'X', 'X'],
                        ['X', '', 'X', 'X', '', '', '', '', '', '', '', '', 'X'],
                        ['X', '', '', '', '', '', 'X', '', '', '', 'X', '', 'X'],
                        ['X', 'X', '', '', '', '', '', '', 'X', '', '', '', 'X'],
                        ['X', '', '', 'X', '', '', '', '', '', '', '', '', 'X'],
                        ['X', '', '', 'X', '', '', '', 'X', '', '', '', '', 'X'],
                        ['X', 'X', '', '', '', 'X', '', '', '', '', '', 'X', 'X'],
                        ['X', '', '', '', '', '', '', '', '', 'X', '', '', 'X'],
                        ['X', '', '', '', '', '', '', 'X', '', '', '', '', 'X'],
                        ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X']
                    ],
                    xCoord: 6,
                    yCoord: 0,
                },
            ],
            catPic: ''
        };
    }

    winCheck = (squares) => {
        for (let array of squares) {
            for (let item of array) {
                if (item === '') {
                    return;
                }
            }
        }
        axios.get(ENDPOINT)
            .then(r => {
                this.setState({
                    catPic: r.data[0].url
                });
            })
    }

    goBack = () => {
        if (this.state.history.length > 1 && !this.state.catPic) {
            this.setState({
                history: this.state.history.slice(0, this.state.history.length - 1)
            });
        }
        return;
    }

    handleClick = (event) => {
        const history = this.state.history;
        const current = history[history.length - 1];
        // let squares = [...current.squares];
        let squares = current.squares.map(arr => [...arr]);
        let x = current.xCoord;
        let y = current.yCoord;

        switch(event.target.value) {
            case 'left':
                if (x > 1) {x -= 1};
                break;
            case 'right':
                if (x < squares[0].length - 1) {x += 1};
                break;
            case 'up':
                if (y > 1) {y -= 1};
                break;
            case 'down':
                if (y < squares.length - 1) {y += 1};
                break;
            default:
                break;
        };

        if (squares[y][x]) {
            return;
        }

        squares[y][x] = 'O';

        this.setState({
                history: [
                    ...history,
                    {
                        squares,
                        xCoord: x,
                        yCoord: y
                    }    
                ]
        }, () => console.table(this.state));
    }
    
    render() {
        const history = this.state.history;
        const current = history[history.length - 1];
        console.table(this.state);
        return (
            <div className="game">
                <div className="game-board">
                    <Screen
                        winCheck={this.winCheck}
                        squares={current.squares} 
                        xCoord={current.xCoord} 
                        yCoord={current.yCoord}
                    />
                    <DPad onClick={this.handleClick}/>
                    <AB onClick={this.goBack} />
                    {this.state.catPic && <img height='500px' width='500px' src={this.state.catPic} />}
                </div>
            </div>
        );
    }
}