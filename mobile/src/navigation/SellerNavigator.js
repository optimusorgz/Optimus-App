import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import CompanySellerDashboard from '../screens/seller/CompanySellerDashboard';
import SellerProductsScreen from '../screens/seller/SellerProductsScreen';
import SellerOrdersScreen from '../screens/seller/SellerOrdersScreen';
import SellerProfileScreen from '../screens/seller/SellerProfileScreen';
import SellerAnalyticsScreen from '../screens/seller/SellerAnalyticsScreen';

const Tab = createBottomTabNavigator();

const SellerNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: '#4CAF50',
                tabBarInactiveTintColor: 'gray',
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Dashboard') {
                        iconName = focused ? 'grid' : 'grid-outline';
                    } else if (route.name === 'Products') {
                        iconName = focused ? 'cube' : 'cube-outline';
                    } else if (route.name === 'Orders') {
                        iconName = focused ? 'receipt' : 'receipt-outline';
                    } else if (route.name === 'Analytics') {
                        iconName = focused ? 'analytics' : 'analytics-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                headerShown: false,
            })}
        >
            <Tab.Screen name="Dashboard" component={CompanySellerDashboard} />
            <Tab.Screen name="Products" component={SellerProductsScreen} />
            <Tab.Screen name="Orders" component={SellerOrdersScreen} />
            <Tab.Screen name="Analytics" component={SellerAnalyticsScreen} />
            <Tab.Screen name="Profile" component={SellerProfileScreen} />
        </Tab.Navigator>
    );
};

export default SellerNavigator;
