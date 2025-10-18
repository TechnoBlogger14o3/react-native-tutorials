// calculator-app/src/App.jsx
import React, { useState } from 'react';
import './App.css';

function App() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputNumber = (num) => {
    if (waitingForNewValue) {
      setDisplay(String(num));
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        if (secondValue === 0) {
          alert('Cannot divide by zero!');
          return firstValue;
        }
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const equals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const Button = ({ onClick, className = '', children }) => (
    <button className={`calculator-button ${className}`} onClick={onClick}>
      {children}
    </button>
  );

  return (
    <div className="calculator-app">
      <div className="calculator">
        <div className="calculator-header">
          <h1>React Calculator</h1>
          <p>Course 1: React Basics - Project</p>
        </div>
        
        <div className="calculator-display">
          <div className="display-value">{display}</div>
        </div>

        <div className="calculator-buttons">
          <div className="button-row">
            <Button onClick={clear} className="function-button">C</Button>
            <Button onClick={() => performOperation('÷')} className="operator-button">÷</Button>
            <Button onClick={() => performOperation('×')} className="operator-button">×</Button>
            <Button onClick={() => performOperation('-')} className="operator-button">-</Button>
          </div>

          <div className="button-row">
            <Button onClick={() => inputNumber(7)}>7</Button>
            <Button onClick={() => inputNumber(8)}>8</Button>
            <Button onClick={() => inputNumber(9)}>9</Button>
            <Button onClick={() => performOperation('+')} className="operator-button">+</Button>
          </div>

          <div className="button-row">
            <Button onClick={() => inputNumber(4)}>4</Button>
            <Button onClick={() => inputNumber(5)}>5</Button>
            <Button onClick={() => inputNumber(6)}>6</Button>
            <Button onClick={equals} className="equals-button">=</Button>
          </div>

          <div className="button-row">
            <Button onClick={() => inputNumber(1)}>1</Button>
            <Button onClick={() => inputNumber(2)}>2</Button>
            <Button onClick={() => inputNumber(3)}>3</Button>
            <Button onClick={equals} className="equals-button">=</Button>
          </div>

          <div className="button-row">
            <Button onClick={() => inputNumber(0)} className="zero-button">0</Button>
            <Button onClick={inputDecimal}>.</Button>
            <Button onClick={equals} className="equals-button">=</Button>
          </div>
        </div>

        <div className="calculator-info">
          <h3>Features Implemented:</h3>
          <ul>
            <li>✅ Basic arithmetic operations (+, -, ×, ÷)</li>
            <li>✅ Decimal number support</li>
            <li>✅ Clear functionality</li>
            <li>✅ Error handling (division by zero)</li>
            <li>✅ Continuous calculations</li>
            <li>✅ Responsive design</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
