import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// User Context
const UserContext = createContext();

// User Actions
const USER_ACTIONS = {
  SET_USER: 'SET_USER',
  UPDATE_USER: 'UPDATE_USER',
  LOGOUT: 'LOGOUT',
  LOAD_USER: 'LOAD_USER',
  SET_PREFERENCES: 'SET_PREFERENCES',
};

// Initial State
const initialState = {
  user: null,
  preferences: {
    theme: 'light',
    notifications: true,
    currency: 'USD',
    language: 'en',
  },
  isLoading: true,
};

// User Reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case USER_ACTIONS.LOAD_USER:
      return {
        ...state,
        user: action.payload.user,
        preferences: action.payload.preferences || state.preferences,
        isLoading: false,
      };

    case USER_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isLoading: false,
      };

    case USER_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case USER_ACTIONS.SET_PREFERENCES:
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      };

    case USER_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        preferences: initialState.preferences,
      };

    default:
      return state;
  }
};

// User Provider Component
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Load user data from AsyncStorage on app start
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  // Save user preferences to AsyncStorage whenever they change
  useEffect(() => {
    if (!state.isLoading && state.user) {
      saveUserToStorage();
    }
  }, [state.user, state.preferences]);

  // Load user from AsyncStorage
  const loadUserFromStorage = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user_data');
      const savedPreferences = await AsyncStorage.getItem('user_preferences');
      
      if (savedUser || savedPreferences) {
        dispatch({
          type: USER_ACTIONS.LOAD_USER,
          payload: {
            user: savedUser ? JSON.parse(savedUser) : null,
            preferences: savedPreferences ? JSON.parse(savedPreferences) : initialState.preferences,
          },
        });
      } else {
        dispatch({
          type: USER_ACTIONS.LOAD_USER,
          payload: {
            user: null,
            preferences: initialState.preferences,
          },
        });
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      dispatch({
        type: USER_ACTIONS.LOAD_USER,
        payload: {
          user: null,
          preferences: initialState.preferences,
        },
      });
    }
  };

  // Save user to AsyncStorage
  const saveUserToStorage = async () => {
    try {
      if (state.user) {
        await AsyncStorage.setItem('user_data', JSON.stringify(state.user));
      }
      await AsyncStorage.setItem('user_preferences', JSON.stringify(state.preferences));
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  };

  // User Actions
  const setUser = (userData) => {
    dispatch({
      type: USER_ACTIONS.SET_USER,
      payload: userData,
    });
  };

  const updateUser = (userData) => {
    dispatch({
      type: USER_ACTIONS.UPDATE_USER,
      payload: userData,
    });
  };

  const setPreferences = (preferences) => {
    dispatch({
      type: USER_ACTIONS.SET_PREFERENCES,
      payload: preferences,
    });
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user_data');
      await AsyncStorage.removeItem('user_preferences');
      dispatch({
        type: USER_ACTIONS.LOGOUT,
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const login = (userData) => {
    setUser(userData);
  };

  const contextValue = {
    // State
    user: state.user,
    preferences: state.preferences,
    isLoading: state.isLoading,
    isLoggedIn: !!state.user,
    
    // Actions
    setUser,
    updateUser,
    setPreferences,
    logout,
    login,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook to use User Context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
