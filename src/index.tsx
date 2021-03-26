import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


interface SquareProps {
  squareValue: string | null,
  onClick(): void,
}

function Square(props: SquareProps) {
  return (
      <button className="square" onClick={props.onClick}>
          {props.squareValue}
      </button>
  );
}


interface BoardProps {
  squares: Array<string | null>,
  onClick(i: number): void,
}

class Board extends React.Component<BoardProps, {}> {
  renderSquare(i: number) {
    return (
      <Square
        key={i}
        squareValue={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
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
        squareList.push(this.renderSquare((r * boardLength) + c));
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
  history: Array<{squares: Array<string | null>}>,
  xIsNext: boolean,
  stepNumber: number,
}

class Game extends React.Component {

  state: GameState = {
    history: [
      {squares: Array(9).fill(null)},
    ],
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
      history: [...history, {squares: squares}],
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
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move #${move}` :
        `Go to game start`;
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next Player: ${this.state.xIsNext ? 'X':'O'}`;
    };
    
    return (
    <div className="game">
        <div className="game-board">
        <Board 
          squares={current.squares}
          onClick={(i) => this.handleClick(i)}
        />
        </div>
        <div className="game-info">
        <div>{ status }</div>
        <ol>{ moves }</ol>
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
      return squares[a];
    }
  }
  return null;
}
