import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  ActivityIndicator 
} from 'react-native';
import { useAuth } from '../../Context/AuthContext';
import colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const { user, userPhoneNumber,logout } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigation = useNavigation();



  const pickImage = async () => {
    // Image picker functionality can be added later
    // const result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   aspect: [1, 1],
    //   quality: 1,
    // });

    // if (!result.canceled) {
    //   setProfileImage(result.assets[0].uri);
    // }
    
    Alert.alert('Coming Soon', 'Profile picture upload will be available soon!');
  };

  // src/Context/AuthContext.js



  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: performLogout,
        },
      ]
    );
  };

  const performLogout = async() => {
    setIsLoggingOut(true);
    
    try {
      await logout();
      navigation.navigate('Home')
      // The AuthContext and MainNavigator will handle navigation automatically
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Format phone number for display
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return 'Not available';
    
    // Remove +91 and format as needed
    const cleaned = phoneNumber.replace('+91', '');
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phoneNumber;
  };

  // Get user name from phone number (you can enhance this later)
  const getUserName = () => {
    // You can store user names in your database later
    // For now, we'll show a placeholder
    return 'Tiffin User';
  };

  // Get user email (placeholder for now)
  const getUserEmail = () => {
    // You can add email collection during registration later
    return 'Not provided';
  };

  // Get user address (placeholder for now)
  const getUserAddress = () => {
    // You can add address collection during registration later
    return 'Please update your address';
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Image Section */}
        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require('../../../assets/Ellipse.png')
            }
            style={styles.profileImage}
          />
          <Text style={styles.editText}>Tap to change photo</Text>
        </TouchableOpacity>

        {/* User Information Section */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{getUserName()}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Mobile Number</Text>
            <Text style={styles.value}>{formatPhoneNumber(userPhoneNumber)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{getUserEmail()}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{getUserAddress()}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available soon!')}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]} 
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.logoutButtonText}>Logout</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* User Info Debug (remove in production) */}
        {__DEV__ && user && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugTitle}>Debug Info:</Text>
            <Text style={styles.debugText}>User ID: {user.uid}</Text>
            <Text style={styles.debugText}>Phone: {user.phoneNumber}</Text>
            <Text style={styles.debugText}>Created: {new Date(user.metadata.creationTime).toLocaleDateString()}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.white,
  },
  imageContainer: {
    paddingTop: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.Primary,
  },
  editText: {
    marginTop: 8,
    color: '#888',
    fontSize: 12,
  },
  infoContainer: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: colors.white,
    padding: 20,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  infoRow: {
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
  },
  actionContainer: {
    width: '100%',
    gap: 15,
  },
  editButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.Primary,
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.Primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: colors.Primary,
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    minHeight: 48, // Ensure consistent height during loading
  },
  logoutButtonDisabled: {
    backgroundColor: '#ccc',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  debugContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    width: '100%',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
});