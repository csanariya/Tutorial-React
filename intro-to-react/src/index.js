import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" 
            onClick={() => props.onClick()} >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
  renderSquare(x,y) {
    return (
        <Square key={y} value={this.props.squares[x][y]} 
            onClick={() => this.props.onClick(x,y)} />);
  }

  render() {
    let rows = [];
    for (var x = 0; x < this.props.squares.length; x++){
        //setup row
        let rowCells = [];
        for (var y = 0; y < this.props.squares[x].length; y++){
            //setup cell
            rowCells.push(this.renderSquare(x,y));
        }
        
        rows.push(
            <div id={x} key={x} className="board-row">
                {rowCells}
            </div>
        );
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(){
    super();
    this.state = {
        history: [{
            squares: [Array(3).fill(null),Array(3).fill(null),Array(3).fill(null)],
            cell: ""
        }],
        xIsNext: true,
        stepNumber: 0
    };
  }
  
  handleClick(x,y) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    //.slice only does a shallow copy, which is fine for 1D arrays. 
    //for multiD arrays, need to map further
    var squares = current.squares.slice().map( function(row){ return row.slice(); });
    
    if (squares[x][y] || calculateWinner(squares)) {
        return;
    }
    
    squares[x][y] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
        history: history.concat([{
            squares: squares,
            cell: x + ',' + y
        }]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length
    });
  }

  jumpTo(step) {
      this.setState({
          stepNumber: step,
          xIsNext: (step % 2) ? false : true
      })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
        const desc = move ? 
            "Move " + step.cell :
            "Game Start";
        return (
            <li key={move}>
                <a href="#" onClick={()=> this.jumpTo(move)}>{desc}</a>
            </li>
        );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    
    return (
      <div className="game">
        <div className="game-board">
            <Board
                squares={current.squares}
                onClick={(i,c) => this.handleClick(i,c)}
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

function calculateWinner(squares) {
  const lines = [
    [[0,0], [0,1], [0,2]],
    [[1,0], [1,1], [1,2]],
    [[2,0], [2,1], [2,2]],
    [[0,0], [1,0], [2,0]],
    [[0,1], [1,1], [2,1]],
    [[0,2], [1,2], [2,2]],
    [[0,0], [1,1], [2,2]],
    [[0,2], [1,1], [2,0]]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    
    if (squares[a[0]][a[1]] && 
        squares[a[0]][a[1]] === squares[b[0]][b[1]] && 
        squares[a[0]][a[1]] === squares[c[0]][c[1]]) {
      return squares[a[0]][a[1]];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
    <div>
        <Game />
    </div>,
  document.getElementById('root')
);
