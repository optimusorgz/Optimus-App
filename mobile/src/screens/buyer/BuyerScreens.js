
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, TextInput, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../../components/ProductCard';

const { width } = Dimensions.get('window');

// Mock Data
const CATEGORIES = [
    { id: '1', name: 'Electronics', icon: 'https://cdn-icons-png.flaticon.com/128/3659/3659899.png' },
    { id: '2', name: 'Fashion', icon: 'https://cdn-icons-png.flaticon.com/128/3050/3050253.png' },
    { id: '3', name: 'Books', icon: 'https://cdn-icons-png.flaticon.com/128/2232/2232688.png' },
    { id: '4', name: 'Sports', icon: 'https://cdn-icons-png.flaticon.com/128/857/857681.png' },
    { id: '5', name: 'Rentals', icon: 'https://cdn-icons-png.flaticon.com/128/1584/1584808.png' },
    { id: '6', name: 'Used', icon: 'https://cdn-icons-png.flaticon.com/128/3081/3081840.png' },
    { id: '7', name: 'Home', icon: 'https://cdn-icons-png.flaticon.com/128/619/619153.png' },
    { id: '8', name: 'Beauty', icon: 'https://cdn-icons-png.flaticon.com/128/2762/2762316.png' },
];

const PRODUCTS = [
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
    },
    {
        id: '2',
        title: 'Running Shoes',
        price: 89.99,
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
        rating: 4.8,
        seller: 'SportZone',
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
    },
    {
        id: '4',
        title: 'Smart Speaker',
        price: 59.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=500&q=80',
        rating: 4.3,
        seller: 'SmartHome Hub',
    },
    {
        id: '5',
        title: 'Design Principles',
        price: 24.99,
        category: 'Books',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80',
        rating: 4.7,
        seller: 'BookMart',
    },
    {
        id: '6',
        title: 'Yoga Mat',
        price: 29.99,
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80',
        rating: 4.6,
        seller: 'FitLife Store',
    },
];

const CategoryGridItem = ({ item, onPress }) => (
    <TouchableOpacity style={styles.categoryRefreshed} onPress={onPress}>
        <View style={styles.categoryIconBg}>
            <Image source={{ uri: item.icon }} style={styles.categoryIcon} />
        </View>
        <Text style={styles.categoryLabel}>{item.name}</Text>
    </TouchableOpacity>
);

const SectionHeader = ({ title, subtitle, onSeeAll }) => (
    <View style={styles.sectionHeader}>
        <View>
            <Text style={styles.sectionTitle}>{title}</Text>
            {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
        </View>
        <TouchableOpacity onPress={onSeeAll}>
            <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
    </View>
);

const BANNERS = [
    { id: '1', title: '50% OFF', subtitle: 'On Rental Equipment', image: 'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=800&q=80' },
    { id: '2', title: 'Student', subtitle: 'Essentials Kit', image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&q=80' },
    { id: '3', title: 'New Arrivals', subtitle: 'Trendy Fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80' },
];

const BannerCarousel = () => {
    const flatListRef = React.useRef(null);
    const [activeIndex, setActiveIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            let nextIndex = activeIndex + 1;
            if (nextIndex >= BANNERS.length) {
                nextIndex = 0;
            }
            setActiveIndex(nextIndex);

            // Check if flatListRef.current exists before calling scrollToIndex
            if (flatListRef.current) {
                flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [activeIndex]);

    const renderItem = ({ item }) => (
        <View style={styles.bannerContainer}>
            <Image source={{ uri: item.image }} style={styles.bannerImage} resizeMode="cover" />
            <View style={styles.bannerOverlay}>
                <Text style={styles.bannerTitle}>{item.title}</Text>
                <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                <TouchableOpacity style={styles.bannerButton}>
                    <Text style={styles.bannerButtonText}>Shop Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <FlatList
            ref={flatListRef}
            data={BANNERS}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            style={styles.carouselList}
            // getItemLayout is important for scrollToIndex to work reliably
            getItemLayout={(data, index) => (
                { length: width, offset: width * index, index }
            )}
        />
    );
};

import Header from '../../components/Header';

// ...

const BuyerHomeScreen = ({ navigation }) => {
    return (
        <View style={styles.safeArea}>
            <Header role="buyer" type="home" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Banner Carousel */}
                <BannerCarousel />

                {/* Categories Grid */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={styles.categoryHeader}>Shop by Category</Text>
                    <View style={styles.gridContainer}>
                        {CATEGORIES.map((cat) => (
                            <CategoryGridItem
                                key={cat.id}
                                item={cat}
                                onPress={() => navigation.navigate('Category', { category: cat })}
                            />
                        ))}
                    </View>
                </View>

                {/* Recommended Section (Horizontal) */}
                <View style={{ marginBottom: 20 }}>
                    <SectionHeader title="Recommended for You" subtitle="Based on your history" />
                    <FlatList
                        data={PRODUCTS}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <ProductCard
                                product={item}
                                onPress={() => navigation.navigate('ProductDetails', { product: item })}
                                horizontal={true}
                            />
                        )}
                        style={styles.horizontalList}
                        contentContainerStyle={{ paddingHorizontal: 16 }}
                    />
                </View>

                {/* Student Rentals Section (Horizontal) */}
                <View style={{ marginBottom: 20 }}>
                    <SectionHeader title="Student Rentals" subtitle="Rent essentials for cheap" />
                    <FlatList
                        data={PRODUCTS.slice(3)}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={item => 'rent-' + item.id}
                        renderItem={({ item }) => (
                            <ProductCard
                                product={item}
                                onPress={() => navigation.navigate('ProductDetails', { product: item })}
                                horizontal={true}
                            />
                        )}
                        style={styles.horizontalList}
                        contentContainerStyle={{ paddingHorizontal: 16 }}
                    />
                </View>

                {/* All Products (Vertical) */}
                <View style={{ marginBottom: 20 }}>
                    <SectionHeader title="All Products" />
                    <View style={styles.verticalGrid}>
                        {PRODUCTS.map(item => (
                            <ProductCard
                                key={'vert-' + item.id}
                                product={item}
                                style={{ width: (width - 48) / 2, marginBottom: 16 }} // Override width for grid
                                onPress={() => navigation.navigate('ProductDetails', { product: item })}
                            />
                        ))}
                    </View>
                </View>

                <View style={{ height: 80 }} />
            </ScrollView>
        </View>
    );
};

const BuyerSearchScreen = () => {
    const [query, setQuery] = useState('');

    return (
        <View style={styles.safeArea}>
            <Header title="Search" role="buyer" />
            <View style={styles.searchHeader}>
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={20} color="#666" style={{ marginRight: 8 }} />
                    <TextInput
                        placeholder="Search for products, brands..."
                        style={styles.searchInput}
                        value={query}
                        onChangeText={setQuery}
                        autoFocus
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery('')}>
                            <Ionicons name="close-circle" size={18} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.trendingContainer}>
                <Text style={styles.trendingTitle}>Trending Searches</Text>
                <View style={styles.trendingTags}>
                    {['Headphones', 'Textbooks', 'Lab Coat', 'Calculator', 'Laptop Stand'].map((tag, index) => (
                        <TouchableOpacity key={index} style={styles.tag}>
                            <Ionicons name="trending-up" size={14} color="#666" style={{ marginRight: 4 }} />
                            <Text style={styles.tagText}>{tag}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={[styles.trendingTitle, { marginTop: 24 }]}>Recent Searches</Text>
                <TouchableOpacity style={styles.recentRow}>
                    <Ionicons name="time-outline" size={20} color="#999" />
                    <Text style={styles.recentText}>Engineering Drawing Kit</Text>
                    <Ionicons name="arrow-forward-outline" size={16} color="#CCC" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.recentRow}>
                    <Ionicons name="time-outline" size={20} color="#999" />
                    <Text style={styles.recentText}>Scientific Calculator</Text>
                    <Ionicons name="arrow-forward-outline" size={16} color="#CCC" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const BuyerOrdersScreen = () => null;
const BuyerProfileScreen = () => null;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    // bgHeader removed
    // topHeader removed
    // locationContainer & sub-styles removed as they are now in Header component
    scrollContent: {
        paddingTop: 16,
    },
    scrollContent: {
        paddingTop: 10,
    },
    carouselList: {
        marginBottom: 24,
    },
    bannerContainer: {
        width: width, // Full width for paging
        height: 200, // Taller banner
        paddingHorizontal: 16, // Padding inside the container so the banner card has space
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },
    // We need to wrap image and overlay in a container that has the border radius
    bannerInner: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
    },
    bannerOverlay: {
        position: 'absolute',
        top: 0,
        left: 16, // Account for padding
        right: 16,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 16,
        justifyContent: 'center',
        paddingHorizontal: 24,
        alignItems: 'flex-start',
    },
    bannerTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFF',
        marginBottom: 8,
    },
    bannerSubtitle: {
        fontSize: 18,
        color: '#EEE',
        marginBottom: 20,
        fontWeight: '500',
    },
    bannerButton: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
    },
    bannerButtonText: {
        color: '#333',
        fontSize: 14,
        fontWeight: 'bold',
    },
    categoryHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 16,
        marginBottom: 12,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    categoryRefreshed: {
        width: (width - 64) / 4, // 4 items per row
        alignItems: 'center',
        marginBottom: 16,
    },
    categoryIconBg: {
        width: 60,
        height: 60,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    categoryIcon: {
        width: 32,
        height: 32,
        resizeMode: 'contain',
    },
    categoryLabel: {
        fontSize: 12,
        color: '#555',
        textAlign: 'center',
        fontWeight: '500',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
    },
    sectionSubtitle: {
        fontSize: 12,
        color: '#888',
    },
    seeAll: {
        fontSize: 14,
        color: '#2196F3',
        fontWeight: '600',
    },
    horizontalList: {
        marginBottom: 24,
    },
    verticalGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 8, // 8px gap between cards
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    // Search Screen Styles
    searchHeader: {
        padding: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    trendingContainer: {
        padding: 20,
    },
    trendingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    trendingTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F4F8',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E1E8ED',
    },
    tagText: {
        fontSize: 14,
        color: '#555',
        fontWeight: '500',
    },
    recentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F9F9F9',
    },
    recentText: {
        flex: 1,
        fontSize: 16,
        color: '#555',
        marginLeft: 12,
    },
    // Orders Screen Styles
    screenHeader: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: '#FFF',
    },
    screenTitle: {
        fontSize: 28,
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
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F0F0F0',
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
    },
    orderDate: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    orderDivider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: 12,
    },
    orderItems: {
        fontSize: 14,
        color: '#555',
        marginBottom: 16,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    viewDetailsButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
    },
    viewDetailsText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },

    // Profile Screen Styles
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFF',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 16,
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    roleBadge: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    roleText: {
        color: '#2196F3',
        fontSize: 12,
        fontWeight: '600',
    },
    editButton: {
        padding: 8,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
    },
    menuContainer: {
        paddingHorizontal: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F5F5F5',
    },
    menuIconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    menuSubtitle: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16,
        marginTop: 24,
        padding: 16,
        backgroundColor: '#FFEBEE',
        borderRadius: 16,
    },
    logoutText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF5252',
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#CCC',
        marginTop: 24,
        marginBottom: 40,
    },
});

export { BuyerHomeScreen, BuyerSearchScreen, BuyerOrdersScreen, BuyerProfileScreen };
