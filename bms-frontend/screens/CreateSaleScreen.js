import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import apiClient from '../api/apiClient';

export default function CreateSaleScreen({ navigation }) {
  // Data state
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  // Selection state
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Modal and Search state
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch initial data
  useEffect(() => {
    apiClient.get('/customers').then(response => setCustomers(response.data));
    apiClient.get('/products').then(response => setProducts(response.data));
  }, []);

  // Recalculate total when cart changes
  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.priceAtSale * item.quantity, 0);
    setTotalAmount(total);
  }, [cart]);

  // Handlers for cart management
  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, {
        productId: product._id,
        name: product.name,
        priceAtSale: product.price,
        quantity: 1,
      }];
    });
    setProductModalVisible(false);
  };

  const handleUpdateQuantity = (productId, amount) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  const handleSaveSale = async () => {
    if (!selectedCustomer || cart.length === 0) {
      return Alert.alert('Error', 'Please select a customer and add products to the cart.');
    }
    const saleData = {
      customerId: selectedCustomer._id,
      products: cart.map(({ productId, quantity, priceAtSale }) => ({ productId, quantity, priceAtSale })),
      totalAmount,
    };
    try {
      await apiClient.post('/transactions', saleData);
      Alert.alert('Success', 'Sale recorded successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Could not save the sale. Check product stock.');
    }
  };

  // Memoized filtered lists for search modals
  const filteredCustomers = useMemo(() =>
    customers.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())), [customers, searchQuery]);
  const filteredProducts = useMemo(() =>
    products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) && p.stock > 0), [products, searchQuery]);

  // Selection Modal Component
  const SelectionModal = ({ visible, setVisible, data, onSelect, title }) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            onChangeText={setSearchQuery}
          />
          <FlatList
            data={data}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.listItem} onPress={() => onSelect(item)}>
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Close" onPress={() => setVisible(false)} />
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Customer Selection */}
      <TouchableOpacity style={styles.selectionCard} onPress={() => { setSearchQuery(''); setCustomerModalVisible(true); }}>
        <FontAwesome5 name="user-tag" size={20} color="#007bff" />
        <Text style={styles.selectionText}>
          {selectedCustomer ? selectedCustomer.name : 'Select a Customer'}
        </Text>
        <FontAwesome5 name="chevron-down" size={16} color="#6c757d" />
      </TouchableOpacity>

      {/* Product Selection */}
      <TouchableOpacity style={styles.selectionCard} onPress={() => { setSearchQuery(''); setProductModalVisible(true); }}>
        <FontAwesome5 name="box-open" size={20} color="#17a2b8" />
        <Text style={styles.selectionText}>Add a Product</Text>
        <FontAwesome5 name="chevron-down" size={16} color="#6c757d" />
      </TouchableOpacity>

      {/* Cart Items */}
      <FlatList
        data={cart}
        keyExtractor={item => item.productId}
        ListHeaderComponent={<Text style={styles.cartTitle}>Cart</Text>}
        ListEmptyComponent={<Text style={styles.emptyCartText}>Your cart is empty</Text>}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <View style={styles.cartItemInfo}>
              <Text style={styles.cartItemName}>{item.name}</Text>
              <Text style={styles.cartItemPrice}>₹{item.priceAtSale.toFixed(2)}</Text>
            </View>
            <View style={styles.quantityControls}>
              <TouchableOpacity onPress={() => handleUpdateQuantity(item.productId, -1)}>
                <FontAwesome5 name="minus-circle" size={22} color="#6c757d" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => handleUpdateQuantity(item.productId, 1)}>
                <FontAwesome5 name="plus-circle" size={22} color="#28a745" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Summary and Action */}
      <View style={styles.summaryContainer}>
        <Text style={styles.totalText}>Total: ₹{totalAmount.toFixed(2)}</Text>
        <TouchableOpacity style={styles.completeSaleButton} onPress={handleSaveSale}>
          <Text style={styles.completeSaleButtonText}>Complete Sale</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <SelectionModal
        visible={customerModalVisible}
        setVisible={setCustomerModalVisible}
        data={filteredCustomers}
        onSelect={(customer) => {
          setSelectedCustomer(customer);
          setCustomerModalVisible(false);
        }}
        title="Select Customer"
      />
      <SelectionModal
        visible={productModalVisible}
        setVisible={setProductModalVisible}
        data={filteredProducts}
        onSelect={handleAddToCart}
        title="Select Product"
      />
    </SafeAreaView>
  );
}

// Add a new Button component for modals to avoid import issues
const Button = ({ title, onPress }) => (
  <TouchableOpacity style={styles.modalButton} onPress={onPress}>
    <Text style={styles.modalButtonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  selectionCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  selectionText: { fontSize: 16, fontWeight: '600', color: '#343a40' },
  cartTitle: { fontSize: 22, fontWeight: 'bold', margin: 15 },
  emptyCartText: { textAlign: 'center', color: '#6c757d', marginTop: 20 },
  cartItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2,
  },
  cartItemInfo: { flex: 1 },
  cartItemName: { fontSize: 16, fontWeight: '600' },
  cartItemPrice: { fontSize: 14, color: '#6c757d' },
  quantityControls: { flexDirection: 'row', alignItems: 'center' },
  quantityText: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 15 },
  summaryContainer: {
    borderTopWidth: 1,
    borderColor: '#dee2e6',
    padding: 15,
    backgroundColor: 'white',
  },
  totalText: { fontSize: 18, fontWeight: 'bold', textAlign: 'right', marginBottom: 10 },
  completeSaleButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeSaleButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  // Modal Styles
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  listItem: { paddingVertical: 15, borderBottomWidth: 1, borderColor: '#f1f1f1' },
  modalButton: { backgroundColor: '#007bff', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  modalButtonText: { color: 'white', fontSize: 16 },
});