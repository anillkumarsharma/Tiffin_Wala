import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';
import Home from '../screens/Home/Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import TiffinDetail from '../screens/Details/TiffinDetail';
import MyOrders from '../screens/MyOrders/MyOrders';
import SplashScreen from '../screens/splash/splash';
import colors from '../constants/colors';
import LoginScreen from '../screens/Auth/LoginScreen';
import Profile from '../screens/Profile/Profile';
import OTPScreen from '../screens/Auth/OTPSceen';
import { useAuth } from '../Context/AuthContext';
import AuthStack from './AuthStack';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CustomTabBarButton = (props) => (
  <TouchableOpacity activeOpacity={1} {...props} />
);

// Tab navigator with Home and Search tabs
const TiffinTabs = () => {
    const { isAuthenticated } = useAuth(); 

  return(<Tab.Navigator
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
      tabBarButton: (props) => <CustomTabBarButton {...props} />, 
      tabBarInactiveTintColor: '#999',
      tabBarIcon: ({ focused }) => {
        const icons = {
          Home: require('../../assets/Home.png'),
          MyOrders: require('../../assets/Hand.png'),
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
<Tab.Screen name="Profile" component={Profile} 
/>

  </Tab.Navigator>)
}


// App Stack Navigator (for authenticated users)
const AppStack = () => (
  <Stack.Navigator initialRouteName='Tabs' screenOptions={{ headerShown: false }}>
    <Stack.Screen name='Tabs' component={TiffinTabs} />
    <Stack.Screen name='TiffinDetail' component={TiffinDetail} />
    <Stack.Screen name='MyOrders' component={MyOrders} />
    <Stack.Screen name='Profile' component={Profile} />
    <Stack.Screen name='Splash' component={SplashScreen} />
     {/* 🔥 Add login flow here as fallback */}
    <Stack.Screen name='Login' component={LoginScreen} />
    <Stack.Screen name='OTPScreen' component={OTPScreen} />
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
      {loading ? <LoadingScreen /> : <AppStack />}

    </NavigationContainer>
  );
};

export default MainNavigator;