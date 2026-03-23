import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../context/CartContext';
import Header from '../../components/Header';

const CheckoutScreen = () => {
    const navigation = useNavigation();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const deliveryFee = 40;
    const tax = getCartTotal() * 0.05; // 5% tax
    const total = getCartTotal() + deliveryFee + tax;

    const addresses = [
        { id: '1', type: 'Home', address: '123, Campus Street, University Area, Bangalore - 560001' },
        { id: '2', type: 'Work', address: '456, Tech Park, Electronic City, Bangalore - 560100' },
    ];

    const paymentMethods = [
        { id: '1', type: 'UPI', name: 'UPI Payment', icon: 'flash' },
        { id: '2', type: 'Card', name: 'Credit/Debit Card', icon: 'card' },
        { id: '3', type: 'COD', name: 'Cash on Delivery', icon: 'cash' },
    ];

    const handlePlaceOrder = () => {
        if (!selectedAddress) {
            Alert.alert('Error', 'Please select a delivery address');
            return;
        }
        if (!selectedPayment) {
            Alert.alert('Error', 'Please select a payment method');
            return;
        }

        // Clear cart and navigate to success screen
        clearCart();
        navigation.replace('OrderSuccess', {
            orderTotal: total,
            orderId: 'ORD' + Date.now(),
        });
    };

    return (
        <View style={styles.container}>
            <Header title="Checkout" role="buyer" onBack={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Delivery Address */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="location" size={20} color="#2196F3" />
                        <Text style={styles.sectionTitle}>Delivery Address</Text>
                    </View>
                    {addresses.map(address => (
                        <TouchableOpacity
                            key={address.id}
                            style={[
                                styles.optionCard,
                                selectedAddress === address.id && styles.selectedCard,
                            ]}
                            onPress={() => setSelectedAddress(address.id)}
                        >
                            <View style={styles.radioButton}>
                                {selectedAddress === address.id && <View style={styles.radioButtonInner} />}
                            </View>
                            <View style={styles.optionContent}>
                                <Text style={styles.optionType}>{address.type}</Text>
                                <Text style={styles.optionText}>{address.address}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => navigation.navigate('Address')}
                    >
                        <Ionicons name="add-circle-outline" size={20} color="#2196F3" />
                        <Text style={styles.addButtonText}>Add New Address</Text>
                    </TouchableOpacity>
                </View>

                {/* Payment Method */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="wallet" size={20} color="#2196F3" />
                        <Text style={styles.sectionTitle}>Payment Method</Text>
                    </View>
                    {paymentMethods.map(method => (
                        <TouchableOpacity
                            key={method.id}
                            style={[
                                styles.optionCard,
                                selectedPayment === method.id && styles.selectedCard,
                            ]}
                            onPress={() => setSelectedPayment(method.id)}
                        >
                            <View style={styles.radioButton}>
                                {selectedPayment === method.id && <View style={styles.radioButtonInner} />}
                            </View>
                            <Ionicons name={method.icon} size={24} color="#666" style={styles.paymentIcon} />
                            <Text style={styles.optionText}>{method.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Order Summary */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="receipt" size={20} color="#2196F3" />
                        <Text style={styles.sectionTitle}>Order Summary</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Items ({cartItems.length})</Text>
                            <Text style={styles.summaryValue}>₹{getCartTotal().toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Delivery Fee</Text>
                            <Text style={styles.summaryValue}>₹{deliveryFee.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Tax (5%)</Text>
                            <Text style={styles.summaryValue}>₹{tax.toFixed(2)}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.summaryRow}>
                            <Text style={styles.totalLabel}>Total Amount</Text>
                            <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Place Order Button */}
            <View style={styles.footer}>
                <View style={styles.totalSection}>
                    <Text style={styles.footerLabel}>Total</Text>
                    <Text style={styles.footerTotal}>₹{total.toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
                    <Text style={styles.placeOrderText}>Place Order</Text>
                    <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 8,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#E0E0E0',
    },
    selectedCard: {
        borderColor: '#2196F3',
        backgroundColor: '#E3F2FD',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#2196F3',
    },
    optionContent: {
        flex: 1,
    },
    optionType: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    optionText: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    paymentIcon: {
        marginRight: 12,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
    },
    addButtonText: {
        fontSize: 14,
        color: '#2196F3',
        fontWeight: '600',
        marginLeft: 8,
    },
    summaryCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
    },
    summaryValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 8,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    totalSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    footerLabel: {
        fontSize: 14,
        color: '#666',
    },
    footerTotal: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    placeOrderButton: {
        flexDirection: 'row',
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeOrderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginRight: 8,
    },
});

export default CheckoutScreen;
