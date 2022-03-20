import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return(
        <button className='square' onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)} 
            />        
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            history:[{
                squares: Array(9).fill(null),
                squareNumber: null,
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handle(i) {
        const history = this.state.history.slice(0,this.state.stepNumber+1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]) { // if someone won or the square is already clicked
            // javascript strings as true using a concept called truthfullness if i remmber correctly
            // so x or o means true but if the return is null its false
            return;
        }
        squares[i] = this.state.xIsNext? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                squareNumber: i
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2)===0,
        });
    }
    
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        let winner = calculateWinner(current.squares);
        const moves = history.map((step,move) => {
            let desc = "" 
            if(move>0) {
                desc = 'Go to move #' + move + '| ' + 
                '( col: ' + (((history[move].squareNumber)%3)+1) + ' ' +
                'row: ' + Math.ceil((history[move].squareNumber+1)/3) + " ) " + (((move%2)===0)? "O":"X") +" was played"; 
            } else {
                desc = "Go to the start";
            }

            if (this.state.stepNumber===move) {
                return(
                    <li key={move}>
                        <button onClick={()=> this.jumpTo(move)}><b>{desc}</b></button>
                    </li>
                );    
            } else { 
                return(
                    <li key={move}>
                        <button onClick={()=> this.jumpTo(move)}>{desc}</button>
                    </li>
                );
            }
        });
        let status;
        if(winner) {
            status = "winner " + winner;
        } else {
            status = "next is " + (this.state.xIsNext? "X" : "O");
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i)=> this.handle(i) } 
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

