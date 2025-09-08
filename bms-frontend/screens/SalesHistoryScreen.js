import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import apiClient from '../api/apiClient';
import { FontAwesome5 } from '@expo/vector-icons';

export default function SalesHistoryScreen() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();

    const fetchSales = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/transactions');
            setSales(response.data);
        } catch (error) {
            console.error("Failed to fetch sales history:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isFocused) fetchSales();
    }, [isFocused]);
    
    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" /></View>
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={sales}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <FontAwesome5 name="receipt" size={24} color="#6c757d" style={styles.icon}/>
                        <View style={styles.cardInfo}>
                           <Text style={styles.customerName}>{item.customerId?.name || 'Customer'}</Text>
                           <Text style={styles.date}>{new Date(item.transactionDate).toLocaleDateString()}</Text>
                        </View>
                        <Text style={styles.total}>₹{item.totalAmount.toFixed(2)}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No sales history found.</Text>}
                contentContainerStyle={{padding: 10}}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: {
        backgroundColor: 'white',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 10,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
    },
    icon: { marginRight: 15 },
    cardInfo: { flex: 1 },
    customerName: { fontSize: 16, fontWeight: 'bold', color: '#343a40' },
    date: { fontSize: 14, color: '#6c757d' },
    total: { fontSize: 18, fontWeight: 'bold', color: '#28a745' },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#6c757d' },
});