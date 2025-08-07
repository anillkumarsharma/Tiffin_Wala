import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

// Get FCM Token
export async function getFCMToken() {
  try {
    const token = await messaging().getToken();
    if (token) {
      console.log('FCM Token:', token);
      AsyncStorage.setItem('FCM_Token', token)
      // await saveFCMToken(token, userData);
    } else {
      console.log('Failed to get FCM token');
    }
  } catch (error) {
    console.error('Error fetching FCM token:', error);
  }
}

// const saveFCMToken = async (token, userData) => {

  
// };

// Handle Background & Quit Notifications
export function backgroundMessageHandler() {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in background:', remoteMessage);
  });
}
