import React, { useEffect, useState } from 'react';
import { View, Text, PermissionsAndroid, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const Search = () => {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    console.log('Component mounted - RN 0.76.1');
    initializeLocation();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to show nearby restaurants.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
        return true;
      } else {
        console.log('Location permission denied');
        return false;
      }
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  };

  const initializeLocation = async () => {
    try {
      setStatus('Requesting permission...');
      
      const hasPermission = await requestLocationPermission();
      
      if (!hasPermission) {
        setStatus('Permission denied');
        Alert.alert(
          'Permission Required',
          'Location permission is required to find nearby restaurants.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Check if Geolocation is properly imported
      if (!Geolocation || typeof Geolocation.getCurrentPosition !== 'function') {
        console.error('Geolocation service not available:', Geolocation);
        setStatus('Geolocation service not available');
        Alert.alert('Error', 'Location service is not properly configured.');
        return;
      }

      setStatus('Getting your location...');
      
      // Remove the Geolocation configuration as it's not needed for react-native-geolocation-service
      
      // Get current position
     Geolocation.getCurrentPosition(
  (position) => {
    console.log('Location success:', position);
    setLocation(position.coords);
    setStatus('Location found!');
  },
  (error) => {
    console.log('Location error:', error);
    setStatus(`Error: ${error.message}`);

    switch (error.code) {
      case 1:
        Alert.alert('Error', 'Location access denied by user.');
        break;
      case 2:
        Alert.alert('Error', 'Location not available. Please check your GPS.');
        break;
      case 3:
        Alert.alert('Error', 'Location request timed out. Please try again.');
        break;
      default:
        Alert.alert('Error', `Location error: ${error.message}`);
    }
  },
  {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 10000,
    distanceFilter: 0,
    forceRequestLocation: true,
    forceLocationManager: false,
    showLocationDialog: true
  }
);

    } catch (error) {
      console.error('Initialize location error:', error);
      setStatus(`Exception: ${error.message}`);
    }
  };

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Tiffin Wala Location
      </Text>
      
      <View style={{ backgroundColor: '#f0f0f0', padding: 15, borderRadius: 8, marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 5 }}>Status:</Text>
        <Text style={{ fontSize: 14, color: '#666' }}>{status}</Text>
      </View>

      {location && (
        <View style={{ backgroundColor: '#e8f5e8', padding: 15, borderRadius: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#2d5a2d' }}>
            📍 Your Location
          </Text>
          <Text style={{ fontSize: 14, marginBottom: 5 }}>
            <Text style={{ fontWeight: '600' }}>Latitude:</Text> {location.latitude.toFixed(6)}
          </Text>
          <Text style={{ fontSize: 14, marginBottom: 5 }}>
            <Text style={{ fontWeight: '600' }}>Longitude:</Text> {location.longitude.toFixed(6)}
          </Text>
          <Text style={{ fontSize: 14, marginBottom: 5 }}>
            <Text style={{ fontWeight: '600' }}>Accuracy:</Text> {location.accuracy}m
          </Text>
          {location.speed !== null && (
            <Text style={{ fontSize: 14 }}>
              <Text style={{ fontWeight: '600' }}>Speed:</Text> {location.speed}m/s
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default Search;