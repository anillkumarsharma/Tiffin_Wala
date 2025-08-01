import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import colors from '../../constants/colors'; // optional if you use a color file

const Profile = () => {
  const [profileImage, setProfileImage] = useState(null);

  const pickImage = async () => {
    // const result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   aspect: [1, 1],
    //   quality: 1,
    // });

    // if (!result.canceled) {
    //   setProfileImage(result.assets[0].uri);
    // }
  };

  return (
  <View style={styles.root}>
    <ScrollView contentContainerStyle={styles.container}>
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

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>Govind Sharma</Text>

        <Text style={styles.label}>Mobile Number</Text>
        <Text style={styles.value}>+91 9876543210</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>govind@example.com</Text>

        <Text style={styles.label}>Address</Text>
        <Text style={styles.value}>123, Model Town, Jaipur, Rajasthan</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => Alert.alert('Logged out')}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
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
    paddingTop:20,
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
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
    backgroundColor:colors.white,
    padding: 16,
    marginBottom: 30,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: colors.Primary,
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
