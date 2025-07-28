import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';
import Home from '../screens/Home/Home';
import Search from '../screens/Search/Search';
import Details from '../screens/Details/Details';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

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
          Home: require('../../assets/tiffinnn.png'),
          Search: require('../../assets/search.jpg'),
          Details: require('../../assets/tiffin1.jpg')
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
    <Tab.Screen name="Search" component={Search} />
    <Tab.Screen name="Details" component={Details}/>
  </Tab.Navigator>
);

// Main stack navigator
const MainNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName='Tabs' screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Tabs' component={TIffinTabs} />
      <Stack.Screen name='Details' component={Details} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default MainNavigator;
