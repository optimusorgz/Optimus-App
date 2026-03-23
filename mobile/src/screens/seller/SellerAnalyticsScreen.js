import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { LineChart, BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const SellerAnalyticsScreen = ({ navigation }) => {
    const chartConfig = {
        backgroundColor: '#FFF',
        backgroundGradientFrom: '#FFF',
        backgroundGradientTo: '#FFF',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#2196F3',
        },
    };

    const salesData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43, 65],
            },
        ],
    };

    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                data: [3000, 4500, 3200, 6000, 7500, 5800],
            },
        ],
    };

    const StatCard = ({ icon, title, value, change, color }) => (
        <View style={[styles.statCard, { borderLeftColor: color }]}>
            <View style={styles.statHeader}>
                <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
                    <Ionicons name={icon} size={24} color={color} />
                </View>
                <View style={[styles.changeBadge, { backgroundColor: change >= 0 ? '#E8F5E9' : '#FFEBEE' }]}>
                    <Ionicons
                        name={change >= 0 ? 'trending-up' : 'trending-down'}
                        size={12}
                        color={change >= 0 ? '#4CAF50' : '#F44336'}
                    />
                    <Text style={[styles.changeText, { color: change >= 0 ? '#4CAF50' : '#F44336' }]}>
                        {Math.abs(change)}%
                    </Text>
                </View>
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
        </View>
    );

    const MetricRow = ({ label, value, icon, color }) => (
        <View style={styles.metricRow}>
            <View style={styles.metricLeft}>
                <View style={[styles.metricIcon, { backgroundColor: color + '20' }]}>
                    <Ionicons name={icon} size={16} color={color} />
                </View>
                <Text style={styles.metricLabel}>{label}</Text>
            </View>
            <Text style={styles.metricValue}>{value}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Header title="Analytics" role="seller" />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Key Metrics */}
                <View style={styles.metricsGrid}>
                    <StatCard
                        icon="cart-outline"
                        title="Total Orders"
                        value="156"
                        change={12.5}
                        color="#2196F3"
                    />
                    <StatCard
                        icon="cash-outline"
                        title="Revenue"
                        value="₹45,670"
                        change={8.3}
                        color="#4CAF50"
                    />
                    <StatCard
                        icon="people-outline"
                        title="Customers"
                        value="89"
                        change={-2.1}
                        color="#FF9800"
                    />
                    <StatCard
                        icon="cube-outline"
                        title="Products Sold"
                        value="342"
                        change={15.7}
                        color="#9C27B0"
                    />
                </View>

                {/* Sales Chart */}
                <View style={styles.chartSection}>
                    <Text style={styles.chartTitle}>Weekly Sales</Text>
                    <LineChart
                        data={salesData}
                        width={width - 32}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chart}
                    />
                </View>

                {/* Revenue Chart */}
                <View style={styles.chartSection}>
                    <Text style={styles.chartTitle}>Monthly Revenue</Text>
                    <BarChart
                        data={revenueData}
                        width={width - 32}
                        height={220}
                        chartConfig={{
                            ...chartConfig,
                            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                        }}
                        style={styles.chart}
                        showValuesOnTopOfBars
                    />
                </View>

                {/* Performance Metrics */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Performance Metrics</Text>
                    <View style={styles.metricsCard}>
                        <MetricRow label="Average Order Value" value="₹293" icon="trending-up" color="#4CAF50" />
                        <MetricRow label="Conversion Rate" value="3.2%" icon="analytics" color="#2196F3" />
                        <MetricRow label="Customer Retention" value="68%" icon="people" color="#9C27B0" />
                        <MetricRow label="Return Rate" value="2.1%" icon="return-down-back" color="#FF9800" />
                    </View>
                </View>

                {/* Top Products */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Top Selling Products</Text>
                    <View style={styles.topProductsCard}>
                        <TopProductItem rank={1} name="Wireless Headphones" sales={120} color="#FFD700" />
                        <TopProductItem rank={2} name="Smart Watch" sales={85} color="#C0C0C0" />
                        <TopProductItem rank={3} name="Phone Case" sales={67} color="#CD7F32" />
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const TopProductItem = ({ rank, name, sales, color }) => (
    <View style={styles.topProductRow}>
        <View style={[styles.rankBadge, { backgroundColor: color + '30' }]}>
            <Text style={[styles.rankText, { color: color }]}>#{rank}</Text>
        </View>
        <View style={styles.topProductInfo}>
            <Text style={styles.topProductName}>{name}</Text>
            <Text style={styles.topProductSales}>{sales} units sold</Text>
        </View>
        <Ionicons name="trophy" size={20} color={color} />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 12,
        gap: 12,
    },
    statCard: {
        width: (width - 36) / 2,
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    changeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 2,
    },
    changeText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    statTitle: {
        fontSize: 13,
        color: '#666',
    },
    chartSection: {
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    chart: {
        borderRadius: 12,
    },
    section: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    metricsCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    metricRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    metricLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    metricIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    metricLabel: {
        fontSize: 14,
        color: '#666',
    },
    metricValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    topProductsCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    topProductRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    rankBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rankText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    topProductInfo: {
        flex: 1,
    },
    topProductName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    topProductSales: {
        fontSize: 12,
        color: '#666',
    },
});

export default SellerAnalyticsScreen;
