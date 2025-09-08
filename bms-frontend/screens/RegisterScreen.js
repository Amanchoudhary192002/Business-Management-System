import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }) {
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    if (!businessName || !email || !password) {
      return Alert.alert('Error', 'Please fill in all fields');
    }
    try {
      await register(businessName, email.trim(), password);
    } catch (error) {
      const message = error.response?.data?.msg || 'An unexpected error occurred.';
      Alert.alert('Registration Failed', message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <FontAwesome5 name="user-plus" size={36} color="#007bff" />
          <Text style={styles.title}>Create an Account</Text>
          <Text style={styles.subtitle}>Get started with your new business account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Business Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Your business name"
              value={businessName}
              onChangeText={setBusinessName}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Choose a secure password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLinkText}>Already have an account? <Text style={styles.loginLink}>Login</Text></Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#343a40',
    textAlign: 'center',
    marginTop: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 5,
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: 30,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderColor: '#dee2e6',
    borderWidth: 1,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 16,
    color: '#6c757d',
  },
  loginLink: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});