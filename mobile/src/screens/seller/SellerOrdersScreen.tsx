import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { orderService } from '../../api/services';

const SellerOrdersScreen = ({ navigation }) => {
    const [selectedTab, setSelectedTab] = useState('All');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadSellerOrders();
    }, []);

    const loadSellerOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const sellerOrders = await orderService.getSellerOrders();
            setOrders(sellerOrders);
        } catch (err) {
            console.error('Error loading seller orders:', err);
            setError(err.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const sellerOrders = await orderService.getSellerOrders();
            setOrders(sellerOrders);
        } catch (err) {
            console.error('Error refreshing orders:', err);
            setError(err.message);
        } finally {
            setRefreshing(false);
        }
    };

    const tabs = ['All', 'pending', 'processing', 'shipped', 'completed'];

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return '#FF9800';
            case 'processing': return '#2196F3';
            case 'shipped': return '#9C27B0';
            case 'completed': return '#4CAF50';
            default: return '#666';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'time-outline';
            case 'processing': return 'sync-outline';
            case 'shipped': return 'airplane-outline';
            case 'completed': return 'checkmark-circle-outline';
            default: return 'ellipse-outline';
        }
    };

    const filteredOrders = selectedTab === 'All'
        ? orders
        : orders.filter(order => order.status?.toLowerCase() === selectedTab.toLowerCase());

    const renderOrder = ({ item }) => (
        <TouchableOpacity style={styles.orderCard} onPress={() => navigation.navigate('OrderDetails', { order: item })}>
            <View style={styles.orderHeader}>
                <View>
                    <Text style={styles.orderId}>#{item.id}</Text>
                    <Text style={styles.orderDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                    <Ionicons name={getStatusIcon(item.status)} size={14} color={getStatusColor(item.status)} />
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.orderDetails}>
                <View style={styles.detailRow}>
                    <Ionicons name="person-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{item.buyer_name || 'Customer'}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{item.shipping_address || 'N/A'}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="cube-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{item.total_items || 1} item{item.total_items > 1 ? 's' : ''}</Text>
                </View>
            </View>

            <View style={styles.orderFooter}>
                <Text style={styles.orderAmount}>₹{item.total_amount?.toLocaleString()}</Text>
                {item.status?.toLowerCase() === 'pending' && (
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleStatusUpdate(item.id, 'processing')}>
                        <Text style={styles.actionButtonText}>Accept Order</Text>
                    </TouchableOpacity>
                )}
                {item.status?.toLowerCase() === 'processing' && (
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleStatusUpdate(item.id, 'shipped')}>
                        <Text style={styles.actionButtonText}>Mark as Shipped</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            loadSellerOrders(); // Reload orders
        } catch (err) {
            console.error('Error updating order status:', err);
            setError('Failed to update order status');
        }
    };

    return (
        <View style={styles.container}>
            <Header
                title="Orders"
                role="seller"
                onBack={() => navigation.goBack()}
            />

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2196F3" />
                </View>
            ) : (
                <>
                    {/* Tabs */}
                    <View style={styles.tabsContainer}>
                        <FlatList
                            horizontal
                            data={tabs}
                            keyExtractor={item => item}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.tab, selectedTab === item && styles.activeTab]}
                                    onPress={() => setSelectedTab(item)}
                                >
                                    <Text style={[styles.tabText, selectedTab === item && styles.activeTabText]}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>

                    {error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity style={styles.retryBtn} onPress={loadSellerOrders}>
                                <Text style={styles.retryBtnText}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredOrders}
                            keyExtractor={item => item.id.toString()}
                            renderItem={renderOrder}
                            contentContainerStyle={styles.listContent}
                            ListEmptyComponent={
                                <View style={styles.emptyState}>
                                    <Ionicons name="receipt-outline" size={64} color="#CCC" />
                                    <Text style={styles.emptyText}>No {selectedTab.toLowerCase()} orders</Text>
                                </View>
                            }
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                        />
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabsContainer: {
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginHorizontal: 4,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#2196F3',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    activeTabText: {
        color: '#2196F3',
        fontWeight: '600',
    },
    listContent: {
        padding: 16,
    },
    orderCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    orderDate: {
        fontSize: 12,
        color: '#999',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginBottom: 12,
    },
    orderDetails: {
        gap: 8,
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 14,
        color: '#666',
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    actionButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 16,
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
        marginBottom: 16,
        textAlign: 'center',
    },
    retryBtn: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 4,
        backgroundColor: '#2874F0',
    },
    retryBtnText: {
        color: '#FFF',
        fontWeight: '600',
    },
});

export default SellerOrdersScreen;
