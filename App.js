import React, { useEffect, useState } from 'react'
import MainNavigator from './src/navigation/MainNavigator'
import SplashScreen from 'react-native-splash-screen'
import ErrorPage from './src/screens/ErrorPage/Errorpage';
import NetInfo from '@react-native-community/netinfo';
import { AuthProvider } from './src/Context/AuthContext';
import { View, Text } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { requestUserPermission } from './src/services/permissions';

const App = () => {
  const [isConnected, setIsConnected] = useState(true);


  useEffect(() => {
  requestUserPermission();
}, []);

  useEffect(() => {
    SplashScreen.hide();
  }, [])

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected && state.isInternetReachable !== false);
    });
    return () => unsubscribe();
  }, []);

  const handleRestart = () => {
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected && state.isInternetReachable !== false);
    });
  };

  if (!isConnected) {
    return <ErrorPage onRestart={handleRestart} />;
  }

  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  )
}

export default App