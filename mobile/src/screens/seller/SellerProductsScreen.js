import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { ScrollView } from 'react-native';

const { width } = Dimensions.get('window');

const SellerProductsScreen = ({ navigation }) => {
    const [selectedFilter, setSelectedFilter] = useState('All');
    const filters = ['All', 'Active', 'Out of Stock', 'Low Stock'];

    const [products] = useState([
        {
            id: '1',
            title: 'Wireless Headphones Premium Quality',
            price: 2499,
            stock: 45,
            sold: 120,
            status: 'Active',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80',
        },
        {
            id: '2',
            title: 'Smart Watch Fitness Tracker',
            price: 15999,
            stock: 12,
            sold: 85,
            status: 'Low Stock',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80',
        },
        {
            id: '3',
            title: 'Laptop Stand Adjustable',
            price: 899,
            stock: 0,
            sold: 200,
            status: 'Out of Stock',
            image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&q=80',
        },
    ]);

    const renderProduct = ({ item }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigation.navigate('EditProduct', { product: item })}
        >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>

                <View style={styles.priceRow}>
                    <Text style={styles.productPrice}>₹{item.price.toLocaleString()}</Text>
                    <View style={styles.stockInfo}>
                        <Ionicons
                            name={item.stock > 0 ? 'checkmark-circle' : 'close-circle'}
                            size={14}
                            color={item.stock > 0 ? '#388E3C' : '#F44336'}
                        />
                        <Text style={[
                            styles.stockText,
                            { color: item.stock > 0 ? '#388E3C' : '#F44336' }
                        ]}>
                            {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                        </Text>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Ionicons name="trending-up" size={14} color="#757575" />
                        <Text style={styles.statText}>{item.sold} sold</Text>
                    </View>
                </View>

                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.editBtn}>
                        <Ionicons name="create-outline" size={16} color="#2874F0" />
                        <Text style={styles.editBtnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.moreBtn}>
                        <Ionicons name="ellipsis-vertical" size={16} color="#757575" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Header
                title="My Products"
                role="seller"
                onBack={() => navigation.goBack()}
            />

            {/* Filters */}
            <View style={styles.filtersContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {filters.map(filter => (
                        <TouchableOpacity
                            key={filter}
                            style={[
                                styles.filterChip,
                                selectedFilter === filter && styles.filterChipActive
                            ]}
                            onPress={() => setSelectedFilter(filter)}
                        >
                            <Text style={[
                                styles.filterText,
                                selectedFilter === filter && styles.filterTextActive
                            ]}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Products Count */}
            <View style={styles.countBar}>
                <Text style={styles.countText}>{products.length} Products</Text>
                <TouchableOpacity style={styles.sortBtn}>
                    <Ionicons name="swap-vertical" size={16} color="#757575" />
                    <Text style={styles.sortText}>Sort</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={products}
                keyExtractor={item => item.id}
                renderItem={renderProduct}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            {/* Add Product Button */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddProduct')}
            >
                <Ionicons name="add" size={24} color="#FFF" />
                <Text style={styles.addButtonText}>Add Product</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F3F6',
    },
    filtersContainer: {
        backgroundColor: '#FFF',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    filterChipActive: {
        backgroundColor: '#2874F0',
        borderColor: '#2874F0',
    },
    filterText: {
        fontSize: 13,
        color: '#757575',
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#FFF',
    },
    countBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    countText: {
        fontSize: 14,
        color: '#212121',
        fontWeight: '500',
    },
    sortBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    sortText: {
        fontSize: 13,
        color: '#757575',
    },
    listContent: {
        padding: 8,
        paddingBottom: 100,
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 4,
        marginBottom: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 4,
        backgroundColor: '#F5F5F5',
    },
    productInfo: {
        flex: 1,
        marginLeft: 12,
    },
    productTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#212121',
        marginBottom: 8,
        lineHeight: 18,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#212121',
    },
    stockInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    stockText: {
        fontSize: 12,
        fontWeight: '500',
    },
    statsRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 12,
        color: '#757575',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 8,
    },
    editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#2874F0',
        gap: 4,
    },
    editBtnText: {
        fontSize: 12,
        color: '#2874F0',
        fontWeight: '500',
    },
    moreBtn: {
        width: 32,
        height: 32,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        flexDirection: 'row',
        backgroundColor: '#2874F0',
        paddingVertical: 14,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    addButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFF',
    },
});

export default SellerProductsScreen;
