import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { productService, wishlistService } from '../../api/services';

const { width } = Dimensions.get('window');

const ProductDetailsScreen = ({ route, navigation }) => {
    const { product: initialProduct } = route.params;
    const [product, setProduct] = useState(initialProduct);
    const [reviews, setReviews] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [isInCart, setIsInCart] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart, getCartCount, cartItems } = useCart();

    const toastAnim = useRef(new Animated.Value(-100)).current;
    const checkAnim = useRef(new Animated.Value(0)).current;
    const cartCount = getCartCount();

    useEffect(() => {
        loadProductData();
    }, []);

    useEffect(() => {
        const inCart = cartItems.some(item => item.id === product.id);
        setIsInCart(inCart);
    }, [cartItems, product.id]);

    const loadProductData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch full product details
            const productData = await productService.getProductById(initialProduct.id);
            setProduct(productData.product);
            setReviews(productData.product.reviews || []);

            // Check if in wishlist
            const wishlistStatus = await wishlistService.isInWishlist(initialProduct.id);
            setIsInWishlist(wishlistStatus.inWishlist);
        } catch (err) {
            console.error('Error loading product:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleAddToCart = () => {
        if (isInCart) {
            navigation.navigate('BuyerHome', { screen: 'Cart' });
            return;
        }

        addToCart(product, quantity);
        setIsInCart(true);
        setShowToast(true);

        Animated.parallel([
            Animated.spring(toastAnim, {
                toValue: 0,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.sequence([
                Animated.timing(checkAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        setTimeout(() => {
            Animated.timing(toastAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setShowToast(false);
                checkAnim.setValue(0);
                toastAnim.setValue(-100);
            });
        }, 2000);
    };

    const handleBuyNow = () => {
        addToCart(product, quantity);
        navigation.navigate('Checkout');
    };

    const toggleWishlist = async () => {
        try {
            if (isInWishlist) {
                await wishlistService.removeFromWishlist(product.id);
            } else {
                await wishlistService.addToWishlist(product.id);
            }
            setIsInWishlist(!isInWishlist);
        } catch (err) {
            console.error('Error updating wishlist:', err);
        }
    };

    const images = [product.image_url, product.image_url, product.image_url];

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2196F3" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="share-social-outline" size={24} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Cart')}>
                        <Ionicons name="cart-outline" size={24} color="#333" />
                        {cartCount > 0 && (
                            <View style={styles.cartBadge}>
                                <Text style={styles.cartBadgeText}>{cartCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image Carousel */}
                <View style={styles.imageSection}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={(e) => {
                            const index = Math.round(e.nativeEvent.contentOffset.x / width);
                            setSelectedImage(index);
                        }}
                    >
                        {images.map((img, index) => (
                            <Image key={index} source={{ uri: img }} style={styles.carouselImage} resizeMode="contain" />
                        ))}
                    </ScrollView>

                    {/* Image Indicators */}
                    <View style={styles.indicators}>
                        {images.map((_, index) => (
                            <View
                                key={index}
                                style={[styles.indicator, selectedImage === index && styles.activeIndicator]}
                            />
                        ))}
                    </View>

                    {/* Wishlist & Discount Badge */}
                    <TouchableOpacity style={styles.wishlistButton} onPress={toggleWishlist}>
                        <Ionicons name={isInWishlist ? "heart" : "heart-outline"} size={24} color={isInWishlist ? "#FF3B30" : "#FF3B30"} />
                    </TouchableOpacity>
                    {product.discount_percentage && product.discount_percentage > 0 && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{Math.round(product.discount_percentage)}% OFF</Text>
                        </View>
                    )}
                </View>

                {/* Product Info */}
                <View style={styles.infoSection}>
                    {/* Brand/Seller */}
                    {product.seller_name && (
                        <Text style={styles.brand}>{product.seller_name}</Text>
                    )}

                    {/* Title */}
                    <Text style={styles.title}>{product.title}</Text>

                    {/* Rating & Reviews */}
                    <View style={styles.ratingRow}>
                        {product.rating && (
                            <>
                                <View style={styles.ratingBadge}>
                                    <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
                                    <Ionicons name="star" size={12} color="#FFF" />
                                </View>
                                <Text style={styles.reviewCount}>{reviews.length} Reviews</Text>
                            </>
                        )}
                    </View>

                    {/* Price Section */}
                    <View style={styles.priceSection}>
                        <Text style={styles.price}>₹{product.price}</Text>
                        {product.original_price && (
                            <>
                                <Text style={styles.originalPrice}>₹{product.original_price}</Text>
                                <Text style={styles.savings}>Save ₹{(product.original_price - product.price).toFixed(2)}</Text>
                            </>
                        )}
                    </View>

                    {/* Offers */}
                    <View style={styles.offersSection}>
                        <Text style={styles.sectionTitle}>Available Offers</Text>
                        <View style={styles.offerCard}>
                            <Ionicons name="pricetag" size={16} color="#4CAF50" />
                            <Text style={styles.offerText}>Special Price: Get exclusive deals</Text>
                        </View>
                        <View style={styles.offerCard}>
                            <Ionicons name="pricetag" size={16} color="#4CAF50" />
                            <Text style={styles.offerText}>Free Shipping on orders above ₹500</Text>
                        </View>
                    </View>

                    {/* Delivery Info */}
                    <View style={styles.deliverySection}>
                        <View style={styles.deliveryInfo}>
                            <Ionicons name="bicycle" size={24} color="#4CAF50" />
                            <View style={styles.deliveryText}>
                                <Text style={styles.deliveryTitle}>Get it by Tomorrow</Text>
                                <Text style={styles.deliverySubtitle}>Free delivery on orders above ₹499</Text>
                            </View>
                        </View>
                    </View>

                    {/* Product Details */}
                    <View style={styles.detailsSection}>
                        <Text style={styles.sectionTitle}>Product Details</Text>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Category</Text>
                            <Text style={styles.detailValue}>{product.category_name || 'N/A'}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Brand</Text>
                            <Text style={styles.detailValue}>{product.seller_name || 'Generic'}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>In Stock</Text>
                            <Text style={[styles.detailValue, { color: product.stock_quantity > 0 ? '#4CAF50' : '#FF3B30' }]}>
                                {product.stock_quantity > 0 ? 'Available' : 'Out of Stock'}
                            </Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.descriptionSection}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>
                            {product.description || `Premium quality ${product.title.toLowerCase()} designed for everyday use. Excellent build quality, modern design, and outstanding performance. Perfect for students and professionals alike.`}
                        </Text>
                    </View>

                    {/* Reviews */}
                    {reviews.length > 0 && (
                        <View style={styles.reviewsSection}>
                            <View style={styles.reviewsHeader}>
                                <Text style={styles.sectionTitle}>Ratings & Reviews</Text>
                            </View>

                            {reviews.slice(0, 3).map(review => (
                                <View key={review.id} style={styles.reviewCard}>
                                    <View style={styles.reviewHeader}>
                                        <View style={styles.reviewRating}>
                                            <Text style={styles.reviewRatingText}>{review.rating}</Text>
                                            <Ionicons name="star" size={10} color="#FFF" />
                                        </View>
                                        <Text style={styles.reviewUser}>{review.user_name || 'Anonymous'}</Text>
                                        <Text style={styles.reviewDate}>{new Date(review.created_at).toLocaleDateString()}</Text>
                                    </View>
                                    <Text style={styles.reviewComment}>{review.comment}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>Error loading reviews: {error}</Text>
                        </View>
                    )}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Animated Toast Notification */}
            {showToast && (
                <Animated.View
                    style={[
                        styles.toastContainer,
                        {
                            transform: [{ translateY: toastAnim }],
                        },
                    ]}
                >
                    <Animated.View
                        style={[
                            styles.checkmarkCircle,
                            {
                                transform: [
                                    {
                                        scale: checkAnim.interpolate({
                                            inputRange: [0, 0.5, 1],
                                            outputRange: [0, 1.2, 1],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <Ionicons name="checkmark" size={24} color="#FFF" />
                    </Animated.View>
                    <View style={styles.toastContent}>
                        <Text style={styles.toastTitle}>Added to Cart!</Text>
                        <Text style={styles.toastMessage}>{quantity} item{quantity > 1 ? 's' : ''} added</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                        <Text style={styles.toastLink}>View Cart</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}

            {/* Bottom Action Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.quantityControl}>
                    <TouchableOpacity onPress={decrementQuantity} style={styles.qtyButton}>
                        <Ionicons name="remove" size={20} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{quantity}</Text>
                    <TouchableOpacity onPress={incrementQuantity} style={styles.qtyButton}>
                        <Ionicons name="add" size={20} color="#333" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart} disabled={product.stock_quantity === 0}>
                    <Ionicons name={isInCart ? "cart" : "cart-outline"} size={20} color="#FFF" />
                    <Text style={styles.addToCartText}>
                        {product.stock_quantity === 0 ? "Out of Stock" : (isInCart ? "Go to Cart" : "Add to Cart")}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow} disabled={product.stock_quantity === 0}>
                    <Ionicons name="flash" size={20} color="#FFF" />
                    <Text style={styles.buyNowText}>Buy Now</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerButton: {
        padding: 4,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 16,
    },
    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    cartBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    imageSection: {
        height: 400,
        backgroundColor: '#F5F5F5',
        position: 'relative',
    },
    carouselImage: {
        width: width,
        height: 400,
    },
    indicators: {
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#CCC',
    },
    activeIndicator: {
        backgroundColor: '#2196F3',
        width: 24,
    },
    wishlistButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    discountBadge: {
        position: 'absolute',
        top: 16,
        left: 16,
        backgroundColor: '#FF3B30',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    discountText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    infoSection: {
        padding: 16,
    },
    brand: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        lineHeight: 28,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 8,
    },
    ratingText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 2,
    },
    reviewCount: {
        fontSize: 12,
        color: '#666',
    },
    priceSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 12,
    },
    originalPrice: {
        fontSize: 16,
        color: '#999',
        textDecorationLine: 'line-through',
        marginRight: 8,
    },
    savings: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '600',
    },
    offersSection: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    offerCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#F0F8F0',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    offerText: {
        fontSize: 13,
        color: '#333',
        marginLeft: 8,
        flex: 1,
    },
    deliverySection: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    deliveryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F8F0',
        padding: 12,
        borderRadius: 8,
    },
    deliveryText: {
        marginLeft: 12,
        flex: 1,
    },
    deliveryTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    deliverySubtitle: {
        fontSize: 12,
        color: '#666',
    },
    detailsSection: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    descriptionSection: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
    },
    reviewsSection: {
        marginBottom: 16,
    },
    reviewsHeader: {
        marginBottom: 12,
    },
    reviewCard: {
        backgroundColor: '#F8F9FA',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewRating: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
        marginRight: 8,
    },
    reviewRatingText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
        marginRight: 2,
    },
    reviewUser: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    reviewDate: {
        fontSize: 11,
        color: '#999',
    },
    reviewComment: {
        fontSize: 13,
        color: '#666',
        lineHeight: 20,
    },
    toastContainer: {
        position: 'absolute',
        bottom: 20,
        left: 16,
        right: 16,
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    checkmarkCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#45a049',
        justifyContent: 'center',
        alignItems: 'center',
    },
    toastContent: {
        flex: 1,
    },
    toastTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
    },
    toastMessage: {
        fontSize: 12,
        color: '#FFF',
        marginTop: 2,
    },
    toastLink: {
        fontSize: 12,
        color: '#FFF',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    bottomBar: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        gap: 8,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    qtyButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 12,
        minWidth: 24,
        textAlign: 'center',
    },
    addToCartButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FF9800',
        borderRadius: 8,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addToCartText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: 6,
    },
    buyNowButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#2196F3',
        borderRadius: 8,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buyNowText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: 6,
    },
    errorContainer: {
        backgroundColor: '#FFEBEE',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    errorText: {
        color: '#C62828',
        fontSize: 13,
    },
});

export default ProductDetailsScreen;
