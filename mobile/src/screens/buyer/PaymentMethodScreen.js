import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';

const PaymentMethodScreen = () => {
    const navigation = useNavigation();
    const [paymentMethods, setPaymentMethods] = useState([
        {
            id: '1',
            type: 'card',
            name: 'Visa',
            number: '**** **** **** 4242',
            expiry: '12/25',
            isDefault: true,
        },
        {
            id: '2',
            type: 'upi',
            name: 'UPI',
            number: 'john@paytm',
            isDefault: false,
        },
    ]);

    const getIcon = (type) => {
        switch (type) {
            case 'card':
                return 'card-outline';
            case 'upi':
                return 'flash-outline';
            default:
                return 'wallet-outline';
        }
    };

    const renderPaymentMethod = ({ item }) => (
        <View style={styles.paymentCard}>
            <View style={styles.paymentHeader}>
                <View style={styles.iconContainer}>
                    <Ionicons name={getIcon(item.type)} size={24} color="#2196F3" />
                </View>
                <View style={styles.paymentDetails}>
                    <View style={styles.nameRow}>
                        <Text style={styles.paymentName}>{item.name}</Text>
                        {item.isDefault && (
                            <View style={styles.defaultBadge}>
                                <Text style={styles.defaultText}>Default</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.paymentNumber}>{item.number}</Text>
                    {item.expiry && <Text style={styles.expiry}>Expires: {item.expiry}</Text>}
                </View>
                <TouchableOpacity style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Header title="Payment Methods" role="buyer" onBack={() => navigation.goBack()} />
            <FlatList
                data={paymentMethods}
                keyExtractor={item => item.id}
                renderItem={renderPaymentMethod}
                contentContainerStyle={styles.listContent}
                ListFooterComponent={
                    <View>
                        <TouchableOpacity style={styles.addButton}>
                            <Ionicons name="card-outline" size={24} color="#2196F3" />
                            <Text style={styles.addButtonText}>Add Card</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addButton}>
                            <Ionicons name="flash-outline" size={24} color="#2196F3" />
                            <Text style={styles.addButtonText}>Add UPI</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    listContent: {
        padding: 16,
    },
    paymentCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    paymentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    paymentDetails: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    paymentName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 8,
    },
    defaultBadge: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    defaultText: {
        fontSize: 10,
        color: '#2196F3',
        fontWeight: 'bold',
    },
    paymentNumber: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    expiry: {
        fontSize: 12,
        color: '#999',
    },
    deleteButton: {
        padding: 8,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#2196F3',
        borderStyle: 'dashed',
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2196F3',
        marginLeft: 8,
    },
});

export default PaymentMethodScreen;
