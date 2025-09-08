import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const StatCard = ({ title, value, icon }) => (
  <View style={styles.statCard}>
    {icon}
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{title}</Text>
  </View>
);

const ActionCard = ({ title, icon, color, onPress }) => (
  <TouchableOpacity style={styles.actionCard} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: color }]}>
      {icon}
    </View>
    <Text style={styles.actionText}>{title}</Text>
  </TouchableOpacity>
);

export default function DashboardScreen({ navigation }) {
  const { logout } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reportsRes, userRes] = await Promise.all([
        apiClient.get('/reports'),
        apiClient.get('/auth/me')
      ]);
      setStats(reportsRes.data);
      setBusinessName(userRes.data.businessName);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.headerTitle}>{businessName || 'Dashboard'}</Text>

        <View style={styles.statsContainer}>
          <StatCard
            title="Today's Sales"
            value={`₹${stats?.dailySalesTotal.toFixed(2) || '0.00'}`}
            icon={<FontAwesome5 name="rupee-sign" size={24} color="#28a745" />}
          />
          <StatCard
            title="Low Stock Items"
            value={stats?.lowStockProducts.length || 0}
            icon={<MaterialCommunityIcons name="alert-outline" size={30} color="#dc3545" />}
          />
        </View>

        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.actionsContainer}>
          <ActionCard
            title="Create Sale"
            icon={<FontAwesome5 name="cash-register" size={24} color="white" />}
            color="#28a745"
            onPress={() => navigation.navigate('Create Sale')}
          />
          <ActionCard
            title="My Account"
            icon={<FontAwesome5 name="user-cog" size={24} color="white" />}
            color="#6f42c1"
            onPress={() => navigation.navigate('My Account')}
          />
          <ActionCard
            title="Manage Products"
            icon={<FontAwesome5 name="box-open" size={24} color="white" />}
            color="#17a2b8"
            onPress={() => navigation.navigate('Products')}
          />
          <ActionCard
            title="Manage Customers"
            icon={<FontAwesome5 name="users" size={24} color="white" />}
            color="#007bff"
            onPress={() => navigation.navigate('Customers')}
          />
          <ActionCard
            title="View Reports"
            icon={<FontAwesome5 name="chart-bar" size={24} color="white" />}
            color="#ffc107"
            onPress={() => navigation.navigate('Reports')}
          />
          <ActionCard
            title="Sales History"
            icon={<FontAwesome5 name="history" size={24} color="white" />}
            color="#6c757d"
            onPress={() => navigation.navigate('Sales History')}
          />
          <ActionCard
            title="Logout"
            icon={<FontAwesome5 name="sign-out-alt" size={24} color="white" />}
            color="#dc3545"
            onPress={logout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#343a40',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#495057',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212529',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  actionCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343a40',
    textAlign: 'center',
  },
});