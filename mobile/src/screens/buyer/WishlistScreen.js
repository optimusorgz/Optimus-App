import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';

const { width } = Dimensions.get('window');

const WishlistScreen = () => {
    const navigation = useNavigation();

    // Mock Wishlist Data
    const wishlistItems = [
        {
            id: '1',
            title: 'Wireless Noise Cancelling Headphones',
            category: 'Electronics',
            rating: 4.5,
            price: 2499,
            originalPrice: 2999,
            discount: 15,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80',
            inStock: true,
            seller: 'TechStore India',
        },
        {
            id: '2',
            title: 'Smart Watch Series 7',
            category: 'Wearables',
            rating: 4.8,
            price: 15999,
            image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&q=80',
            inStock: false,
            seller: 'Gadget World',
        },
    ];

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
        >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                    <TouchableOpacity style={styles.deleteButton}>
                        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.cardPrice}>₹{item.price.toLocaleString()}</Text>

                <View style={styles.cardFooter}>
                    <View style={[styles.stockBadge, item.inStock ? styles.inStockBadge : styles.outStockBadge]}>
                        <Text style={[styles.stockText, item.inStock ? styles.inStockText : styles.outStockText]}>
                            {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </Text>
                    </View>

                    {item.inStock && (
                        <TouchableOpacity style={styles.addToCartButton}>
                            <Ionicons name="cart" size={16} color="#FFF" style={{ marginRight: 4 }} />
                            <Text style={styles.addToCartText}>Add</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Header title="My Wishlist" role="buyer" onBack={() => navigation.goBack()} />
            {wishlistItems.length > 0 ? (
                <FlatList
                    data={wishlistItems}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="heart-dislike-outline" size={64} color="#2196F3" />
                    </View>
                    <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
                    <Text style={styles.emptySubtitle}>Explore our collections and add items you love!</Text>
                    <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('Home')}>
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
