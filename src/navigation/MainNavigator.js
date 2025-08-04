import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';
import Home from '../screens/Home/Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, Text, ActivityIndicator } from 'react-native';
import TiffinDetail from '../screens/Details/TiffinDetail';
import MyOrders from '../screens/MyOrders/MyOrders';
import SplashScreen from '../screens/splash/splash';
import colors from '../constants/colors';
import LoginScreen from '../screens/Auth/LoginScreen';
import Profile from '../screens/Profile/Profile';
import OTPScreen from '../screens/Auth/OTPSceen';
import { useAuth } from '../Context/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab navigator with Home and Search tabs
const TiffinTabs = () => (
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
              tintColor: focused ? colors.Primary : '#999'
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

// Auth Stack Navigator (for login/OTP screens)
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name='Login' component={LoginScreen} />
    <Stack.Screen name='OTPScreen' component={OTPScreen} />
  </Stack.Navigator>
);

// App Stack Navigator (for authenticated users)
const AppStack = () => (
  <Stack.Navigator initialRouteName='Tabs' screenOptions={{ headerShown: false }}>
    <Stack.Screen name='Tabs' component={TiffinTabs} />
    <Stack.Screen name='TiffinDetail' component={TiffinDetail} />
    <Stack.Screen name='MyOrders' component={MyOrders} />
    <Stack.Screen name='Profile' component={Profile} />
    <Stack.Screen name='Splash' component={SplashScreen} />
  </Stack.Navigator>
);

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
      {loading ? (
        // Show loading screen while checking auth state
        <LoadingScreen />
      ) : isAuthenticated ? (
        // User is authenticated - show main app
        <AppStack />
      ) : (
        // User is not authenticated - show auth screens
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default MainNavigator;