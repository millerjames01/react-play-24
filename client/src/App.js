import React from 'react';
import logo from './logo.svg';
import './App.css';
import math, { evaluate, isNumeric } from 'mathjs';

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
      <a href="#" className="Nav-button">View Code</a> 
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

  render() {
    return (
      <div className="Game">
        <ResultArea usedNumbers={this.state.usedNumbers} expression={this.state.expression} />
        <Controls numbers={this.state.numbers} usedNumbers={this.state.usedNumbers} 
          clickNumber={this.clickNumber} clickOperator={this.clickOperator} />
      </div>
    );
  }
}

function ResultArea(props) {
  var result;

  try {
    result = evaluate(props.expression);
  } catch (e) {
    result = "Still working...";
  }

  if(!isNumeric(result)) {
    result = "Still working..."
  }

  var hasWon = result === 24 && props.usedNumbers.reduce((x, y) => x && y, true);

  return (
    <div className="ResultArea">
      <div>{props.expression} </div> <div>{' = ' + result}</div> {hasWon && (<div>You win!!!</div>) } 
    </div>
  );
    
}

// Still working on this.
class ShowResult extends React.Component {
  cosntructor(props) {
    super(props)
    this.state.result = props.result;
  }
}

function Controls(props) {
  return (
    <div className="Controls">
      <div className="Controls-numberRow">
        {props.numbers.map((number, index) => {
          var isUsed = props.usedNumbers[index];
          return <NumberButton key={index} number={number} isUsed={isUsed} handleClick={() => {props.clickNumber(number)}} />;
        })}
      </div>
      <div className="Controls-operatorRow">
        {['(', ')', '*', '+', '-', '/'].map((operator) => {
          return <OperatorButton key={operator} operator={operator} handleClick={() => {props.clickOperator(operator)}} />;
        })}
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

export default App;
