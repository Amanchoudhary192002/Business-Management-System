import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import apiClient from '../api/apiClient';

export default function MyAccountScreen({ navigation }) {
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [initialEmail, setInitialEmail] = useState('');

  useEffect(() => {
    apiClient.get('/auth/me')
      .then(response => {
        setBusinessName(response.data.businessName);
        setEmail(response.data.email);
        setInitialEmail(response.data.email);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch user data:", error);
        setLoading(false);
      });
  }, []);

  const handleUpdate = async () => {
    if (!businessName || !email) {
      return Alert.alert('Error', 'Fields cannot be empty.');
    }

    const updatedData = { businessName, email };

    try {
      await apiClient.put('/auth/update', updatedData);
      Alert.alert('Success', 'Your account has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      const message = error.response?.data?.msg || 'Could not update account.';
      Alert.alert('Error', message);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>My Account</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Business Name</Text>
          <TextInput
            style={styles.input}
            value={businessName}
            onChangeText={setBusinessName}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {email !== initialEmail && (
          <Text style={styles.warningText}>Changing your email will change what you use to log in.</Text>
        )}
        <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
          <Text style={styles.submitButtonText}>Update Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#343a40',
  },
  formGroup: { marginHorizontal: 20, marginTop: 20 },
  label: { fontSize: 16, color: '#495057', marginBottom: 5 },
  input: {
    backgroundColor: 'white',
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderColor: '#dee2e6',
    borderWidth: 1,
    fontSize: 16,
  },
  warningText: {
    marginHorizontal: 20,
    marginTop: 5,
    color: '#ffc107'
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 30,
    elevation: 2,
  },
  submitButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});