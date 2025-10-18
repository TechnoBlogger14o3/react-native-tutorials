# E-commerce Shopping Cart App

## Course 4 Project: Advanced State Management (Mobile)

A complete React Native e-commerce shopping cart application demonstrating advanced state management patterns using Context API and AsyncStorage.

## Features

### 🛒 Shopping Cart Functionality
- **Add/Remove Items**: Add products to cart and remove them
- **Quantity Management**: Increase/decrease item quantities
- **Cart Persistence**: Cart state persists across app restarts using AsyncStorage
- **Real-time Updates**: Cart updates instantly across all screens

### 📱 Mobile-Optimized UI
- **Touch-Friendly**: Large touch targets for mobile interaction
- **Responsive Design**: Adapts to different screen sizes
- **Native Feel**: Uses React Native components for authentic mobile experience
- **Smooth Animations**: Smooth transitions and interactions

### 🏪 Product Management
- **Product Catalog**: Browse available products
- **Product Details**: Detailed product information
- **Search & Filter**: Find products quickly
- **Categories**: Organized product categories

### 💾 State Management Patterns
- **Context API**: Global state management for cart and user data
- **AsyncStorage**: Persistent storage for cart and user preferences
- **Custom Hooks**: Reusable state logic
- **Reducer Pattern**: Complex state updates with useReducer

## Project Structure

```
shopping-cart/
├── src/
│   ├── components/
│   │   ├── ProductCard/
│   │   ├── CartItem/
│   │   ├── Header/
│   │   └── LoadingSpinner/
│   ├── screens/
│   │   ├── HomeScreen/
│   │   ├── ProductScreen/
│   │   ├── CartScreen/
│   │   └── ProfileScreen/
│   ├── context/
│   │   ├── CartContext.js
│   │   └── UserContext.js
│   ├── hooks/
│   │   ├── useCart.js
│   │   └── useAsyncStorage.js
│   ├── services/
│   │   ├── storageService.js
│   │   └── productService.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   └── utils/
│       ├── constants.js
│       └── helpers.js
├── App.js
└── index.js
```

## Key Learning Concepts

### 1. Context API Implementation
- Creating and providing context
- Custom hooks for context consumption
- Avoiding prop drilling
- Performance optimization with context

### 2. AsyncStorage Integration
- Persistent data storage
- Error handling for storage operations
- Data serialization/deserialization
- Storage service abstraction

### 3. Advanced State Patterns
- useReducer for complex state logic
- Custom hooks for reusable state
- State normalization
- Optimistic updates

### 4. Mobile-Specific Features
- Touch interactions
- Mobile navigation patterns
- Offline data handling
- Performance optimization

## Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **iOS Setup** (if targeting iOS):
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Run the App**:
   ```bash
   # Android
   npm run android
   
   # iOS
   npm run ios
   ```

## Usage

1. **Browse Products**: Navigate through the product catalog
2. **Add to Cart**: Tap products to add them to your cart
3. **Manage Cart**: Adjust quantities or remove items
4. **Persistent Cart**: Your cart persists even after closing the app
5. **User Profile**: Manage user preferences and settings

## Technical Implementation

### Context API Setup
```javascript
// CartContext.js
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  
  const addToCart = (product) => dispatch({ type: 'ADD_TO_CART', product });
  const removeFromCart = (id) => dispatch({ type: 'REMOVE_FROM_CART', id });
  
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
```

### AsyncStorage Integration
```javascript
// storageService.js
export const saveCartToStorage = async (cart) => {
  try {
    await AsyncStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

export const loadCartFromStorage = async () => {
  try {
    const cart = await AsyncStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
};
```

### Custom Hooks
```javascript
// useCart.js
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
```

## Learning Outcomes

After completing this project, you will understand:

1. **Advanced State Management**: How to manage complex application state
2. **Context API Patterns**: When and how to use Context API effectively
3. **Data Persistence**: How to persist data in React Native applications
4. **Custom Hooks**: Creating reusable state logic
5. **Mobile UX**: Designing mobile-first user experiences
6. **Performance**: Optimizing React Native applications
7. **Error Handling**: Robust error handling patterns

## Next Steps

This project prepares you for:
- **Course 5**: Offline Support & Optimization
- **Production Apps**: Real-world mobile applications
- **Advanced Patterns**: Redux, Zustand, and other state management libraries
- **Mobile Performance**: Optimization techniques for mobile apps

## Troubleshooting

### Common Issues
1. **Metro bundler issues**: Clear cache with `npx react-native start --reset-cache`
2. **iOS build issues**: Clean build folder in Xcode
3. **Android build issues**: Clean gradle cache with `cd android && ./gradlew clean`

### Performance Tips
1. Use `FlatList` for large product lists
2. Implement proper `keyExtractor` for list items
3. Use `React.memo` for expensive components
4. Optimize images with proper sizing

---

**Happy Shopping! 🛒📱**
