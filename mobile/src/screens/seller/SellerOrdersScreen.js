import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';

const SellerOrdersScreen = ({ navigation }) => {
    const [selectedTab, setSelectedTab] = useState('All');
    const [orders] = useState([
        {
            id: 'ORD001',
            customer: 'Rahul Kumar',
            items: 2,
            amount: 2999,
            status: 'Pending',
            date: '2 hours ago',
            address: 'Bangalore, Karnataka',
        },
        {
            id: 'ORD002',
            customer: 'Priya Singh',
            items: 1,
            amount: 15999,
            status: 'Processing',
            date: '5 hours ago',
            address: 'Mumbai, Maharashtra',
        },
        {
            id: 'ORD003',
            customer: 'Amit Sharma',
            items: 3,
            amount: 4500,
            status: 'Shipped',
            date: '1 day ago',
            address: 'Delhi, NCR',
        },
        {
            id: 'ORD004',
            customer: 'Sneha Patel',
            items: 1,
            amount: 899,
            status: 'Delivered',
            date: '3 days ago',
            address: 'Pune, Maharashtra',
        },
    ]);

    const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered'];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return '#FF9800';
            case 'Processing': return '#2196F3';
            case 'Shipped': return '#9C27B0';
            case 'Delivered': return '#4CAF50';
            default: return '#666';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return 'time-outline';
            case 'Processing': return 'sync-outline';
            case 'Shipped': return 'airplane-outline';
            case 'Delivered': return 'checkmark-circle-outline';
            default: return 'ellipse-outline';
        }
    };

    const filteredOrders = selectedTab === 'All'
        ? orders
        : orders.filter(order => order.status === selectedTab);

    const renderOrder = ({ item }) => (
        <TouchableOpacity style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <View>
                    <Text style={styles.orderId}>#{item.id}</Text>
                    <Text style={styles.orderDate}>{item.date}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                    <Ionicons name={getStatusIcon(item.status)} size={14} color={getStatusColor(item.status)} />
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {item.status}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.orderDetails}>
                <View style={styles.detailRow}>
                    <Ionicons name="person-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{item.customer}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{item.address}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="cube-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{item.items} items</Text>
                </View>
            </View>

            <View style={styles.orderFooter}>
                <Text style={styles.orderAmount}>₹{item.amount}</Text>
                {item.status === 'Pending' && (
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Accept Order</Text>
                    </TouchableOpacity>
                )}
                {item.status === 'Processing' && (
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Mark as Shipped</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Header
                title="Orders"
                role="seller"
                onBack={() => navigation.goBack()}
            />

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

            <FlatList
                data={filteredOrders}
                keyExtractor={item => item.id}
                renderItem={renderOrder}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="receipt-outline" size={64} color="#CCC" />
                        <Text style={styles.emptyText}>No {selectedTab.toLowerCase()} orders</Text>
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
});

export default SellerOrdersScreen;
