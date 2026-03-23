
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';

const { width } = Dimensions.get('window');

const BuyerOrdersScreen = () => {
    const orders = [
        {
            id: 'ORD-8821',
            date: 'Today, 2:30 PM',
            total: 45.99,
            status: 'Out for Delivery',
            items: 'Wireless Mouse, USB Hub',
            image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&q=80'
        },
        {
            id: 'ORD-8820',
            date: 'Oct 12, 2023',
            total: 129.50,
            status: 'Delivered',
            items: 'Mechanical Keyboard...',
            image: 'https://images.unsplash.com/photo-1587829741301-308231c8db13?w=200&q=80'
        },
        {
            id: 'ORD-8819',
            date: 'Sep 28, 2023',
            total: 12.00,
            status: 'Cancelled',
            items: 'HDMI Cable',
            image: 'https://images.unsplash.com/photo-1558434607-bb26d7e00318?w=200&q=80'
        },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered': return { bg: '#E8F5E9', text: '#2E7D32', icon: 'checkmark-circle' };
            case 'Out for Delivery': return { bg: '#FFF3E0', text: '#EF6C00', icon: 'bicycle' };
            case 'Cancelled': return { bg: '#FFEBEE', text: '#C62828', icon: 'close-circle' };
            default: return { bg: '#F5F5F5', text: '#757575', icon: 'time' };
        }
    };

    const renderOrderItem = ({ item }) => {
        const statusStyle = getStatusStyle(item.status);

        return (
            <View style={styles.orderCard}>
                <View style={styles.orderCardTop}>
                    <Image source={{ uri: item.image }} style={styles.orderImage} />
                    <View style={styles.orderMainInfo}>
                        <View style={styles.orderHeaderRow}>
                            <Text style={styles.orderId}>{item.id}</Text>
                        </View>
                        <Text style={styles.orderTitle} numberOfLines={1}>{item.items}</Text>
                        <Text style={styles.orderDate}>{item.date}</Text>
                    </View>
                </View>

                <View style={styles.statusAndPriceRow}>
                    <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                        <Ionicons name={statusStyle.icon} size={14} color={statusStyle.text} style={{ marginRight: 4 }} />
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
                    </View>
                    <Text style={styles.orderPrice}>₹{item.total.toFixed(2)}</Text>
                </View>

                <View style={styles.orderActions}>
                    <TouchableOpacity style={styles.outlineButton}>
                        <Text style={styles.outlineButtonText}>View Details</Text>
                    </TouchableOpacity>
                    {item.status === 'Delivered' && (
                        <TouchableOpacity style={styles.fillButton}>
                            <Ionicons name="repeat" size={16} color="#FFF" style={{ marginRight: 6 }} />
                            <Text style={styles.fillButtonText}>Reorder</Text>
                        </TouchableOpacity>
                    )}
                    {item.status === 'Out for Delivery' && (
                        <TouchableOpacity style={styles.fillButton}>
                            <Text style={styles.fillButtonText}>Track Order</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.safeArea}>
            <Header title="My Orders" role="buyer" />
            <FlatList
                data={orders}
                keyExtractor={item => item.id}
                renderItem={renderOrderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F7F7F7',
        paddingTop: 0, // Ensure no double padding
    },
    // screenHeader removed as now using Header component
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    listContent: {
        padding: 16,
    },
    orderCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        elevation: 2,
    },
    orderCardTop: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    orderImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#F0F0F0',
        marginRight: 12,
    },
    orderMainInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    orderHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    orderId: {
        fontSize: 12,
        color: '#888',
        fontWeight: '600',
        marginBottom: 2,
    },
    orderTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    orderDate: {
        fontSize: 12,
        color: '#999',
    },
    statusAndPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    orderPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    orderActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
        paddingTop: 12,
    },
    outlineButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        marginRight: 12,
    },
    outlineButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
    },
    fillButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2196F3',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    fillButtonText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#FFF',
    },
});

export default BuyerOrdersScreen;
