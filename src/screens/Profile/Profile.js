import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../Context/AuthContext';
import colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { cameraIcon, pencilIcon } from '../../constants/icons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const Profile = () => {
  const { user, userPhoneNumber, logout } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('')
  const [isEditing, setIsEditing] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedName = await AsyncStorage.getItem('user_name');
        const storedEmail = await AsyncStorage.getItem('user_email');
        const storedAddress = await AsyncStorage.getItem('user_address');
        const phoneNumber = await AsyncStorage.getItem('user_phoneNumber');
        const storedImage = await AsyncStorage.getItem('user_profileImage');
if (storedImage) setProfileImage(storedImage);

        if (storedName) setName(storedName);
        if (storedEmail) setEmail(storedEmail);
        if (storedAddress) setAddress(storedAddress);
        if(phoneNumber) setPhone(phoneNumber)
      } catch (e) {
        console.error('Failed to load profile data', e);
      }
    };
    loadProfile();
  }, []);

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem('user_name', name);
      await AsyncStorage.setItem('user_email', email);
      await AsyncStorage.setItem('user_address', address);
      await AsyncStorage.setItem('user_profileImage', profileImage )
      setIsEditing(false);
      Alert.alert('Success', 'Profile saved successfully!');
    } catch (e) {
      console.error('Failed to save profile data', e);
      Alert.alert('Error', 'Failed to save profile. Try again.');
    }
  };
const pickImage = () => {
  Alert.alert('Change Profile Picture', 'Choose an option', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Camera', onPress: openCamera },
    { text: 'Gallery', onPress: openGallery },
  ]);
};

const openCamera = async () => {
  const result = await launchCamera({ mediaType: 'photo', quality: 1 });

  if (!result.didCancel && !result.errorCode) {
    const uri = result.assets?.[0]?.uri;
    if (uri) {
      setProfileImage(uri);
      await AsyncStorage.setItem('user_profileImage', uri);
    }
  }
};

const openGallery = async () => {
  const result = await launchImageLibrary({ mediaType: 'photo', quality: 1 });

  if (!result.didCancel && !result.errorCode) {
    const uri = result.assets?.[0]?.uri;
    if (uri) {
      setProfileImage(uri);
      await AsyncStorage.setItem('user_profileImage', uri);
    }
  }
};


  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: performLogout }
    ]);
  };

  const performLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigation.navigate('Home');
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return 'Not available';
    const cleaned = phoneNumber.replace('+91', '');
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phoneNumber;
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
       <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
  <View style={styles.imageWrapper}>
    <Image
      source={profileImage ? { uri: profileImage } : require('../../../assets/Ellipse.png')}
      style={styles.profileImage}
    />
    <Image source={cameraIcon} style={styles.cameraIcon} />
  </View>
  <Text style={styles.editText}>Tap to change photo</Text>
</TouchableOpacity>


        <View style={styles.infoContainer}>
          {[
            { label: 'Name', value: name, setValue: setName },
            { label: 'Email', value: email, setValue: setEmail },
            { label: 'Address', value: address, setValue: setAddress, multiline: true }
          ].map((item, index) => (
            <View key={index}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>{item.label}</Text>
                <View style={styles.editableRow}>
                  <TextInput
                    style={styles.input}
                    value={item.value}
                    onChangeText={item.setValue}
                    editable={isEditing}
                    placeholder={`Enter your ${item.label.toLowerCase()}`}
                    placeholderTextColor={colors.grey}
                    multiline={item.multiline || false}
                  />
                  <TouchableOpacity
                    onPress={() => setIsEditing(true)}
                    disabled={isEditing}
                  >
                    <Image source={pencilIcon}   style={{ width: 16, height: 16 }} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.divider} />
            </View>
          ))}

          <View style={styles.infoRow}>
            <Text style={styles.label}>Mobile Number</Text>
            <Text style={styles.value}>{formatPhoneNumber(phone)}</Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={isEditing ? saveProfile : () => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? 'Save Profile' : 'Edit Profile'}
            </Text>
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

        {__DEV__ && user && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugTitle}>Debug Info:</Text>
            <Text style={styles.debugText}>User ID: {user.uid}</Text>
            <Text style={styles.debugText}>Phone: {user.phoneNumber}</Text>
            <Text style={styles.debugText}>
              Created: {new Date(user.metadata.creationTime).toLocaleDateString()}
            </Text>
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

imageWrapper: {
  position: 'relative',
},

profileImage: {
  width: 120,
  height: 120,
  borderRadius: 60,
  borderWidth: 3,
  borderColor: colors.Primary,
},

cameraIcon: {
  position: 'absolute',
  bottom: 0,
  right: 0,
  width: 28,
  height: 28,
  borderRadius: 14,
  backgroundColor: '#fff',
  padding: 4,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  infoRow: {
    paddingVertical: 12,
  },
  editableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    // borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 4,
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
    minHeight: 48,
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
