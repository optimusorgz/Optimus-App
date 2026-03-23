import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../../components/ProductCard';
import Header from '../../components/Header';

const { width } = Dimensions.get('window');

// Mock data - In production, this would come from an API
const ALL_PRODUCTS = [
    {
        id: '1',
        title: 'Wireless Headphones',
        price: 79.99,
        originalPrice: 99.99,
        discount: 20,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        rating: 4.5,
        seller: 'TechStore India',
        reviews: 234,
    },
    {
        id: '2',
        title: 'Running Shoes',
        price: 89.99,
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
        rating: 4.8,
        seller: 'SportZone',
        reviews: 456,
    },
    {
        id: '3',
        title: 'Minimalist Watch',
        price: 199.50,
        originalPrice: 249.99,
        discount: 20,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
        rating: 4.9,
        seller: 'Luxury Watches Co.',
        reviews: 189,
    },
    {
        id: '4',
        title: 'Smart Speaker',
        price: 59.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=500&q=80',
        rating: 4.3,
        seller: 'SmartHome Hub',
        reviews: 567,
    },
    {
        id: '5',
        title: 'Design Principles',
        price: 24.99,
        category: 'Books',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80',
        rating: 4.7,
        seller: 'BookMart',
        reviews: 123,
    },
    {
        id: '6',
        title: 'Yoga Mat',
        price: 29.99,
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80',
        rating: 4.6,
        seller: 'FitLife Store',
        reviews: 345,
    },
    {
        id: '7',
        title: 'Laptop Stand',
        price: 39.99,
        originalPrice: 59.99,
        discount: 33,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80',
        rating: 4.4,
        seller: 'TechStore India',
        reviews: 278,
    },
    {
        id: '8',
        title: 'Denim Jacket',
        price: 79.99,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80',
        rating: 4.5,
        seller: 'Fashion Hub',
        reviews: 412,
    },
    {
        id: '9',
        title: 'Desk Lamp',
        price: 34.99,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80',
        rating: 4.6,
        seller: 'Home Decor Plus',
        reviews: 156,
    },
    {
        id: '10',
        title: 'Skincare Set',
        price: 49.99,
        originalPrice: 69.99,
        discount: 29,
        category: 'Beauty',
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80',
        rating: 4.7,
        seller: 'Beauty Essentials',
        reviews: 289,
    },
    {
        id: '11',
        title: 'Basketball',
        price: 44.99,
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80',
        rating: 4.5,
        seller: 'SportZone',
        reviews: 201,
    },
    {
        id: '12',
        title: 'Cookbook Collection',
        price: 34.99,
        category: 'Books',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80',
        rating: 4.8,
        seller: 'BookMart',
        reviews: 167,
    },
];

const SORT_OPTIONS = [
    { id: 'popular', label: 'Most Popular', icon: 'flame' },
    { id: 'price-low', label: 'Price: Low to High', icon: 'arrow-up' },
    { id: 'price-high', label: 'Price: High to Low', icon: 'arrow-down' },
    { id: 'rating', label: 'Highest Rated', icon: 'star' },
    { id: 'newest', label: 'Newest First', icon: 'time' },
];

const CategoryScreen = ({ route, navigation }) => {
    const { category } = route.params;
    const [products, setProducts] = useState([]);
    const [sortBy, setSortBy] = useState('popular');
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    useEffect(() => {
        // Filter products by category
        const filtered = ALL_PRODUCTS.filter(p => p.category === category.name);
        setProducts(sortProducts(filtered, sortBy));
    }, [category, sortBy]);

    const sortProducts = (productList, sortOption) => {
        const sorted = [...productList];
        switch (sortOption) {
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'newest':
                return sorted.reverse();
            case 'popular':
            default:
                return sorted.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
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
            <Image source={{ uri: item.image }} style={styles.listItemImage} />
            <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                <View style={styles.listItemRating}>
                    <Ionicons name="star" size={14} color="#FFA000" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                    <Text style={styles.reviewsText}>({item.reviews || 0})</Text>
                </View>
                <Text style={styles.listItemSeller} numberOfLines={1}>
                    {item.seller}
                </Text>
                <View style={styles.listItemPriceRow}>
                    <Text style={styles.listItemPrice}>${item.price}</Text>
                    {item.originalPrice && (
                        <>
                            <Text style={styles.listItemOriginalPrice}>${item.originalPrice}</Text>
                            <View style={styles.listItemDiscount}>
                                <Text style={styles.listItemDiscountText}>{item.discount}% OFF</Text>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

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
                        <Text style={styles.filterButtonText}>
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
            {products.length === 0 ? (
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
                    key={viewMode} // Force re-render when view mode changes
                    numColumns={viewMode === 'grid' ? 2 : 1}
                    renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
                    keyExtractor={(item) => item.id}
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
    reviewsText: {
        fontSize: 12,
        color: '#999',
        marginLeft: 4,
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
