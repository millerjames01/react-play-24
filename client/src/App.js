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
      <a href="/#" className="Nav-button">View Code</a> 
    </nav>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numbers: [1, 4, 7, 9],
      usedNumbers:  [false, false, false, false],
      expression: ""
    }
    this.clickNumber = this.clickNumber.bind(this);
    this.clickOperator = this.clickOperator.bind(this);
    this.reset = this.reset.bind(this);
    this.backspace = this.backspace.bind(this);
  }

  clickNumber(number) {
    var i = this.state.numbers.indexOf(number);
    let usedNumbers = [...this.state.usedNumbers];
    usedNumbers[i] = !usedNumbers[i];
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
        var i = this.state.numbers.indexOf(result);
        usedNumbers = [...this.state.usedNumbers];
        usedNumbers[i] = !usedNumbers[i];
        this.setState({
          usedNumbers: usedNumbers
        });
      }
      this.setState((state) => ({
        expression: state.expression.substring(0, len - 2)
      }));
    }
  }

  render() {
    return (
      <div className="Game">
        <DisplayArea usedNumbers={this.state.usedNumbers} expression={this.state.expression} />
        <Controls numbers={this.state.numbers} usedNumbers={this.state.usedNumbers} 
          clickNumber={this.clickNumber} clickOperator={this.clickOperator} reset={this.reset} backspace={this.backspace} />
      </div>
    );
  }
}

function DisplayArea(props) {
  var result = evalCatchErrors(props.expression);

  if(!isNumeric(result)) {
    result = "#";
  }

  var hasWon = result === 24 && props.usedNumbers.reduce((x, y) => x && y, true);

  return (
    <div className="DisplayArea">
      <div className="DisplayArea-expression">
        {(props.expression === "" && <span className="Gray">Combine the numbers to reach 24</span>) 
        || props.expression }
      </div>
      <div className="DisplayArea-result">{result}</div> 
      {hasWon && (<div className="DisplayArea-message">You win!!!</div>) } 
    </div>
  );
    
}

function Controls(props) {
  return (
    <div className="Controls">
      <div className="Controls-row">
        {props.numbers.map((number, index) => {
          var isUsed = props.usedNumbers[index];
          return <NumberButton key={index} number={number} isUsed={isUsed} handleClick={() => {props.clickNumber(number)}} />;
        })}
      </div>
      <div className="Controls-row">
        {['(', ')', '*', '+', '-', '/'].map((operator) => {
          return <OperatorButton key={operator} operator={operator} handleClick={() => {props.clickOperator(operator)}} />;
        })}
      </div>
      <div className="Controls-row">
        <ResetButton  handleClick={() => {props.reset()}}/>
        <BackspaceButton handleClick={() => {props.backspace()}}/>
      </div>
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

export default App;
