import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, TextInput, Dimensions, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../../components/ProductCard';
import Header from '../../components/Header';
import { categoryService, productService } from '../../api/services';

const { width } = Dimensions.get('window');

// Promotional Banners (Can be fetched from API later)
const BANNERS = [
    { id: '1', title: '50% OFF', subtitle: 'On Rental Equipment', image: 'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=800&q=80' },
    { id: '2', title: 'Student', subtitle: 'Essentials Kit', image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&q=80' },
    { id: '3', title: 'New Arrivals', subtitle: 'Trendy Fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80' },
];

const CategoryGridItem = ({ item, onPress }) => (
    <TouchableOpacity style={styles.categoryRefreshed} onPress={onPress}>
        <View style={styles.categoryIconBg}>
            <Image source={{ uri: item.icon_url }} style={styles.categoryIcon} />
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
            getItemLayout={(data, index) => (
                { length: width, offset: width * index, index }
            )}
        />
    );
};

const BuyerHomeScreen = ({ navigation }) => {
    const [categories, setCategories] = useState([]);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch categories
            const categoriesData = await categoryService.getCategories();
            setCategories(categoriesData.categories || []);

            // Fetch all products
            const productsData = await productService.getProducts({ limit: 20 });
            setRecommendedProducts(productsData.products?.slice(0, 6) || []);
            setAllProducts(productsData.products || []);
        } catch (err) {
            console.error('Error loading data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.safeArea, styles.centered]}>
                <ActivityIndicator size="large" color="#2196F3" />
            </View>
        );
    }

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
                {categories.length > 0 && (
                    <View style={{ marginBottom: 20 }}>
                        <Text style={styles.categoryHeader}>Shop by Category</Text>
                        <View style={styles.gridContainer}>
                            {categories.map((cat) => (
                                <CategoryGridItem
                                    key={cat.id}
                                    item={cat}
                                    onPress={() => navigation.navigate('Category', { category: cat })}
                                />
                            ))}
                        </View>
                    </View>
                )}

                {/* Recommended Section (Horizontal) */}
                {recommendedProducts.length > 0 && (
                    <View style={{ marginBottom: 20 }}>
                        <SectionHeader 
                            title="Recommended for You" 
                            subtitle="Based on your history"
                            onSeeAll={() => {}}
                        />
                        <FlatList
                            data={recommendedProducts}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={item => item.id.toString()}
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
                )}

                {/* All Products (Vertical) */}
                {allProducts.length > 0 && (
                    <View style={{ marginBottom: 20 }}>
                        <SectionHeader title="All Products" onSeeAll={() => {}} />
                        <View style={styles.verticalGrid}>
                            {allProducts.map(item => (
                                <ProductCard
                                    key={'vert-' + item.id}
                                    product={item}
                                    style={{ width: (width - 48) / 2, marginBottom: 16 }}
                                    onPress={() => navigation.navigate('ProductDetails', { product: item })}
                                />
                            ))}
                        </View>
                    </View>
                )}

                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Error loading products</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
                            <Text style={styles.retryButtonText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={{ height: 80 }} />
            </ScrollView>
        </View>
    );
};

const BuyerSearchScreen = ({ navigation }) => {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);

    const handleSearch = async (text) => {
        setQuery(text);
        if (text.length > 2) {
            try {
                setSearching(true);
                const results = await productService.searchProducts(text);
                setSearchResults(results.products || []);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setSearching(false);
            }
        } else {
            setSearchResults([]);
        }
    };

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
                        onChangeText={handleSearch}
                        autoFocus
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => { setQuery(''); setSearchResults([]); }}>
                            <Ionicons name="close-circle" size={18} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {searching ? (
                <View style={[styles.centered, { flex: 1 }]}>
                    <ActivityIndicator size="large" color="#2196F3" />
                </View>
            ) : searchResults.length > 0 ? (
                <FlatList
                    data={searchResults}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.searchResultItem}
                            onPress={() => navigation.navigate('ProductDetails', { product: item })}
                        >
                            <Image source={{ uri: item.image_url }} style={styles.searchResultImage} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.searchResultTitle} numberOfLines={2}>{item.title}</Text>
                                <Text style={styles.searchResultPrice}>₹ {item.price}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.searchResultsList}
                />
            ) : query.length === 0 ? (
                <View style={styles.trendingContainer}>
                    <Text style={styles.trendingTitle}>Trending Searches</Text>
                    <View style={styles.trendingTags}>
                        {['Headphones', 'Textbooks', 'Lab Coat', 'Calculator', 'Laptop Stand'].map((tag, index) => (
                            <TouchableOpacity key={index} style={styles.tag} onPress={() => handleSearch(tag)}>
                                <Ionicons name="trending-up" size={14} color="#666" style={{ marginRight: 4 }} />
                                <Text style={styles.tagText}>{tag}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            ) : (
                <View style={[styles.centered, { flex: 1 }]}>
                    <Text style={styles.noResultsText}>No products found</Text>
                </View>
            )}
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
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingTop: 10,
    },
    carouselList: {
        marginBottom: 24,
    },
    bannerContainer: {
        width: width,
        height: 200,
        paddingHorizontal: 16,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },
    bannerOverlay: {
        position: 'absolute',
        top: 0,
        left: 16,
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
        width: (width - 64) / 4,
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
        gap: 8,
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    retryButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFF',
        fontWeight: '600',
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
    searchResultsList: {
        padding: 16,
    },
    searchResultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    searchResultImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    searchResultTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    searchResultPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    noResultsText: {
        fontSize: 16,
        color: '#999',
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
});

export { BuyerHomeScreen, BuyerSearchScreen, BuyerOrdersScreen, BuyerProfileScreen };
