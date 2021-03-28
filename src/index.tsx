import React from 'react';
import ReactDOM from 'react-dom';
import { Counter } from './Counter';
import './index.css';

import { TickingClock } from './TickingClock';

interface SquareProps {
  squareValue: string | null,
  onClick(): void,
  isWinning: boolean,
}

function Square(props: SquareProps) {
  return (
      <button 
        className={props.isWinning ? "square red" : "square"} 
        onClick={props.onClick}>
          {props.squareValue}
      </button>
  );
}


interface BoardProps {
  squares: Array<string | null>,
  onClick(i: number): void,
  winningLine: Array<number> | null,
}

class Board extends React.Component<BoardProps, {}> {
  renderSquare(i: number, winningSquare: boolean) {
    return (
      <Square
        key={i}
        squareValue={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isWinning={winningSquare}
      />
    );
  }

  renderBoard(boardLength: number) {
    let board = [];
    // Outer loop to create rows
    for (let r=0; r<boardLength; r++) {
      let squareList = [];
      // Inner loop to create squares
      for (let c=0; c<boardLength; c++) {
        const squareIndex = (r * boardLength) + c;
        let isWinning;
        if (this.props.winningLine) {
          isWinning = this.props.winningLine.includes(squareIndex);
        } else {
          isWinning = false;
        }
        squareList.push(this.renderSquare(squareIndex, isWinning));
      }
      board.push(<div className="board-row" key={r}>{squareList}</div>);
    }
    return board;
  }

  render() {
    return (
    <div>
      {this.renderBoard(Math.sqrt(this.props.squares.length))}
    </div>
    );
  }
}


interface GameState {
  history: Array<{
    squares: Array<string | null>,
    clickedSquare: number | null,
  }>,
  xIsNext: boolean,
  stepNumber: number,
}

class Game extends React.Component {

  state: GameState = {
    history: [{
      squares: Array(9).fill(null),
      clickedSquare: null,
    },],
    xIsNext: true,
    stepNumber: 0,
  }

  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: [...history, {squares: squares, clickedSquare: i}],
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winCondition = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const clickedSquare = step.clickedSquare;
      console.log(move, clickedSquare);
      let desc: string | JSX.Element = move && (clickedSquare !== null) ?
        `Move #${move} - (${Math.floor(clickedSquare / 3)}, ${clickedSquare % 3})` :
        `Game start`;

      // Bold the current move
      desc = history.indexOf(current) === move ? <strong>{desc}</strong> : desc;

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    let status;
    if (winCondition) {
      status = `Winner: ${winCondition.winner}`;
    } else if (current.squares.every((square) => !!square)) {
      status = `The game is a draw!`;
    } else {
      status = `Next Player: ${this.state.xIsNext ? 'X':'O'}`;
    };
    
    return (
    <div className="wrapper">
      <div className="game">
          <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningLine={winCondition ? winCondition.winningLine : null}
          />
          </div>
          <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
          </div>
      </div>
      <div>
        <TickingClock />
        <Counter />
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

function calculateWinner(squares: Array<string | null>) {
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
      return {winner: squares[a], winningLine: lines[i]};
    }
  }
  return null;
}
