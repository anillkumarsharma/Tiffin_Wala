import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../Context/AuthContext';

const OTPScreen = ({ navigation, route }) => {
  const { setIsAuthenticated } = useAuth();
  const { phoneNumber, confirmation, redirectTo, tiffinData } = route.params;
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
   const [currentConfirmation, setCurrentConfirmation] = useState(confirmation);
  
  const otpRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 5) {
      otpRefs.current[index + 1].focus();
    }

    // Auto-verify when all 6 digits are entered
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async (otpCode = null) => {
    const otpToVerify = otpCode || otp.join('');
    
    if (otpToVerify.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter all 6 digits');
      return;
    }

    setIsVerifying(true);

    try {
      // Verify OTP with Firebase
      const result = await currentConfirmation.confirm(otpToVerify);
      
      if (result.user) {
        // User authenticated successfully with Firebase
        console.log('Firebase Auth Success:', result.user.uid);
        
        // Set user as authenticated in your app context
        setIsAuthenticated(true);

        // Reset navigation stack and navigate to target screen
        if (redirectTo) {
          navigation.reset({
            index: 1,
            routes: [
              { name: 'MyOrders' },
              { name: redirectTo, params: { tiffinData } }
            ],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MyOrders' }],
          });
        }
      }

    } catch (error) {
      console.error('Firebase OTP Verification Error:', error);
      
      // Handle different Firebase error types
      if (error.code === 'auth/invalid-verification-code') {
        Alert.alert('Invalid OTP', 'The OTP you entered is incorrect. Please try again.');
      } else if (error.code === 'auth/code-expired') {
        Alert.alert('OTP Expired', 'The OTP has expired. Please request a new one.');
      } else if (error.code === 'auth/too-many-requests') {
        Alert.alert('Too Many Attempts', 'Too many incorrect attempts. Please try again later.');
      } else {
        Alert.alert('Verification Failed', 'Unable to verify OTP. Please try again.');
      }
      
      // Clear OTP inputs on error
      setOtp(['', '', '', '', '', '']);
      if (otpRefs.current[0]) {
        otpRefs.current[0].focus();
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setTimer(30);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      
      // Resend OTP using Firebase
      const formattedPhone = `+91${phoneNumber}`;
      const newConfirmation = await auth().signInWithPhoneNumber(formattedPhone);
      
      // Update confirmation reference
      setCurrentConfirmation(newConfirmation);
      
      if (otpRefs.current[0]) {
        otpRefs.current[0].focus();
      }
      
      Alert.alert('OTP Sent', 'A new OTP has been sent to your phone number');
      
    } catch (error) {
      console.error('Resend OTP Error:', error);
      
      if (error.code === 'auth/too-many-requests') {
        Alert.alert('Too Many Requests', 'Please wait before requesting another OTP');
      } else {
        Alert.alert('Error', 'Failed to resend OTP. Please try again.');
      }
      
      // Reset timer state on error
      setCanResend(true);
      setTimer(0);
    }
  };

  const formatPhoneNumber = (phone) => {
    return phone.replace(/(\d{5})(\d{5})/, '$1 $2');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoEmoji}>🔐</Text>
            </View>
          </View>
          <Text style={styles.title}>Verify Your Number</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit code to{'\n'}
            <Text style={styles.phoneNumber}>+91 {formatPhoneNumber(phoneNumber)}</Text>
          </Text>
        </View>

        {/* OTP Input Section */}
        <View style={styles.otpSection}>
          <Text style={styles.otpLabel}>Enter OTP</Text>
          
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => otpRefs.current[index] = ref}
                style={[
                  styles.otpInput,
                  digit ? styles.otpInputFilled : {},
                ]}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
                selectTextOnFocus
              />
            ))}
          </View>

          <TouchableOpacity 
            style={[
              styles.verifyButton,
              (otp.join('').length !== 6 || isVerifying) && styles.verifyButtonDisabled
            ]} 
            onPress={() => handleVerifyOtp()}
            disabled={otp.join('').length !== 6 || isVerifying}
          >
            <Text style={[
              styles.verifyButtonText,
              (otp.join('').length !== 6 || isVerifying) && styles.verifyButtonTextDisabled
            ]}>
              {isVerifying ? 'Verifying...' : 'Verify OTP'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Resend Section */}
        <View style={styles.resendSection}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          
          {canResend ? (
            <TouchableOpacity onPress={handleResendOtp}>
              <Text style={styles.resendButton}>Resend OTP</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>
              Resend OTP in {timer}s
            </Text>
          )}
        </View>

        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Change Phone Number</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 50,
  },
  logoContainer: {
    marginBottom: 24,
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  phoneNumber: {
    fontWeight: '600',
    color: '#FF6B35',
  },
  otpSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  otpLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    backgroundColor: '#FAFAFA',
    marginHorizontal: 4,
  },
  otpInputFilled: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF5F2',
  },
  verifyButton: {
    backgroundColor: '#FF6B35',
    height: 56,
    paddingHorizontal: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  verifyButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  verifyButtonTextDisabled: {
    color: '#999',
  },
  resendSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  resendText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  resendButton: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
  },
  timerText: {
    fontSize: 16,
    color: '#999',
  },
  backButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '500',
  },
});