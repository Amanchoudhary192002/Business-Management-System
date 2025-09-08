import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Button, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import apiClient from '../api/apiClient';

export default function ProductListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const isFocused = useIsFocused();

  const fetchProducts = useCallback(async () => {
    try {
      const response = await apiClient.get('/products');
      setProducts(response.data);
    } catch (error) { console.error('Failed to fetch products', error); }
  }, []);

  useEffect(() => {
    if (isFocused) fetchProducts();
  }, [isFocused, fetchProducts]);

  const handleDelete = (productId) => {
    Alert.alert("Delete Product", "Are you sure you want to delete this?",
      [{ text: "Cancel" }, { text: "OK", onPress: async () => {
        try {
          await apiClient.delete(`/products/${productId}`);
          fetchProducts();
        } catch (error) { Alert.alert('Error', 'Could not delete product.'); }
      }}]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Add New Product" onPress={() => navigation.navigate('ProductForm')} />
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>Price: ₹{item.price.toFixed(2)}</Text>
              <Text style={item.stock < 10 ? styles.lowStock : styles.inStock}>Stock: {item.stock}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => navigation.navigate('ProductForm', { product: item })}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item._id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No products found.</Text>}
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
    inStock: { color: 'green' },
    lowStock: { color: 'orange', fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16 },
});