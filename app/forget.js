import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
const { height } = Dimensions.get('window');

const ForgetPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.container}>
          <ImageBackground
            style={{
              display: 'flex',
              height: height / 3.5,
              width: 320,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            resizeMode="contain"
            source={require('../assets/images/logo.png')}
          />
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>IIPMS</Text>
          </View>
          <Text style={styles.subHeader}>Forgot Password</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Your Email"
            placeholderTextColor="#a0a0a0"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            value="shaganti74@gmail.com"
            editable={false}
            placeholder="Admin Email"
            placeholderTextColor="#a0a0a0"
          />
          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send OTP</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/index')}>
            <Text style={styles.backToLogin}>← Go back to Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#024b74',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#024b74',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  logo: {
    color: '#ff0000',
    fontSize: 22,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto',
  },
  subHeader: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto',
  },
  input: {
    backgroundColor: '#ffffff',
    width: '100%',
    padding: 14,
    marginBottom: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sendButton: {
    backgroundColor: '#002444',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto',
  },
  backToLogin: {
    color: '#40c4ff',
    fontSize: 14,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

export default ForgetPasswordScreen;