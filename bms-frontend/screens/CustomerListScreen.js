import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Button, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import apiClient from '../api/apiClient';

export default function CustomerListScreen({ navigation }) {
  const [customers, setCustomers] = useState([]);
  const isFocused = useIsFocused();

  const fetchCustomers = useCallback(async () => {
    try {
      const response = await apiClient.get('/customers');
      setCustomers(response.data);
    } catch (error) { console.error('Failed to fetch customers', error); }
  }, []);

  useEffect(() => {
    if (isFocused) fetchCustomers();
  }, [isFocused, fetchCustomers]);

  const handleDelete = (customerId) => {
    Alert.alert("Delete Customer", "Are you sure you want to delete this?",
      [{ text: "Cancel" }, {
        text: "OK", onPress: async () => {
          try {
            await apiClient.delete(`/customers/${customerId}`);
            fetchCustomers();
          } catch (error) { Alert.alert('Error', 'Could not delete customer.'); }
        }
      }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Add New Customer" onPress={() => navigation.navigate('CustomerForm')} />
      <FlatList
        data={customers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>{item.phone}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => navigation.navigate('CustomerForm', { customer: item })}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item._id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No customers found.</Text>}
        contentContainerStyle={{ paddingTop: 10 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  item: { padding: 15, backgroundColor: '#fff', marginBottom: 5, borderRadius: 5, flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 18, fontWeight: 'bold' },
  actions: { flexDirection: 'row' },
  editText: { color: 'blue', marginRight: 15 },
  deleteText: { color: 'red' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16 },
});