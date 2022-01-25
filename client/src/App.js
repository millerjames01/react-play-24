import React from 'react';
import './App.css';
import { evaluate, isNumeric } from 'mathjs';

function App() {
  return (
    <div className="App">
      <Nav />
      <Game />
    </div>
  );
}

function Nav() {
  return (
    <nav className="Nav">
      <a href="/" className="Nav-header">Play 24</a>
      <a href="https://github.com/millerjames01/react-play-24" className="Nav-button">View Code</a> 
    </nav>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numbers: [4, 5, 6, 7],
      usedNumbers:  [false, false, false, false],
      expression: ""
    }
    this.clickNumber = this.clickNumber.bind(this);
    this.clickOperator = this.clickOperator.bind(this);
    this.reset = this.reset.bind(this);
    this.backspace = this.backspace.bind(this);
    this.newPuzzle = this.newPuzzle.bind(this);
  }

  async componentDidMount() {
    var jsonResponse = await fetchNewProblem();
    this.setState({
      numbers: jsonResponse.puzzle.numbers
    });
  }

  clickNumber(number, index) {
    let usedNumbers = [...this.state.usedNumbers];
    usedNumbers[index] = true;
    this.setState((state) => ({
      usedNumbers: usedNumbers,
      expression: state.expression + number + ' '
    }));
  }

  clickOperator(operator) {
    this.setState((state) => ({
      expression: state.expression + operator + ' '
    }));
  }

  reset() {
    this.setState({
      expression: "",
      usedNumbers: [false, false, false, false]
    });
  }

  backspace() {
    var len = this.state.expression.length;
    if(len > 0) {
      var lastPress = this.state.expression.substring(len - 2, len - 1);
      var result = evalCatchErrors(lastPress);
      var usedNumbers = [...this.state.usedNumbers];
      if(isNumeric(result)) {
        var changed = false;
        var index = 0;
        while(!changed) {
          var i = this.state.numbers.indexOf(result, index);
          if(usedNumbers[i]) {
            usedNumbers = [...this.state.usedNumbers];
            usedNumbers[i] = false;
            this.setState({
              usedNumbers: usedNumbers
            });
            changed = true;
          } else {
            index = i + 1;
          }
        }
      }
      this.setState((state) => ({
        expression: state.expression.substring(0, len - 2)
      }));
    }
  }

  async newPuzzle() {
    var jsonResponse = await fetchNewProblem();
    this.setState({
      numbers: jsonResponse.puzzle.numbers,
      usedNumbers: [false, false, false, false],
      expression: ""
    });
  }

  getResult() {
    var expr = this.state.expression.replace('×', '*').replace('÷', '/');
    var result = evalCatchErrors(expr);

    if(!isNumeric(result)) {
      result = "#";
    }

    return result;
  }

  hasWon() {
    return this.getResult() === 24 && this.state.usedNumbers.reduce((x, y) => x && y, true);
  }

  render() {
    return (
      <div className="Game">
        <NewPuzzleButton newPuzzle={this.newPuzzle} message={"New Puzzle"}/>
        <DisplayArea result={this.getResult()} expression={this.state.expression} />
        <Controls hasWon={this.hasWon()} numbers={this.state.numbers} usedNumbers={this.state.usedNumbers} newPuzzle={this.newPuzzle}
          clickNumber={this.clickNumber} clickOperator={this.clickOperator} reset={this.reset} backspace={this.backspace} />
      </div>
    );
  }
}

function NewPuzzleButton(props) {
  return (
    <div className="NewPuzzleButton" onClick={props.newPuzzle}>
      {props.message}
    </div>
  );
}

function DisplayArea(props) {
  return (
    <div className="DisplayArea">
      <div className="DisplayArea-expression">
        {(props.expression === "" && <span className="Gray">Combine the numbers to reach 24</span>) 
        || props.expression }
      </div>
      <div className="DisplayArea-result">{props.result}</div> 
    </div>
  );
    
}

function Controls(props) {
  return (
    <div className="Controls">
      {(props.hasWon && <WinMessage newPuzzle={props.newPuzzle}/>) || (
        <div className="Controls-container">
          <div className="Controls-row">
            {props.numbers.map((number, index) => {
              var isUsed = props.usedNumbers[index];
              return <NumberButton key={index} number={number} isUsed={isUsed} handleClick={() => {props.clickNumber(number, index)}} />;
            })}
          </div>
          <div className="Controls-row">
            {['(', ')', '×', '+', '-', '÷'].map((operator) => {
              return <OperatorButton key={operator} operator={operator} handleClick={() => {props.clickOperator(operator)}} />;
            })}
          </div>
          <div className="Controls-row">
            <ResetButton  handleClick={() => {props.reset()}}/>
            <BackspaceButton handleClick={() => {props.backspace()}}/>
          </div>
        </div>
      )}
    </div>
  );
}

function WinMessage(props) {
  return (
    <div className="WinMessage">
      You win!<br></br>=)
      <NewPuzzleButton newPuzzle={props.newPuzzle} message={"Play again?"} />
    </div>
  );
}

function NumberButton(props) {
  if(props.isUsed) {
    return <div className="NumberButton"></div>;
  } else {
    return <div className="NumberButton" onClick={props.handleClick}>{props.number}</div>;
  }
}

function OperatorButton(props) {
  return <div className="OperatorButton" onClick={props.handleClick}>{props.operator}</div>;
}

function ResetButton(props) {
  return <div className="ResetButton" onClick={props.handleClick}>RESET</div>;
}

function BackspaceButton(props) {
  return <div className="BackspaceButton" onClick={props.handleClick}>&lt;-</div>;
}

function evalCatchErrors(expr) {
  try {
    return evaluate(expr);
  } catch (e) {
    return '#';
  }
}

async function fetchNewProblem() {
  return await fetch('/new-problem', {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("HTTP status " + response.status);
    }
    return response.json();
  })
  .catch((err) => {
    console.log(err);
  });
}

export default App;