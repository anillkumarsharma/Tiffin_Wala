import React, { useEffect, useState } from 'react'
import MainNavigator from './src/navigation/MainNavigator'
import SplashScreen from 'react-native-splash-screen'
import ErrorPage from './src/screens/ErrorPage/Errorpage';
import NetInfo from '@react-native-community/netinfo';
const App = () => {
 const [isConnected, setIsConnected] = useState(true);

  useEffect(()=>{
    SplashScreen.hide();
  },[])
  

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
   <MainNavigator/>
 )
}

export default App

