import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

export function handleForegroundNotifications() {
  messaging().onMessage(async remoteMessage => {
    console.log('Received Foreground Notification:', remoteMessage);

    // Request permission (Android 13+)
    await notifee.requestPermission();

    // Display notification
    await notifee.displayNotification({
      title: remoteMessage.notification?.title || 'New Notification',
      body: remoteMessage.notification?.body || 'You have a new message!',
      android: {
        channelId: 'default',
        smallIcon: 'ic_launcher', // Make sure this icon exists
      },
    });

    // 👉 Optional: handle notification type or message
    const messageBody = remoteMessage?.notification?.body;

    if (messageBody === 'Your tiffin has been delivered!') {
      // example: save this to AsyncStorage or show a modal
    }
  });
}
