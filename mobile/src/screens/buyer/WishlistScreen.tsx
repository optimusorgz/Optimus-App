import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import { wishlistService, productService } from '../../api/services';

const { width } = Dimensions.get('window');

const WishlistScreen = () => {
    const navigation = useNavigation();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        try {
            setLoading(true);
            setError(null);
            const items = await wishlistService.getWishlist();
            setWishlistItems(items);
        } catch (err) {
            console.error('Error loading wishlist:', err);
            setError(err.message || 'Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const items = await wishlistService.getWishlist();
            setWishlistItems(items);
        } catch (err) {
            console.error('Error refreshing wishlist:', err);
        } finally {
            setRefreshing(false);
        }
    };

    const handleRemoveFromWishlist = async (productId) => {
        try {
            await wishlistService.removeFromWishlist(productId);
            setWishlistItems(prev => prev.filter(item => item.id !== productId));
            Alert.alert('Success', 'Item removed from wishlist');
        } catch (err) {
            console.error('Error removing from wishlist:', err);
            Alert.alert('Error', 'Failed to remove item from wishlist');
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
        >
            <Image 
                source={{ uri: item.image_url || 'https://via.placeholder.com/100' }} 
                style={styles.cardImage}
                onError={(e) => console.log('Image loading error:', e)}
            />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                    <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={() => handleRemoveFromWishlist(item.id)}
                    >
                        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.cardPrice}>₹{item.price?.toLocaleString()}</Text>

                <View style={styles.cardFooter}>
                    <View style={[styles.stockBadge, item.stock_quantity > 0 ? styles.inStockBadge : styles.outStockBadge]}>
                        <Text style={[styles.stockText, item.stock_quantity > 0 ? styles.inStockText : styles.outStockText]}>
                            {item.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </Text>
                    </View>

                    {item.stock_quantity > 0 && (
                        <TouchableOpacity style={styles.addToCartButton} onPress={() => navigation.navigate('Cart')}>
                            <Ionicons name="cart" size={16} color="#FFF" style={{ marginRight: 4 }} />
                            <Text style={styles.addToCartText}>Add</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <Header title="My Wishlist" role="buyer" onBack={() => navigation.goBack()} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2196F3" />
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Header title="My Wishlist" role="buyer" onBack={() => navigation.goBack()} />
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color="#F44336" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={loadWishlist}>
                        <Text style={styles.retryBtnText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header title="My Wishlist" role="buyer" onBack={() => navigation.goBack()} />
            {wishlistItems.length > 0 ? (
                <FlatList
                    data={wishlistItems}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="heart-dislike-outline" size={64} color="#2196F3" />
                    </View>
                    <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
                    <Text style={styles.emptySubtitle}>Explore our collections and add items you love!</Text>
                    <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('BuyerHome')}>
                        <Text style={styles.shopButtonText}>Start Shopping</Text>
                    </TouchableOpacity>
                </View>
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
        backgroundColor: '#2196F3',
    },
    retryBtnText: {
        color: '#FFF',
        fontWeight: '600',
    },
    listContent: {
        padding: 16,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        alignItems: 'center',
    },
    cardImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
        backgroundColor: '#F0F0F0',
    },
    cardContent: {
        flex: 1,
        marginLeft: 16,
        height: 100,
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
        flex: 1,
        marginRight: 8,
        lineHeight: 20,
    },
    deleteButton: {
        padding: 4,
    },
    cardPrice: {
        fontSize: 18,
        fontWeight: '800',
        color: '#2196F3',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    stockBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    inStockBadge: {
        backgroundColor: '#E8F5E9',
    },
    outStockBadge: {
        backgroundColor: '#FFEBEE',
    },
    stockText: {
        fontSize: 11,
        fontWeight: '600',
    },
    inStockText: {
        color: '#2E7D32',
    },
    outStockText: {
        color: '#C62828',
    },
    addToCartButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2196F3',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        elevation: 2,
    },
    addToCartText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    // Empty State
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E3F2FD', // Light Blue circle
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 4,
        borderColor: '#FFF',
        elevation: 4,
        shadowColor: '#2196F3',
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 20,
    },
    shopButton: {
        backgroundColor: '#1A1A1A', // Dark button for premium feel
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 30,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    shopButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 0.5,
    },
});

export default WishlistScreen;
