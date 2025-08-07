import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator } from 'react-native';
import colors from '../constants/colors';
import { useAuth } from '../Context/AuthContext';
import AppStack from './AppStack';




// Loading Component
const LoadingScreen = () => (
  <View style={{ 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff'
  }}>
    <ActivityIndicator size="large" color={colors.Primary} />
    <Text style={{ 
      marginTop: 20, 
      fontSize: 16, 
      color: colors.Primary,
      fontWeight: '600'
    }}>
      Loading Tiffin Wala...
    </Text>
  </View>
);

// Main navigator with auth logic
const MainNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  return (
    <NavigationContainer>
      {loading ? <LoadingScreen /> : <AppStack />}

    </NavigationContainer>
  );
};

export default MainNavigator;