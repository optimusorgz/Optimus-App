import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../context/CartContext';
import Header from '../../components/Header';

const CartScreen = () => {
    const navigation = useNavigation();
    const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image source={{ uri: item.image_url }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
                {item.seller_name && <Text style={styles.itemSeller}>{item.seller_name}</Text>}
                <Text style={styles.itemPrice}>₹{item.price}</Text>
            </View>
            <View style={styles.itemActions}>
                <View style={styles.quantityControl}>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                        <Ionicons name="remove" size={16} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                        <Ionicons name="add" size={16} color="#333" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeFromCart(item.id)}
                >
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderEmptyCart = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={80} color="#CCC" />
            <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
            <Text style={styles.emptySubtitle}>Add items to get started</Text>
            <TouchableOpacity
                style={styles.shopButton}
                onPress={() => navigation.navigate('BuyerHome')}
            >
                <Text style={styles.shopButtonText}>Start Shopping</Text>
            </TouchableOpacity>
        </View>
    );

    if (cartItems.length === 0) {
        return (
            <View style={styles.container}>
                <Header title="Cart" role="buyer" />
                {renderEmptyCart()}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header title="Cart" role="buyer" />
            <FlatList
                data={cartItems}
                keyExtractor={item => item.id}
                renderItem={renderCartItem}
                contentContainerStyle={styles.listContent}
            />
            <View style={styles.footer}>
                <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                    <Text style={styles.totalAmount}>₹{getCartTotal().toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                    style={styles.checkoutButton}
                    onPress={() => navigation.navigate('Checkout')}
                >
                    <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
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
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    itemSeller: {
        fontSize: 11,
        color: '#999',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    itemActions: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 4,
    },
    quantityButton: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 6,
    },
    quantity: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 12,
        minWidth: 20,
        textAlign: 'center',
    },
    deleteButton: {
        padding: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#999',
        marginBottom: 24,
    },
    shopButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
    },
    shopButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    footer: {
        backgroundColor: '#FFF',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    totalSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 16,
        color: '#666',
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    checkoutButton: {
        flexDirection: 'row',
        backgroundColor: '#2196F3',
        borderRadius: 12,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkoutButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginRight: 8,
    },
});

export default CartScreen;
