import { useEffect } from 'react';
import { Image, Platform, TouchableOpacity } from 'react-native';

import TiffinDetail from '../screens/Details/TiffinDetail';
import MyOrders from '../screens/MyOrders/MyOrders';
import Profile from '../screens/Profile/Profile';
import SplashScreen from '../screens/splash/splash';
import LoginScreen from '../screens/Auth/LoginScreen';
import OTPScreen from '../screens/Auth/OTPSceen';
import OrderDetail from '../screens/OrderDetails/OrderDetails';
import { useAuth } from '../Context/AuthContext';
import Home from '../screens/Home/Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import colors from '../constants/colors';
import { createNotificationChannel, handleNotificationEvents } from '../services/notifications';
import { backgroundMessageHandler } from '../services/firebase';
import { handleForegroundNotifications } from '../services/fcmhandler';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CustomTabBarButton = (props) => (
  <TouchableOpacity activeOpacity={1} {...props} />
);

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
          MyOrders: require('../../assets/orderss.png'),
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

const AppStack = () => {

  useEffect(() => {
    if (Platform.OS === 'android') {
      createNotificationChannel();
      backgroundMessageHandler();
      handleForegroundNotifications();
      handleNotificationEvents();
    }
  }, []);

  return (
    <Stack.Navigator initialRouteName='Tabs' screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Tabs' component={TiffinTabs} />
      <Stack.Screen name='TiffinDetail' component={TiffinDetail} />
      <Stack.Screen name='MyOrders' component={MyOrders} />
      <Stack.Screen name='Profile' component={Profile} />
      <Stack.Screen name='Splash' component={SplashScreen} />
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='OTPScreen' component={OTPScreen} />
      <Stack.Screen name='OrderDetail' component={OrderDetail} />
    </Stack.Navigator>
  );
};

export default AppStack;