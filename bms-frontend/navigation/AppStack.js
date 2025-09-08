import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../screens/DashboardScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductFormScreen from '../screens/ProductFormScreen';
import CustomerListScreen from '../screens/CustomerListScreen';
import CustomerFormScreen from '../screens/CustomerFormScreen';
import CreateSaleScreen from '../screens/CreateSaleScreen';
import SalesHistoryScreen from '../screens/SalesHistoryScreen';
import ReportsScreen from '../screens/ReportsScreen';
import MyAccountScreen from '../screens/MyAccountScreen.js';

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Products" component={ProductListScreen} />
      <Stack.Screen name="ProductForm" component={ProductFormScreen} />
      <Stack.Screen name="Customers" component={CustomerListScreen} />
      <Stack.Screen name="CustomerForm" component={CustomerFormScreen} />
      <Stack.Screen name="Create Sale" component={CreateSaleScreen} />
      <Stack.Screen name="Sales History" component={SalesHistoryScreen} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
      <Stack.Screen name="My Account" component={MyAccountScreen} />
    </Stack.Navigator>
  );
}