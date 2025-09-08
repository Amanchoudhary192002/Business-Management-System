import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import apiClient from '../api/apiClient';

export default function ProductFormScreen({ route, navigation }) {
  const productToEdit = route.params?.product;
  const [name, setName] = useState(productToEdit?.name || '');
  const [price, setPrice] = useState(productToEdit?.price.toString() || '');
  const [stock, setStock] = useState(productToEdit?.stock.toString() || '');

  useEffect(() => {
    navigation.setOptions({ title: productToEdit ? 'Edit Product' : 'Add Product' });
  }, [productToEdit, navigation]);

  const handleSubmit = async () => {
    if (!name || !price || !stock) return Alert.alert('Error', 'Please fill all fields.');
    const productData = { name, price: parseFloat(price), stock: parseInt(stock) };

    try {
      if (productToEdit) {
        await apiClient.put(`/products/${productToEdit._id}`, productData);
      } else {
        await apiClient.post('/products', productData);
      }
      navigation.goBack();
    } catch (error) { Alert.alert('Error', 'Could not save product.'); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Product Name</Text>
          <TextInput style={styles.input} placeholder="e.g., T-Shirt" value={name} onChangeText={setName} />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Price (₹)</Text>
          <TextInput style={styles.input} placeholder="e.g., 500" value={price} onChangeText={setPrice} keyboardType="numeric" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Stock Quantity</Text>
          <TextInput style={styles.input} placeholder="e.g., 50" value={stock} onChangeText={setStock} keyboardType="numeric" />
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{productToEdit ? "Update Product" : "Save Product"}</Text>
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