import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';
import Home from '../screens/Home/Home';
import Search from '../screens/Search/Search';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import TiffinDetail from '../screens/Details/TiffinDetail';
import MyOrders from '../screens/MyOrders/MyOrders';
import SplashScreen from '../screens/splash/splash';

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
      tabBarIcon: ({ focused }) => {
        const icons = {
          Home: require('../../assets/Home.png'),
          SplashScreen: require('../../assets/search.jpg'),
          MyOrders: require('../../assets/Orders.webp')
        };

        return (
          <Image
            source={icons[route.name]}
            style={{
              width: 32,
              height: 32,
            }}
          />
        );
      },
    })}
  >
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="Splash" component={SplashScreen} />
    <Tab.Screen name='MyOrders' component={MyOrders} />
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
    </Stack.Navigator>
  </NavigationContainer>
);

export default MainNavigator;
