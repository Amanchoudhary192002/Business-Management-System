import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';
import apiClient from '../api/apiClient';

export default function ReportsScreen() {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();
    const screenWidth = Dimensions.get("window").width;

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/reports');
            setReports(response.data);
        } catch(err) {
            console.error("Failed to fetch reports:", err);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if(isFocused) fetchReports();
    }, [isFocused]);
    
    if (loading) {
        return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
    }
    
    if (!reports) {
        return <View style={styles.centered}><Text style={styles.errorText}>Could not load reports.</Text></View>;
    }
    
    const chartData = {
        labels: reports.topCustomers.map(c => c.name.substring(0, 10)),
        datasets: [{ data: reports.topCustomers.map(c => c.totalSpent) }]
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.header}>Today's Sales Summary</Text>
                <Text style={styles.totalSales}>₹{reports.dailySalesTotal.toFixed(2)}</Text>
            </View>
            
            <View style={styles.card}>
                <Text style={styles.header}>Low Stock Products (Less than 10)</Text>
                {reports.lowStockProducts.length > 0 ? reports.lowStockProducts.map(p => (
                    <View key={p._id} style={styles.listItem}>
                        <Text>{p.name}</Text>
                        <Text style={{ color: '#dc3545', fontWeight: 'bold' }}>Stock: {p.stock}</Text>
                    </View>
                )) : <Text>No low stock products found!</Text>}
            </View>
            
            <View style={styles.card}>
                <Text style={styles.header}>Top 5 Customers</Text>
                 {reports.topCustomers.length > 0 ? (
                    <BarChart
                        data={chartData}
                        width={screenWidth - 40}
                        height={220}
                        yAxisLabel="₹"
                        chartConfig={{
                            backgroundColor: "#007bff",
                            backgroundGradientFrom: "#007bff",
                            backgroundGradientTo: "#0b5ed7",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        }}
                        style={{ borderRadius: 16, marginTop: 10 }}
                    />
                ) : <Text>No sales data to show top customers.</Text>}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 10 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { color: 'red', fontSize: 16 },
    card: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 3 },
    header: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#343a40' },
    totalSales: { fontSize: 28, fontWeight: 'bold', color: '#28a745' },
    listItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f1f1' },
});