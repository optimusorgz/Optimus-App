import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import { ScrollView } from 'react-native';
import { productService, authService } from '../../api/services';

const { width } = Dimensions.get('window');

const SellerProductsScreen = ({ navigation }) => {
    const [selectedFilter, setSelectedFilter] = useState('All');
    const filters = ['All', 'Active', 'Out of Stock', 'Low Stock'];

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [sellerId, setSellerId] = useState(null);

    useEffect(() => {
        loadSellerData();
    }, []);

    const loadSellerData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get current seller ID
            const user = await authService.getCurrentUser();
            if (user && user.id) {
                setSellerId(user.id);
                // Fetch seller's products
                const sellerProducts = await productService.getSellerProducts(user.id);
                setProducts(sellerProducts);
            } else {
                setError('Unable to load seller information');
            }
        } catch (err) {
            console.error('Error loading seller products:', err);
            setError(err.message || 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            if (sellerId) {
                const sellerProducts = await productService.getSellerProducts(sellerId);
                setProducts(sellerProducts);
            }
        } catch (err) {
            console.error('Error refreshing products:', err);
            setError(err.message);
        } finally {
            setRefreshing(false);
        }
    };

    const getProductStatus = (product) => {
        if (product.stock_quantity === 0) return 'Out of Stock';
        if (product.stock_quantity < 5) return 'Low Stock';
        return 'Active';
    };

    const filterProducts = () => {
        if (selectedFilter === 'All') return products;
        return products.filter(p => getProductStatus(p) === selectedFilter);
    };

    const renderProduct = ({ item }) => {
        const status = getProductStatus(item);
        return (
            <TouchableOpacity
                style={styles.productCard}
                onPress={() => navigation.navigate('EditProduct', { product: item })}
            >
                <Image source={{ uri: item.image_url }} style={styles.productImage} />
                <View style={styles.productInfo}>
                    <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>

                    <View style={styles.priceRow}>
                        <Text style={styles.productPrice}>₹{item.price.toLocaleString()}</Text>
                        <View style={styles.stockInfo}>
                            <Ionicons
                                name={item.stock_quantity > 0 ? 'checkmark-circle' : 'close-circle'}
                                size={14}
                                color={item.stock_quantity > 0 ? '#388E3C' : '#F44336'}
                            />
                            <Text style={[
                                styles.stockText,
                                { color: item.stock_quantity > 0 ? '#388E3C' : '#F44336' }
                            ]}>
                                {item.stock_quantity > 0 ? `${item.stock_quantity} in stock` : 'Out of stock'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Ionicons name="trending-up" size={14} color="#757575" />
                            <Text style={styles.statText}>{item.rating || 0} rating</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="eye" size={14} color="#757575" />
                            <Text style={styles.statText}>{item.views || 0} views</Text>
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
    };

    const filteredProducts = filterProducts();

    return (
        <View style={styles.container}>
            <Header
                title="My Products"
                role="seller"
                onBack={() => navigation.goBack()}
            />

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2874F0" />
                </View>
            ) : (
                <>
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
                        <Text style={styles.countText}>{filteredProducts.length} Products</Text>
                        <TouchableOpacity style={styles.sortBtn}>
                            <Ionicons name="swap-vertical" size={16} color="#757575" />
                            <Text style={styles.sortText}>Sort</Text>
                        </TouchableOpacity>
                    </View>

                    {error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity style={styles.retryBtn} onPress={loadSellerData}>
                                <Text style={styles.retryBtnText}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    ) : filteredProducts.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="bag-outline" size={64} color="#CCC" />
                            <Text style={styles.emptyText}>No products found</Text>
                            <TouchableOpacity
                                style={styles.addFirstProductBtn}
                                onPress={() => navigation.navigate('AddProduct')}
                            >
                                <Text style={styles.addFirstProductBtnText}>Add Your First Product</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredProducts}
                            keyExtractor={item => item.id.toString()}
                            renderItem={renderProduct}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                        />
                    )}
                </>
            )}

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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        gap: 16,
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 12,
        marginBottom: 24,
    },
    addFirstProductBtn: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 4,
        backgroundColor: '#2874F0',
    },
    addFirstProductBtnText: {
        color: '#FFF',
        fontWeight: '600',
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
