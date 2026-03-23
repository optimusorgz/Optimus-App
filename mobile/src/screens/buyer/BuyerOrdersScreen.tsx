
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { orderService } from '../../api/services';

const { width } = Dimensions.get('window');

const BuyerOrdersScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadBuyerOrders();
    }, []);

    const loadBuyerOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const buyerOrders = await orderService.getBuyerOrders();
            setOrders(buyerOrders);
        } catch (err) {
            console.error('Error loading buyer orders:', err);
            setError(err.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const buyerOrders = await orderService.getBuyerOrders();
            setOrders(buyerOrders);
        } catch (err) {
            console.error('Error refreshing orders:', err);
        } finally {
            setRefreshing(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return { bg: '#E8F5E9', text: '#2E7D32', icon: 'checkmark-circle' };
            case 'shipped': return { bg: '#FFF3E0', text: '#EF6C00', icon: 'bicycle' };
            case 'cancelled': return { bg: '#FFEBEE', text: '#C62828', icon: 'close-circle' };
            case 'pending': return { bg: '#E3F2FD', text: '#1976D2', icon: 'time' };
            case 'processing': return { bg: '#F3E5F5', text: '#7B1FA2', icon: 'sync' };
            default: return { bg: '#F5F5F5', text: '#757575', icon: 'time' };
        }
    };

    const renderOrderItem = ({ item }) => {
        const statusStyle = getStatusStyle(item.status);

        return (
            <View style={styles.orderCard}>
                <View style={styles.orderCardTop}>
                    <Image 
                        source={{ uri: item.product_image || 'https://via.placeholder.com/100' }} 
                        style={styles.orderImage} 
                        onError={(e) => console.log('Image loading error:', e)}
                    />
                    <View style={styles.orderMainInfo}>
                        <View style={styles.orderHeaderRow}>
                            <Text style={styles.orderId}>#{item.id}</Text>
                        </View>
                        <Text style={styles.orderTitle} numberOfLines={1}>{item.total_items || 1} item{item.total_items > 1 ? 's' : ''}</Text>
                        <Text style={styles.orderDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
                    </View>
                </View>

                <View style={styles.statusAndPriceRow}>
                    <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                        <Ionicons name={statusStyle.icon} size={14} color={statusStyle.text} style={{ marginRight: 4 }} />
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}</Text>
                    </View>
                    <Text style={styles.orderPrice}>₹{item.total_amount?.toLocaleString()}</Text>
                </View>

                <View style={styles.orderActions}>
                    <TouchableOpacity style={styles.outlineButton}>
                        <Text style={styles.outlineButtonText}>View Details</Text>
                    </TouchableOpacity>
                    {item.status?.toLowerCase() === 'completed' && (
                        <TouchableOpacity style={styles.fillButton}>
                            <Ionicons name="repeat" size={16} color="#FFF" style={{ marginRight: 6 }} />
                            <Text style={styles.fillButtonText}>Reorder</Text>
                        </TouchableOpacity>
                    )}
                    {item.status?.toLowerCase() === 'shipped' && (
                        <TouchableOpacity style={styles.fillButton}>
                            <Text style={styles.fillButtonText}>Track Order</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Header title="My Orders" role="buyer" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2196F3" />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.safeArea}>
            <Header title="My Orders" role="buyer" />
            {error ? (
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color="#F44336" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={loadBuyerOrders}>
                        <Text style={styles.retryBtnText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderOrderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="receipt-outline" size={64} color="#CCC" />
                            <Text style={styles.emptyText}>No orders found</Text>
                        </View>
                    }
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#F7F7F7',
        paddingTop: 0, // Ensure no double padding
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    errorText: {
        fontSize: 16,
        color: '#F44336',
        marginTop: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    retryBtn: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 4,
        backgroundColor: '#2196F3',
    },
    retryBtnText: {
        color: '#FFF',
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100,
    },
    emptyText: {
        marginTop: 12,
        fontSize: 16,
        color: '#999',
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
