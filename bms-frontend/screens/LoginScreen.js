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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please fill in all fields');
    try {
      await login(email.trim(), password);
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <FontAwesome5 name="store" size={40} color="#007bff" />
          <Text style={styles.title}>Business Management System</Text>
          <Text style={styles.subtitle}>Login to your account</Text>
        </View>

        <View style={styles.form}>
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
              placeholder="Your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLinkText}>Don't have an account? <Text style={styles.registerLink}>Sign Up</Text></Text>
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
  loginButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  registerLinkText: {
    fontSize: 16,
    color: '#6c757d',
  },
  registerLink: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});