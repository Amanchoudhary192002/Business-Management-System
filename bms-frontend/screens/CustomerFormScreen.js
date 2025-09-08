import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import apiClient from '../api/apiClient';

export default function CustomerFormScreen({ route, navigation }) {
  const customerToEdit = route.params?.customer;
  const [name, setName] = useState(customerToEdit?.name || '');
  const [phone, setPhone] = useState(customerToEdit?.phone || '');
  const [email, setEmail] = useState(customerToEdit?.email || '');
  const [address, setAddress] = useState(customerToEdit?.address || '');

  useEffect(() => {
    navigation.setOptions({ title: customerToEdit ? 'Edit Customer' : 'Add Customer' });
  }, [customerToEdit, navigation]);

  const handleSubmit = async () => {
    if (!name) return Alert.alert('Error', 'Customer name is required.');
    const customerData = { name, phone, email, address };

    try {
      if (customerToEdit) {
        await apiClient.put(`/customers/${customerToEdit._id}`, customerData);
      } else {
        await apiClient.post('/customers', customerData);
      }
      navigation.goBack();
    } catch (error) { Alert.alert('Error', 'Could not save customer.'); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} placeholder="e.g., Customer Name" value={name} onChangeText={setName} />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.input} placeholder="e.g., 9876543210" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email Address (Optional)</Text>
          <TextInput style={styles.input} placeholder="e.g., user@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Address (Optional)</Text>
          <TextInput style={styles.input} placeholder="e.g., 123 Main St, Vapi" value={address} onChangeText={setAddress} />
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{customerToEdit ? "Update Customer" : "Save Customer"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
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