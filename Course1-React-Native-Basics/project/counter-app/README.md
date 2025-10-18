# Counter App - Course 1 Project

An enhanced counter application with advanced features built with React as part of Course 1: React Basics.

## 🎯 Project Goals

- Practice advanced React state management
- Implement localStorage persistence
- Learn useEffect hook for side effects
- Build interactive components with multiple features

## ✨ Features

- **Custom Step Sizes**: Increment/decrement by 1, 5, 10, or 25
- **Operation History**: Track last 5 operations with timestamps
- **Color-coded Display**: Visual feedback for positive/negative numbers
- **Advanced Operations**: Double and square functions
- **Persistent State**: Saves counter value and history to localStorage
- **Responsive Design**: Works on all device sizes

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd Course1-React-Basics/project/counter-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`

## 🏗️ Project Structure

```
counter-app/
├── src/
│   ├── App.jsx          # Main counter component
│   ├── App.css          # Counter styles
│   └── main.jsx         # Application entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## 🧠 Key Concepts Demonstrated

### Advanced State Management
- Multiple state variables working together
- Complex state updates with arrays
- State persistence with localStorage

### useEffect Hook
- Loading data on component mount
- Saving data when state changes
- Cleanup functions for side effects

### Event Handling
- Multiple button interactions
- Form input handling
- Dynamic event handlers

### Data Persistence
- localStorage integration
- JSON serialization/deserialization
- Error handling for storage operations

## 🔧 Technical Implementation

### State Structure
```jsx
const [count, setCount] = useState(0);
const [step, setStep] = useState(1);
const [history, setHistory] = useState([]);
const [isPositive, setIsPositive] = useState(true);
```

### Key Functions
- `increment()` - Increase counter by step
- `decrement()` - Decrease counter by step
- `double()` - Multiply counter by 2
- `square()` - Square the counter value
- `addToHistory()` - Track operations
- `reset()` - Reset counter to 0

### useEffect Patterns
```jsx
// Load saved data on mount
useEffect(() => {
  const savedCount = localStorage.getItem('counterCount');
  const savedStep = localStorage.getItem('counterStep');
  const savedHistory = localStorage.getItem('counterHistory');
  
  if (savedCount) setCount(parseInt(savedCount));
  if (savedStep) setStep(parseInt(savedStep));
  if (savedHistory) setHistory(JSON.parse(savedHistory));
}, []);

// Save data when state changes
useEffect(() => {
  localStorage.setItem('counterCount', count.toString());
  localStorage.setItem('counterStep', step.toString());
  localStorage.setItem('counterHistory', JSON.stringify(history));
}, [count, step, history]);
```

## 🎨 Styling Features

- **Dynamic Colors**: Blue for positive, gradient for negative numbers
- **Smooth Animations**: Hover effects and transitions
- **Responsive Layout**: Adapts to different screen sizes
- **Modern Design**: Clean, professional appearance
- **Interactive Elements**: Visual feedback for all interactions

## 🧪 Testing the App

Try these features:
1. **Step Size Changes**: Switch between 1, 5, 10, 25
2. **Operation History**: Perform multiple operations and check history
3. **Persistence**: Refresh the page and see if data is saved
4. **Advanced Operations**: Try double and square functions
5. **Reset Function**: Clear counter and history

## 📚 Learning Outcomes

After completing this project, you should understand:
- How to use useEffect for side effects
- localStorage integration patterns
- Complex state management techniques
- Array operations in React state
- Component lifecycle concepts

## 🚀 Next Steps

1. **Enhance the Counter**:
   - Add more mathematical operations
   - Implement undo/redo functionality
   - Add sound effects
   - Create different counter themes

2. **Move to Course 2**:
   - Learn about component composition
   - Master React Router
   - Build multi-page applications

## 🔧 Advanced Features to Add

- **Multiple Counters**: Track several counters simultaneously
- **Counter Groups**: Organize counters by category
- **Export/Import**: Save counter data to files
- **Statistics**: Track usage patterns
- **Keyboard Shortcuts**: Use arrow keys for increment/decrement

## 🤝 Contributing

Feel free to fork this project and add your own features:
- Additional mathematical operations
- Better data visualization
- Enhanced UI/UX
- Unit tests

## 📄 License

This project is part of the React Tutorial Series and is licensed under the MIT License.

---

**Happy counting!** 🚀
