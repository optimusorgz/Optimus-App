import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';

const AddressScreen = () => {
    const navigation = useNavigation();
    const [addresses, setAddresses] = useState([
        {
            id: '1',
            type: 'Home',
            name: 'John Doe',
            phone: '+91 98765 43210',
            address: '123, Campus Street, University Area',
            city: 'Bangalore',
            pincode: '560001',
            isDefault: true,
        },
        {
            id: '2',
            type: 'Work',
            name: 'John Doe',
            phone: '+91 98765 43210',
            address: '456, Tech Park, Electronic City',
            city: 'Bangalore',
            pincode: '560100',
            isDefault: false,
        },
    ]);

    const renderAddress = ({ item }) => (
        <View style={styles.addressCard}>
            <View style={styles.addressHeader}>
                <View style={styles.typeContainer}>
                    <Ionicons
                        name={item.type === 'Home' ? 'home' : 'briefcase'}
                        size={16}
                        color="#2196F3"
                    />
                    <Text style={styles.addressType}>{item.type}</Text>
                    {item.isDefault && (
                        <View style={styles.defaultBadge}>
                            <Text style={styles.defaultText}>Default</Text>
                        </View>
                    )}
                </View>
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="create-outline" size={20} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.phone}>{item.phone}</Text>
            <Text style={styles.address}>{item.address}</Text>
            <Text style={styles.address}>{item.city} - {item.pincode}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Header title="My Addresses" role="buyer" onBack={() => navigation.goBack()} />
            <FlatList
                data={addresses}
                keyExtractor={item => item.id}
                renderItem={renderAddress}
                contentContainerStyle={styles.listContent}
                ListFooterComponent={
                    <TouchableOpacity style={styles.addButton}>
                        <Ionicons name="add-circle-outline" size={24} color="#2196F3" />
                        <Text style={styles.addButtonText}>Add New Address</Text>
                    </TouchableOpacity>
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
    addressCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    typeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressType: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 8,
    },
    defaultBadge: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 8,
    },
    defaultText: {
        fontSize: 10,
        color: '#2196F3',
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
    },
    actionButton: {
        padding: 4,
        marginLeft: 12,
    },
    name: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    phone: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    address: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
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

export default AddressScreen;
