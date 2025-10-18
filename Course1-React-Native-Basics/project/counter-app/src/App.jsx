// counter-app/src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const [history, setHistory] = useState([]);
  const [isPositive, setIsPositive] = useState(true);

  // Load saved count from localStorage on component mount
  useEffect(() => {
    const savedCount = localStorage.getItem('counterCount');
    const savedStep = localStorage.getItem('counterStep');
    const savedHistory = localStorage.getItem('counterHistory');
    
    if (savedCount) setCount(parseInt(savedCount));
    if (savedStep) setStep(parseInt(savedStep));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Save count and step to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('counterCount', count.toString());
    localStorage.setItem('counterStep', step.toString());
    localStorage.setItem('counterHistory', JSON.stringify(history));
  }, [count, step, history]);

  // Update positive/negative state
  useEffect(() => {
    setIsPositive(count >= 0);
  }, [count]);

  const increment = () => {
    const newCount = count + step;
    setCount(newCount);
    addToHistory(`+${step}`, newCount);
  };

  const decrement = () => {
    const newCount = count - step;
    setCount(newCount);
    addToHistory(`-${step}`, newCount);
  };

  const reset = () => {
    setCount(0);
    addToHistory('Reset', 0);
  };

  const double = () => {
    const newCount = count * 2;
    setCount(newCount);
    addToHistory('×2', newCount);
  };

  const square = () => {
    const newCount = count * count;
    setCount(newCount);
    addToHistory('²', newCount);
  };

  const addToHistory = (operation, newValue) => {
    const historyItem = {
      id: Date.now(),
      operation,
      previousValue: count,
      newValue,
      timestamp: new Date().toLocaleTimeString()
    };
    setHistory(prev => [historyItem, ...prev.slice(0, 4)]); // Keep last 5 operations
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const Button = ({ onClick, className = '', children, disabled = false }) => (
    <button 
      className={`counter-button ${className}`} 
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );

  return (
    <div className="counter-app">
      <div className="counter-container">
        <div className="counter-header">
          <h1>Enhanced Counter App</h1>
          <p>Course 1: React Basics - Project</p>
        </div>

        <div className={`counter-display ${isPositive ? 'positive' : 'negative'}`}>
          <div className="count-value">{count}</div>
          <div className="count-label">
            {isPositive ? 'Positive' : 'Negative'} Number
          </div>
        </div>

        <div className="step-controls">
          <h3>Step Size</h3>
          <div className="step-buttons">
            {[1, 5, 10, 25].map(stepSize => (
              <Button
                key={stepSize}
                onClick={() => setStep(stepSize)}
                className={step === stepSize ? 'active' : ''}
              >
                {stepSize}
              </Button>
            ))}
          </div>
          <p>Current step: <strong>{step}</strong></p>
        </div>

        <div className="counter-controls">
          <div className="control-row">
            <Button onClick={decrement} className="decrement-button">
              -{step}
            </Button>
            <Button onClick={increment} className="increment-button">
              +{step}
            </Button>
          </div>

          <div className="control-row">
            <Button onClick={double} className="operation-button">
              Double
            </Button>
            <Button onClick={square} className="operation-button">
              Square
            </Button>
          </div>

          <div className="control-row">
            <Button onClick={reset} className="reset-button">
              Reset
            </Button>
          </div>
        </div>

        <div className="history-section">
          <div className="history-header">
            <h3>Recent Operations</h3>
            <Button onClick={clearHistory} className="clear-history-button">
              Clear History
            </Button>
          </div>
          
          {history.length === 0 ? (
            <p className="no-history">No operations yet. Start counting!</p>
          ) : (
            <div className="history-list">
              {history.map(item => (
                <div key={item.id} className="history-item">
                  <div className="history-operation">
                    {item.previousValue} {item.operation} = {item.newValue}
                  </div>
                  <div className="history-time">{item.timestamp}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="features-info">
          <h3>Features Implemented:</h3>
          <ul>
            <li>✅ Increment/Decrement with custom step sizes</li>
            <li>✅ Double and Square operations</li>
            <li>✅ Operation history tracking</li>
            <li>✅ Color-coded positive/negative numbers</li>
            <li>✅ localStorage persistence</li>
            <li>✅ Responsive design</li>
            <li>✅ Reset functionality</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
