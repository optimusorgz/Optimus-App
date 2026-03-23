import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { orderService, productService, authService } from '../../api/services';

const { width } = Dimensions.get('window');

const CompanySellerDashboard = ({ navigation }) => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        activeOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        todayOrders: 0,
        todayRevenue: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get current seller info
            const user = await authService.getCurrentUser();
            if (!user || !user.id) {
                setError('Unable to load seller information');
                setLoading(false);
                return;
            }

            // Fetch seller products count
            const products = await productService.getSellerProducts(user.id);
            const productCount = products.length;

            // Fetch seller orders and stats
            const orders = await orderService.getSellerOrders();
            const orderStats = await orderService.getOrderStats();

            // Calculate today's orders and revenue
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const todayOrders = orders.filter(o => {
                const orderDate = new Date(o.created_at);
                orderDate.setHours(0, 0, 0, 0);
                return orderDate.getTime() === today.getTime();
            });
            const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

            setStats({
                totalProducts: productCount,
                activeOrders: orders.filter(o => o.status?.toLowerCase() !== 'completed' && o.status?.toLowerCase() !== 'cancelled').length,
                totalRevenue: orderStats.totalRevenue,
                pendingOrders: orders.filter(o => o.status?.toLowerCase() === 'pending').length,
                todayOrders: todayOrders.length,
                todayRevenue: todayRevenue,
            });

            // Set recent orders (latest 3)
            setRecentOrders(orders.slice(0, 3));

            setLoading(false);
        } catch (err) {
            console.error('Error loading dashboard data:', err);
            setError(err.message || 'Failed to load dashboard');
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await loadDashboardData();
        } catch (err) {
            console.error('Error refreshing dashboard:', err);
        } finally {
            setRefreshing(false);
        }
    };

const StatCard = ({ icon, title, value, subtitle, color, onPress }) => (
    <TouchableOpacity style={styles.statCard} onPress={onPress}>
        <View style={styles.statHeader}>
            <View style={[styles.statIconBox, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={22} color={color} />
            </View>
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </TouchableOpacity>
);

const QuickAction = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.quickActionCard} onPress={onPress}>
        <View style={styles.quickActionIcon}>
            <Ionicons name={icon} size={24} color="#2874F0" />
        </View>
        <Text style={styles.quickActionTitle}>{title}</Text>
    </TouchableOpacity>
);

const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'pending': return '#FF9800';
        case 'processing': return '#2874F0';
        case 'shipped': return '#9C27B0';
        case 'completed': return '#388E3C';
        default: return '#666';
    }
};

const getStatusBg = (status) => {
    switch (status?.toLowerCase()) {
        case 'pending': return '#FFF3E0';
        case 'processing': return '#E3F2FD';
        case 'shipped': return '#F3E5F5';
        case 'completed': return '#E8F5E9';
        default: return '#F5F5F5';
    }
};

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                {/* App Name & Welcome */}
                <View style={styles.appHeader}>
                    <View>
                        <Text style={styles.appName}>Optimus</Text>
                        <Text style={styles.welcomeText}>Welcome Back! 👋</Text>
                    </View>
                    <TouchableOpacity style={styles.notificationBtn}>
                        <Ionicons name="notifications-outline" size={24} color="#212121" />
                        <View style={styles.notificationBadge}>
                            <Text style={styles.notificationBadgeText}>3</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#2874F0" />
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle-outline" size={64} color="#F44336" />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryBtn} onPress={loadDashboardData}>
                            <Text style={styles.retryBtnText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    >
                        {/* Today's Performance */}
                        <View style={styles.todaySection}>
                            <View style={styles.todayHeader}>
                                <Text style={styles.todaySectionTitle}>Today's Performance</Text>
                                <Text style={styles.todayDate}>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</Text>
                            </View>
                            <View style={styles.todayStats}>
                                <View style={styles.todayStat}>
                                    <Text style={styles.todayValue}>{stats.todayOrders}</Text>
                                    <Text style={styles.todayLabel}>Orders</Text>
                                </View>
                                <View style={styles.todayDivider} />
                                <View style={styles.todayStat}>
                                    <Text style={styles.todayValue}>₹{stats.todayRevenue.toLocaleString()}</Text>
                                    <Text style={styles.todayLabel}>Revenue</Text>
                                </View>
                            </View>
                        </View>

                        {/* Stats Grid */}
                        <View style={styles.statsSection}>
                            <Text style={styles.statsHeader}>Overview</Text>
                            <View style={styles.statsGrid}>
                                <StatCard
                                    icon="cube-outline"
                                    title="Total Products"
                                    value={stats.totalProducts}
                                    color="#FF9800"
                                    onPress={() => navigation.navigate('SellerProducts')}
                                />
                                <StatCard
                                    icon="receipt-outline"
                                    title="Active Orders"
                                    value={stats.activeOrders}
                                    color="#2874F0"
                                    onPress={() => navigation.navigate('SellerOrders')}
                                />
                                <StatCard
                                    icon="cash-outline"
                                    title="Total Revenue"
                                    value={`₹${(stats.totalRevenue / 1000).toFixed(1)}k`}
                                    subtitle="This month"
                                    color="#388E3C"
                                />
                                <StatCard
                                    icon="time-outline"
                                    title="Pending"
                                    value={stats.pendingOrders}
                                    subtitle="Need action"
                                    color="#F44336"
                                    onPress={() => navigation.navigate('SellerOrders')}
                                />
                            </View>
                        </View>

                        {/* Quick Actions */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Quick Actions</Text>
                            <View style={styles.quickActionsGrid}>
                                <QuickAction
                                    icon="add-circle-outline"
                                    title="Add Product"
                                    onPress={() => navigation.navigate('AddProduct')}
                                />
                                <QuickAction
                                    icon="list-outline"
                                    title="Manage Inventory"
                                    onPress={() => navigation.navigate('SellerProducts')}
                                />
                                <QuickAction
                                    icon="receipt-outline"
                                    title="View Orders"
                                    onPress={() => navigation.navigate('SellerOrders')}
                                />
                                <QuickAction
                                    icon="analytics-outline"
                                    title="Analytics"
                                    onPress={() => { }}
                                />
                            </View>
                        </View>

                        {/* Recent Orders */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Recent Orders</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('SellerOrders')}>
                                    <Text style={styles.viewAllLink}>View All</Text>
                                </TouchableOpacity>
                            </View>
                            {recentOrders.length > 0 ? (
                                <View style={styles.ordersContainer}>
                                    {recentOrders.map(order => (
                                        <TouchableOpacity key={order.id} style={styles.orderCard}>
                                            <View style={styles.orderRow}>
                                                <View style={styles.orderLeft}>
                                                    <Text style={styles.orderId}>#{order.id}</Text>
                                                    <Text style={styles.orderCustomer}>{order.buyer_name || 'Customer'}</Text>
                                                    <Text style={styles.orderTime}>{new Date(order.created_at).toLocaleDateString()} • {order.total_items || 1} items</Text>
                                                </View>
                                                <View style={styles.orderRight}>
                                                    <Text style={styles.orderAmount}>₹{order.total_amount?.toLocaleString()}</Text>
                                                    <View style={[styles.statusBadge, { backgroundColor: getStatusBg(order.status) }]}>
                                                        <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                                                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            ) : (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>No recent orders</Text>
                                </View>
                            )}
                        </View>

                        <View style={{ height: 100 }} />
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case 'Pending': return '#FF9800';
        case 'Processing': return '#2874F0';
        case 'Shipped': return '#9C27B0';
        case 'Delivered': return '#388E3C';
        default: return '#666';
    }
};

const getStatusBg = (status) => {
    switch (status) {
        case 'Pending': return '#FFF3E0';
        case 'Processing': return '#E3F2FD';
        case 'Shipped': return '#F3E5F5';
        case 'Delivered': return '#E8F5E9';
        default: return '#F5F5F5';
    }
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#F1F3F6',
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
        backgroundColor: '#2874F0',
    },
    retryBtnText: {
        color: '#FFF',
        fontWeight: '600',
    },
    appHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    appName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2874F0',
        marginBottom: 2,
    },
    welcomeText: {
        fontSize: 14,
        color: '#757575',
    },
    notificationBtn: {
        position: 'relative',
        padding: 8,
    },
    notificationBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: '#F44336',
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    notificationBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFF',
    },
    todaySection: {
        backgroundColor: '#2874F0',
        padding: 16,
        marginTop: 8,
    },
    todayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    todaySectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFF',
    },
    todayDate: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    todayStats: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 8,
        padding: 16,
    },
    todayStat: {
        flex: 1,
        alignItems: 'center',
    },
    todayDivider: {
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    todayValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    todayLabel: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    statsSection: {
        backgroundColor: '#FFF',
        paddingTop: 16,
        paddingBottom: 8,
        marginTop: 8,
    },
    statsHeader: {
        fontSize: 15,
        fontWeight: '600',
        color: '#212121',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
        justifyContent: 'space-between',
    },
    statCard: {
        width: (width - 40) / 2,
        padding: 14,
        marginBottom: 12,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    statHeader: {
        marginBottom: 8,
    },
    statIconBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#212121',
        marginBottom: 2,
    },
    statTitle: {
        fontSize: 13,
        color: '#757575',
        marginBottom: 2,
    },
    statSubtitle: {
        fontSize: 11,
        color: '#9E9E9E',
    },
    section: {
        backgroundColor: '#FFF',
        padding: 16,
        marginTop: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#212121',
    },
    viewAllLink: {
        fontSize: 13,
        color: '#2874F0',
        fontWeight: '500',
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -6,
    },
    quickActionCard: {
        width: (width - 44) / 2,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        margin: 6,
        backgroundColor: '#FAFAFA',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    quickActionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    quickActionTitle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#212121',
        flex: 1,
    },
    ordersContainer: {
        marginTop: 8,
    },
    orderCard: {
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingVertical: 12,
    },
    orderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    orderLeft: {
        flex: 1,
    },
    orderId: {
        fontSize: 13,
        fontWeight: '600',
        color: '#212121',
        marginBottom: 4,
    },
    orderCustomer: {
        fontSize: 14,
        color: '#424242',
        marginBottom: 4,
    },
    orderTime: {
        fontSize: 12,
        color: '#757575',
    },
    orderRight: {
        alignItems: 'flex-end',
    },
    orderAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#212121',
        marginBottom: 6,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 3,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    emptyContainer: {
        paddingVertical: 32,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#999',
    },
});

export default CompanySellerDashboard;
