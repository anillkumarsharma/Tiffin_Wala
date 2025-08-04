import { 
  Button, 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView, 
  Alert,
  ActivityIndicator
} from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '../../Context/AuthContext';
import auth from '@react-native-firebase/auth';


const LoginScreen = ({ navigation, route }) => {
  const { setIsAuthenticated } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
   const [loading, setLoading] = useState(false);

  const handleLogin = async() => {
    // Validate phone number
   if (phoneNumber.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit phone number');
      return;
    }
setLoading(true);
    
    try {
      // Format phone number for Firebase (+91 for India)
      const formattedPhone = `+91${phoneNumber}`;
      console.log('formatted phone number', formattedPhone)
      
      // Send OTP using Firebase
      // const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
      // console.log('confirmation', confirmation)

       const confirmation = {
      confirm: async (code) => {
        if (code === '123456') {
          // Simulate successful confirmation
          return { user: { phoneNumber: `+91${phoneNumber}` } };
        } else {
          throw new Error('Invalid verification code');
        }
      }
    };
      
      // Navigate to OTP screen with confirmation object
      navigation.replace('OTPScreen', {
        phoneNumber: phoneNumber,
        confirmation: confirmation,
        redirectTo: route?.params?.redirectTo,
        tiffinData: route?.params?.tiffinData
      });
      
    } catch (error) {
      console.error('Firebase OTP Error:', error);
      
      // Handle different error types
      if (error.code === 'auth/invalid-phone-number') {
        Alert.alert('Invalid Number', 'Please enter a valid phone number');
      } else if (error.code === 'auth/too-many-requests') {
        Alert.alert('Too Many Attempts', 'Please try again later');
      } else if (error.code === 'auth/quota-exceeded') {
        Alert.alert('Service Unavailable', 'SMS quota exceeded. Please try again later');
      } else {
        Alert.alert('Error', 'Failed to send OTP. Please check your internet connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Logo and Title Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            {/* You can replace this with an actual logo image */}
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoEmoji}>🍱</Text>
            </View>
          </View>
          <Text style={styles.companyName}>Tiffin Wala</Text>
          <Text style={styles.subtitle}>Tiffin Set hai, to Din set hai</Text>
        </View>

        {/* Login Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.instructionText}>Enter your phone number to continue</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="Enter phone number"
              placeholderTextColor="#999"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

         <TouchableOpacity 
  style={[styles.loginButton, loading && { opacity: 0.6 }]} 
  onPress={handleLogin}
  disabled={loading}
>
  {loading ? (
    <ActivityIndicator size="small" color="#fff" />
  ) : (
    <Text style={styles.loginButtonText}>Continue</Text>
  )}
</TouchableOpacity>


          <Text style={styles.otpText}>
            We'll send you an OTP to verify your number
          </Text>
        </View>

        {/* Footer Section */}
        <View style={styles.footerSection}>
          <Text style={styles.termsText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 60,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoEmoji: {
    fontSize: 36,
  },
  companyName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontWeight: '400',
  },
  formSection: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#FAFAFA',
  },
  countryCode: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 12,
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  phoneInput: {
    flex: 1,
    height: 56,
    fontSize: 18,
    color: '#333',
    paddingLeft: 12,
  },
  loginButton: {
    backgroundColor: '#FF6B35',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  otpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  footerSection: {
    marginTop: 40,
  },
  termsText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});