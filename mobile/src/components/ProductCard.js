import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = (width - 40) / 2; // 2 columns with 16px padding on sides and 8px gap between cards
const horizontalCardWidth = 160; // Fixed width for horizontal scroll

const ProductCard = ({ product, onPress, style, horizontal = false }) => {
    const finalCardWidth = horizontal ? horizontalCardWidth : cardWidth;

    return (
        <TouchableOpacity
            style={[
                styles.card,
                { width: finalCardWidth },
                horizontal && styles.horizontalCard,
                style
            ]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={[styles.imageContainer, { height: finalCardWidth * 1.2 }]}>
                <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
                {product.discount && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{product.discount}% OFF</Text>
                    </View>
                )}
                <TouchableOpacity style={styles.wishlistButton}>
                    <Ionicons name="heart-outline" size={20} color="#333" />
                </TouchableOpacity>
            </View>
            <View style={styles.details}>
                <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
                {product.seller && (
                    <Text style={styles.seller} numberOfLines={1}>{product.seller}</Text>
                )}
                <View style={styles.priceRow}>
                    <Text style={styles.price}>₹{product.price}</Text>
                    {product.originalPrice && (
                        <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    horizontalCard: {
        marginRight: 12,
        marginBottom: 0,
    },
    imageContainer: {
        width: '100%',
        backgroundColor: '#F5F5F5',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    discountBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#FF3B30',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    discountText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    wishlistButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 32,
        height: 32,
        backgroundColor: '#FFF',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    details: {
        padding: 12,
    },
    title: {
        fontSize: 13,
        color: '#333',
        fontWeight: '500',
        marginBottom: 4,
        lineHeight: 18,
    },
    seller: {
        fontSize: 11,
        color: '#999',
        marginBottom: 6,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginRight: 8,
    },
    originalPrice: {
        fontSize: 12,
        color: '#999',
        textDecorationLine: 'line-through',
    },
});

export default ProductCard;
