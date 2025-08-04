import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';
import Home from '../screens/Home/Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import TiffinDetail from '../screens/Details/TiffinDetail';
import MyOrders from '../screens/MyOrders/MyOrders';
import SplashScreen from '../screens/splash/splash';
import colors from '../constants/colors';
import LoginScreen from '../screens/Auth/LoginScreen';
import Profile from '../screens/Profile/Profile';
import OTPScreen from '../screens/Auth/OTPSceen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab navigator with Home and Search tabs
const TIffinTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarStyle: {
        height: 70,
        paddingTop: 10,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: 'bold',
        top: 3,
      },
      headerShown: false,
       tabBarActiveTintColor: colors.Primary, // 👈 Your custom active color
    tabBarInactiveTintColor: '#999', 
      tabBarIcon: ({ focused }) => {
        const icons = {
          Home: require('../../assets/Home.png'),
          MyOrders: require('../../assets/Orders.webp'),
          Profile: require('../../assets/Profile.png')

        };

        return (
          <Image
            source={icons[route.name]}
            style={{
              width: 32,
              height: 32,
              tintColor:colors.Primary
            }}
          />
        );
      },
    })}
  >
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name='MyOrders' component={MyOrders} />
    <Tab.Screen name="Profile" component={Profile} />

  </Tab.Navigator>
);

// Main stack navigator
const MainNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName='Tabs' screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Tabs' component={TIffinTabs} />
      <Stack.Screen name='TiffinDetail' component={TiffinDetail} />
      <Stack.Screen name='MyOrders' component={MyOrders} />
      <Stack.Screen name='Splash' component={SplashScreen} />
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='OTPScreen' component={OTPScreen}/>
      <Stack.Screen name='Profile' component={Profile}/>
    </Stack.Navigator>
  </NavigationContainer>
);

export default MainNavigator;
