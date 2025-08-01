import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import neutralFace from '../../../assets/neutralFace.png';
import RNRestart from 'react-native-restart';
import {NativeModules} from 'react-native';
import colors from '../../constants/colors';

const ErrorPage = ({onRestart}) => {
  const handleRestart = () => {
    console.log('NativeModules.RNRestart:', NativeModules.RNRestart);
    RNRestart?.Restart();
  };

  return (
    <SafeAreaView style={styles.container}>
  <View style={styles.content}>
    <Image source={neutralFace} style={styles.icon} />
    <Text style={styles.title}>Oops!</Text>
    <Text style={styles.message}>
      Something went wrong.
    </Text>
  </View>
  <TouchableOpacity style={styles.button} onPress={handleRestart}>
    <Text style={styles.buttonText}>Restart App</Text>
  </TouchableOpacity>
</SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 280,
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    color: '#151515',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: colors.Primary,
    width: '100%',
    height: 48,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ErrorPage;
