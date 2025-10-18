import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cart Context
const CartContext = createContext();

// Cart Actions
const CART_ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART',
};

// Initial State
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: true,
};

// Cart Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload.items || [],
        totalItems: action.payload.totalItems || 0,
        totalPrice: action.payload.totalPrice || 0,
        isLoading: false,
      };

    case CART_ACTIONS.ADD_TO_CART:
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      let newItems;
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      const newTotalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: newItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
      };

    case CART_ACTIONS.REMOVE_FROM_CART:
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      const filteredTotalItems = filteredItems.reduce((sum, item) => sum + item.quantity, 0);
      const filteredTotalPrice = filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: filteredItems,
        totalItems: filteredTotalItems,
        totalPrice: filteredTotalPrice,
      };

    case CART_ACTIONS.UPDATE_QUANTITY:
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);

      const updatedTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const updatedTotalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: updatedItems,
        totalItems: updatedTotalItems,
        totalPrice: updatedTotalPrice,
      };

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };

    default:
      return state;
  }
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from AsyncStorage on app start
  useEffect(() => {
    loadCartFromStorage();
  }, []);

  // Save cart to AsyncStorage whenever cart changes
  useEffect(() => {
    if (!state.isLoading) {
      saveCartToStorage();
    }
  }, [state.items, state.totalItems, state.totalPrice]);

  // Load cart from AsyncStorage
  const loadCartFromStorage = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('shopping_cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        dispatch({
          type: CART_ACTIONS.LOAD_CART,
          payload: cartData,
        });
      } else {
        dispatch({
          type: CART_ACTIONS.LOAD_CART,
          payload: initialState,
        });
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      dispatch({
        type: CART_ACTIONS.LOAD_CART,
        payload: initialState,
      });
    }
  };

  // Save cart to AsyncStorage
  const saveCartToStorage = async () => {
    try {
      const cartData = {
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
      };
      await AsyncStorage.setItem('shopping_cart', JSON.stringify(cartData));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  };

  // Cart Actions
  const addToCart = (product) => {
    dispatch({
      type: CART_ACTIONS.ADD_TO_CART,
      payload: product,
    });
  };

  const removeFromCart = (productId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_FROM_CART,
      payload: productId,
    });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id: productId, quantity },
    });
  };

  const clearCart = () => {
    dispatch({
      type: CART_ACTIONS.CLEAR_CART,
    });
  };

  const isInCart = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const contextValue = {
    // State
    items: state.items,
    totalItems: state.totalItems,
    totalPrice: state.totalPrice,
    isLoading: state.isLoading,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook to use Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
