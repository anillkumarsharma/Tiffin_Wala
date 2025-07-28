import React, { useEffect } from 'react'
import MainNavigator from './src/navigation/MainNavigator'
import SplashScreen from 'react-native-splash-screen'

const App = () => {

  useEffect(()=>{
    SplashScreen.hide();
  },[])
  
 return (
   <MainNavigator/>
 )
}

export default App

