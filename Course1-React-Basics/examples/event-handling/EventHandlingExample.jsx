// event-handling/EventHandlingExample.jsx
import React, { useState } from 'react';

// Basic event handling example
function ButtonExample() {
  const [message, setMessage] = useState('');
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setMessage('Button was clicked!');
    setClickCount(prev => prev + 1);
  };

  const handleMouseOver = () => {
    console.log('Mouse is over the button');
  };

  const handleMouseLeave = () => {
    console.log('Mouse left the button');
  };

  return (
    <div className="button-example">
      <h3>Button Event Example</h3>
      <button 
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      >
        Click me! (Clicked {clickCount} times)
      </button>
      <p>{message}</p>
    </div>
  );
}

// Form handling example
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    newsletter: false
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '', newsletter: false });
      setSubmitted(false);
    }, 2000);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', message: '', newsletter: false });
    setSubmitted(false);
  };

  return (
    <div className="form-example">
      <h3>Form Event Handling</h3>
      {submitted ? (
        <div className="success-message">
          <h4>✅ Form submitted successfully!</h4>
          <p>Thank you for your message, {formData.name}!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message here..."
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleChange}
              />
              Subscribe to newsletter
            </label>
          </div>

          <div className="form-actions">
            <button type="submit">Send Message</button>
            <button type="button" onClick={handleReset}>Reset</button>
          </div>
        </form>
      )}
    </div>
  );
}

// Keyboard event handling
function KeyboardExample() {
  const [keyPressed, setKeyPressed] = useState('');
  const [keyHistory, setKeyHistory] = useState([]);

  const handleKeyDown = (e) => {
    setKeyPressed(e.key);
    setKeyHistory(prev => [...prev.slice(-4), e.key]); // Keep last 5 keys
  };

  const handleKeyUp = () => {
    setKeyPressed('');
  };

  return (
    <div className="keyboard-example">
      <h3>Keyboard Event Handling</h3>
      <div 
        className="keyboard-area"
        tabIndex="0"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        style={{
          border: '2px dashed #ccc',
          padding: '20px',
          margin: '10px 0',
          outline: 'none',
          backgroundColor: keyPressed ? '#e3f2fd' : '#f5f5f5'
        }}
      >
        <p>Click here and press any key!</p>
        <p>Current key: <strong>{keyPressed || 'None'}</strong></p>
        <p>Recent keys: {keyHistory.join(' → ')}</p>
      </div>
    </div>
  );
}

// Custom event handling with multiple events
function InteractiveCard() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  
  const handleMouseDown = () => setIsClicked(true);
  const handleMouseUp = () => setIsClicked(false);
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleDoubleClick = () => {
    alert('Double clicked!');
  };

  return (
    <div className="interactive-card">
      <h3>Interactive Card</h3>
      <div
        className={`card ${isHovered ? 'hovered' : ''} ${isClicked ? 'clicked' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onDoubleClick={handleDoubleClick}
        style={{
          width: '200px',
          height: '150px',
          border: '2px solid #333',
          borderRadius: '8px',
          padding: '20px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          backgroundColor: isHovered ? '#e8f5e8' : '#fff',
          transform: isClicked ? 'scale(0.95)' : 'scale(1)'
        }}
      >
        <p>Hover, click, and move your mouse!</p>
        <p>Position: ({Math.round(position.x)}, {Math.round(position.y)})</p>
        <p>Double-click for alert!</p>
      </div>
    </div>
  );
}

// Main component that demonstrates all event handling examples
function EventHandlingExample() {
  return (
    <div className="event-handling-example">
      <h1>Event Handling Examples</h1>
      <p>React uses synthetic events that work consistently across browsers.</p>
      
      <ButtonExample />
      <ContactForm />
      <KeyboardExample />
      <InteractiveCard />
      
      <div className="tips">
        <h3>💡 Event Handling Tips:</h3>
        <ul>
          <li>Always use camelCase for event handler names (onClick, not onclick)</li>
          <li>Pass functions as event handlers, not function calls</li>
          <li>Use preventDefault() to stop default browser behavior</li>
          <li>Event handlers receive a synthetic event object</li>
          <li>Use arrow functions or bind methods to preserve 'this' context</li>
        </ul>
      </div>
    </div>
  );
}

export default EventHandlingExample;
