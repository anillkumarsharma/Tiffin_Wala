import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import colors from '../../constants/colors';

const SplashScreen = ({ navigation }) => {


  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Tiffin Wala</Text>
      
      <View style={styles.bottomTextContainer}>
        <Text style={styles.subtitle}>Tiffin Set h to din set hai</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.Primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
  bottomTextContainer: {
    position: 'absolute',
    bottom: 40, // adjust based on your spacing needs
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop:8
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
  },
});

export default SplashScreen;
