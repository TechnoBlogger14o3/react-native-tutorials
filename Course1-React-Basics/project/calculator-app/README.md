# Calculator App - Course 1 Project

A fully functional calculator application built with React as part of Course 1: React Basics.

## 🎯 Project Goals

- Practice React fundamentals (components, state, props)
- Implement event handling for user interactions
- Apply conditional rendering for different states
- Build a complete, working application

## ✨ Features

- **Basic Operations**: Addition, subtraction, multiplication, division
- **Decimal Support**: Handle decimal numbers
- **Clear Functionality**: Reset calculator state
- **Error Handling**: Prevent division by zero
- **Continuous Calculations**: Chain operations
- **Responsive Design**: Works on all screen sizes

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd Course1-React-Basics/project/calculator-app
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
calculator-app/
├── src/
│   ├── App.jsx          # Main calculator component
│   ├── App.css          # Calculator styles
│   └── main.jsx         # Application entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## 🧠 Key Concepts Demonstrated

### State Management
- Using `useState` hook to manage calculator state
- Managing multiple state variables (display, previousValue, operation)
- State updates with proper immutability

### Event Handling
- Button click handlers for numbers and operations
- Form submission handling
- Event delegation patterns

### Conditional Rendering
- Different display states based on calculator state
- Error state handling
- Loading states (if applicable)

### Component Design
- Single responsibility principle
- Reusable button component
- Clean separation of concerns

## 🔧 Technical Implementation

### State Structure
```jsx
const [display, setDisplay] = useState('0');
const [previousValue, setPreviousValue] = useState(null);
const [operation, setOperation] = useState(null);
const [waitingForNewValue, setWaitingForNewValue] = useState(false);
```

### Key Functions
- `inputNumber()` - Handle number input
- `performOperation()` - Handle operation selection
- `calculate()` - Perform mathematical calculations
- `clear()` - Reset calculator state

## 🎨 Styling

The calculator features:
- Modern, clean design
- Responsive layout
- Smooth animations
- Color-coded buttons
- Professional typography

## 🧪 Testing the App

Try these test cases:
1. **Basic Operations**: 5 + 3 = 8
2. **Decimal Numbers**: 3.14 + 2.86 = 6
3. **Division by Zero**: 5 ÷ 0 (should show error)
4. **Continuous Operations**: 2 + 3 × 4 = 20
5. **Clear Function**: Reset after any operation

## 📚 Learning Outcomes

After completing this project, you should understand:
- How to manage complex state in React
- Event handling patterns in React
- Component composition techniques
- Conditional rendering strategies
- Basic CSS styling for React components

## 🚀 Next Steps

1. **Enhance the Calculator**:
   - Add keyboard support
   - Implement memory functions (M+, M-, MR, MC)
   - Add scientific calculator features
   - Implement calculation history

2. **Move to Course 2**:
   - Learn about component composition
   - Master React Router
   - Build multi-page applications

## 🤝 Contributing

Feel free to fork this project and add your own features:
- Additional mathematical operations
- Better error handling
- Enhanced UI/UX
- Unit tests

## 📄 License

This project is part of the React Tutorial Series and is licensed under the MIT License.

---

**Happy coding!** 🚀
