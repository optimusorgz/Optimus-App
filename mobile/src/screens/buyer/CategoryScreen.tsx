import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Image,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../../components/ProductCard';
import Header from '../../components/Header';
import { productService } from '../../api/services';

const { width } = Dimensions.get('window');

const SORT_OPTIONS = [
    { id: 'popular', label: 'Most Popular', icon: 'flame' },
    { id: 'price_low', label: 'Price: Low to High', icon: 'arrow-up' },
    { id: 'price_high', label: 'Price: High to Low', icon: 'arrow-down' },
    { id: 'rating', label: 'Highest Rated', icon: 'star' },
    { id: 'newest', label: 'Newest First', icon: 'time' },
];

const CategoryScreen = ({ route, navigation }) => {
    const { category } = route.params;
    const [products, setProducts] = useState([]);
    const [sortBy, setSortBy] = useState('popular');
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProducts();
    }, [category, sortBy]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                category_id: category.id,
                limit: 50,
            };

            if (sortBy === 'price_low') {
                params.sortBy = 'price_low';
            } else if (sortBy === 'price_high') {
                params.sortBy = 'price_high';
            } else if (sortBy === 'rating') {
                params.sortBy = 'rating';
            }

            const data = await productService.getProducts(params);
            setProducts(data.products || []);
        } catch (err) {
            console.error('Error loading products:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (option) => {
        setSortBy(option);
        setShowSortOptions(false);
    };

    const renderGridItem = ({ item }) => (
        <ProductCard
            product={item}
            style={{ width: (width - 48) / 2, marginBottom: 16 }}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
        />
    );

    const renderListItem = ({ item }) => (
        <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
        >
            <Image source={{ uri: item.image_url }} style={styles.listItemImage} />
            <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                <View style={styles.listItemRating}>
                    <Ionicons name="star" size={14} color="#FFA000" />
                    <Text style={styles.ratingText}>{item.rating || 'N/A'}</Text>
                </View>
                <Text style={styles.listItemSeller} numberOfLines={1}>
                    {item.seller_name || 'Unknown Seller'}
                </Text>
                <View style={styles.listItemPriceRow}>
                    <Text style={styles.listItemPrice}>₹ {item.price}</Text>
                    {item.original_price && (
                        <>
                            <Text style={styles.listItemOriginalPrice}>₹ {item.original_price}</Text>
                            {item.discount_percentage > 0 && (
                                <View style={styles.listItemDiscount}>
                                    <Text style={styles.listItemDiscountText}>{Math.round(item.discount_percentage)}% OFF</Text>
                                </View>
                            )}
                        </>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <Header
                    title={category.name}
                    role="buyer"
                    onBack={() => navigation.goBack()}
                />
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#2196F3" />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header
                title={category.name}
                role="buyer"
                onBack={() => navigation.goBack()}
                rightActions={
                    <TouchableOpacity
                        style={{ padding: 4 }}
                        onPress={() => navigation.navigate('BuyerHome', { screen: 'Search' })}
                    >
                        <Ionicons name="search" size={24} color="#333" />
                    </TouchableOpacity>
                }
            />

            {/* Filter and Sort Bar */}
            <View style={styles.filterBar}>
                <View style={styles.productCount}>
                    <Text style={styles.productCountText}>
                        {products.length} {products.length === 1 ? 'Product' : 'Products'}
                    </Text>
                </View>

                <View style={styles.filterActions}>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setShowSortOptions(!showSortOptions)}
                    >
                        <Ionicons name="funnel-outline" size={18} color="#333" />
                        <Text style={styles.filterButtonText} numberOfLines={1}>
                            {SORT_OPTIONS.find(opt => opt.id === sortBy)?.label || 'Sort'}
                        </Text>
                        <Ionicons
                            name={showSortOptions ? 'chevron-up' : 'chevron-down'}
                            size={16}
                            color="#666"
                        />
                    </TouchableOpacity>

                    <View style={styles.viewToggle}>
                        <TouchableOpacity
                            style={[styles.viewButton, viewMode === 'grid' && styles.viewButtonActive]}
                            onPress={() => setViewMode('grid')}
                        >
                            <Ionicons
                                name="grid"
                                size={18}
                                color={viewMode === 'grid' ? '#2196F3' : '#999'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.viewButton, viewMode === 'list' && styles.viewButtonActive]}
                            onPress={() => setViewMode('list')}
                        >
                            <Ionicons
                                name="list"
                                size={18}
                                color={viewMode === 'list' ? '#2196F3' : '#999'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Sort Options Dropdown */}
            {showSortOptions && (
                <View style={styles.sortDropdown}>
                    {SORT_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.sortOption,
                                sortBy === option.id && styles.sortOptionActive,
                            ]}
                            onPress={() => handleSort(option.id)}
                        >
                            <Ionicons
                                name={option.icon}
                                size={18}
                                color={sortBy === option.id ? '#2196F3' : '#666'}
                            />
                            <Text
                                style={[
                                    styles.sortOptionText,
                                    sortBy === option.id && styles.sortOptionTextActive,
                                ]}
                            >
                                {option.label}
                            </Text>
                            {sortBy === option.id && (
                                <Ionicons name="checkmark" size={20} color="#2196F3" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Products List */}
            {error ? (
                <View style={styles.emptyState}>
                    <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
                    <Text style={styles.emptyStateTitle}>Error Loading Products</Text>
                    <Text style={styles.emptyStateText}>{error}</Text>
                    <TouchableOpacity
                        style={[styles.emptyStateButton, { backgroundColor: '#FF6B6B' }]}
                        onPress={loadProducts}
                    >
                        <Text style={styles.emptyStateButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            ) : products.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="cube-outline" size={64} color="#CCC" />
                    <Text style={styles.emptyStateTitle}>No Products Found</Text>
                    <Text style={styles.emptyStateText}>
                        We couldn't find any products in this category.
                    </Text>
                    <TouchableOpacity
                        style={styles.emptyStateButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.emptyStateButtonText}>Browse Other Categories</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={products}
                    key={viewMode}
                    numColumns={viewMode === 'grid' ? 2 : 1}
                    renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={
                        viewMode === 'grid' ? styles.gridContainer : styles.listContainer
                    }
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterBar: {
        flexDirection: 'column',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    productCount: {
        marginBottom: 12,
    },
    productCountText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    filterActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        flex: 1,
        marginRight: 12,
    },
    filterButtonText: {
        fontSize: 14,
        color: '#333',
        marginLeft: 8,
        marginRight: 4,
        flex: 1,
    },
    viewToggle: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 2,
    },
    viewButton: {
        padding: 8,
        borderRadius: 6,
    },
    viewButtonActive: {
        backgroundColor: '#FFF',
    },
    sortDropdown: {
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingVertical: 8,
    },
    sortOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    sortOptionActive: {
        backgroundColor: '#F0F7FF',
    },
    sortOptionText: {
        fontSize: 15,
        color: '#333',
        marginLeft: 12,
        flex: 1,
    },
    sortOptionTextActive: {
        color: '#2196F3',
        fontWeight: '600',
    },
    gridContainer: {
        padding: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    listContainer: {
        padding: 16,
    },
    listItem: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginBottom: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    listItemImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: '#F0F0F0',
    },
    listItemContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    listItemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    listItemRating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    ratingText: {
        fontSize: 13,
        color: '#333',
        marginLeft: 4,
        fontWeight: '600',
    },
    listItemSeller: {
        fontSize: 13,
        color: '#666',
        marginBottom: 8,
    },
    listItemPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listItemPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2196F3',
        marginRight: 8,
    },
    listItemOriginalPrice: {
        fontSize: 14,
        color: '#999',
        textDecorationLine: 'line-through',
        marginRight: 8,
    },
    listItemDiscount: {
        backgroundColor: '#FFE8E8',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    listItemDiscountText: {
        fontSize: 11,
        color: '#FF5252',
        fontWeight: 'bold',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    emptyStateButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    emptyStateButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default CategoryScreen;
