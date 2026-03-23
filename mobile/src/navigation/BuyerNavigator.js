import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BuyerHomeScreen, BuyerSearchScreen } from '../screens/buyer/BuyerScreens';
import BuyerOrdersScreen from '../screens/buyer/BuyerOrdersScreen';
import BuyerProfileScreen from '../screens/buyer/BuyerProfileScreen';
import CartScreen from '../screens/buyer/CartScreen';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';

const Tab = createBottomTabNavigator();

const BuyerNavigator = () => {
    const { getCartCount } = useCart();
    const cartCount = getCartCount();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: '#2196F3',
                tabBarInactiveTintColor: 'gray',
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Search') {
                        iconName = focused ? 'search' : 'search-outline';
                    } else if (route.name === 'Cart') {
                        iconName = focused ? 'cart' : 'cart-outline';
                    } else if (route.name === 'Orders') {
                        iconName = focused ? 'receipt' : 'receipt-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    // Add badge for cart
                    if (route.name === 'Cart' && cartCount > 0) {
                        return (
                            <View>
                                <Ionicons name={iconName} size={size} color={color} />
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{cartCount}</Text>
                                </View>
                            </View>
                        );
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={BuyerHomeScreen} />
            <Tab.Screen name="Search" component={BuyerSearchScreen} />
            <Tab.Screen name="Cart" component={CartScreen} />
            <Tab.Screen name="Orders" component={BuyerOrdersScreen} />
            <Tab.Screen name="Profile" component={BuyerProfileScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        right: -8,
        top: -4,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default BuyerNavigator;

