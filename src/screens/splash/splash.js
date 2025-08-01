import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Tiffin Wala</Text>
      <Text style={styles.subtitle}>Tiffin Set h to din set hai</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff8800ff',
  },
  logo: {width: 100, height: 100, marginBottom: 16},
  title: {fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 8},
  subtitle: {fontSize: 16, color: '#fff'},
});

export default SplashScreen;
