import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LoginScreen from '../screens/Auth/LoginScreen'
import OTPScreen from '../screens/Auth/OTPSceen'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
     <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name='Login' component={LoginScreen} />
    <Stack.Screen name='OTPScreen' component={OTPScreen} />
  </Stack.Navigator>
  )
}

export default AuthStack

const styles = StyleSheet.create({})