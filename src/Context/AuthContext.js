// src/Context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? firebaseUser.uid : 'No user');
      
      if (firebaseUser) {
        // User is signed in
        setUser(firebaseUser);
        setIsAuthenticated(true);
      } else {
        // User is signed out
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const logout = async () => {
    // try {
    //   await auth().signOut();
    //   // The onAuthStateChanged listener will handle state updates
    //   console.log('User logged out successfully');
    // } catch (error) {
    //   console.error('Logout error:', error);
    //   throw error;
    // }
  setUser(null);
  setIsAuthenticated(false);
  navigation.navigate('MyOrders')

  };

  const value = {
    isAuthenticated,
    setIsAuthenticated, // Keep this for backward compatibility if needed
    user,
    loading,
    logout,
    // Additional user info from Firebase
    userPhoneNumber: user?.phoneNumber || null,
    userId: user?.uid || null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};