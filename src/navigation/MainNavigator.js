import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';
import Home from '../screens/Home/Home';
import Search from '../screens/Search/Search';
import Details from '../screens/Details/Details';

const Stack = createNativeStackNavigator()

const MainNavigator = () => (

    <NavigationContainer>
        <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
            
            <Stack.Screen name='Home' component={Home} ></Stack.Screen>
            <Stack.Screen name='Search' component={Search} ></Stack.Screen>
            <Stack.Screen name='Details' component={Details} ></Stack.Screen>
        </Stack.Navigator>
    </NavigationContainer>
);

export default MainNavigator;
