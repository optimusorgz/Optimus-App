import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const OrderSuccessScreen = ({ route }) => {
    const navigation = useNavigation();
    const { orderTotal, orderId = 'ORD' + Date.now() } = route.params || {};

    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animate checkmark
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            {/* Success Animation */}
            <View style={styles.animationContainer}>
                <Animated.View
                    style={[
                        styles.checkmarkCircle,
                        {
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <Ionicons name="checkmark" size={80} color="#FFF" />
                </Animated.View>
            </View>

            {/* Success Message */}
            <Animated.View style={[styles.messageContainer, { opacity: fadeAnim }]}>
                <Text style={styles.successTitle}>Order Placed Successfully!</Text>
                <Text style={styles.successSubtitle}>
                    Thank you for your order
                </Text>
            </Animated.View>

            {/* Order Details */}
            <Animated.View style={[styles.detailsCard, { opacity: fadeAnim }]}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Order ID</Text>
                    <Text style={styles.detailValue}>{orderId}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total Amount</Text>
                    <Text style={styles.detailValue}>₹{orderTotal?.toFixed(2) || '0.00'}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.deliveryInfo}>
                    <Ionicons name="bicycle" size={24} color="#4CAF50" />
                    <View style={styles.deliveryText}>
                        <Text style={styles.deliveryTitle}>Expected Delivery</Text>
                        <Text style={styles.deliveryTime}>Within 15-30 minutes</Text>
                    </View>
                </View>
            </Animated.View>

            {/* Action Buttons */}
            <Animated.View style={[styles.buttonsContainer, { opacity: fadeAnim }]}>
                <TouchableOpacity
                    style={styles.trackButton}
                    onPress={() => navigation.navigate('BuyerHome', { screen: 'Orders' })}
                >
                    <Ionicons name="location-outline" size={20} color="#FFF" />
                    <Text style={styles.trackButtonText}>Track Order</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={() => navigation.navigate('BuyerHome', { screen: 'Home' })}
                >
                    <Text style={styles.continueButtonText}>Continue Shopping</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Confetti Effect (Optional) */}
            <View style={styles.confettiContainer}>
                {[...Array(20)].map((_, i) => (
                    <Animated.View
                        key={i}
                        style={[
                            styles.confetti,
                            {
                                left: `${Math.random() * 100}%`,
                                backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'][i % 5],
                                transform: [
                                    {
                                        translateY: fadeAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [-100, 600],
                                        }),
                                    },
                                    {
                                        rotate: fadeAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0deg', `${360 * (i % 2 === 0 ? 1 : -1)}deg`],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    animationContainer: {
        marginBottom: 32,
    },
    checkmarkCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    messageContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    successTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    successSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    detailsCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
    },
    detailValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    deliveryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 12,
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
    deliveryTime: {
        fontSize: 13,
        color: '#4CAF50',
        fontWeight: '500',
    },
    buttonsContainer: {
        width: '100%',
    },
    trackButton: {
        flexDirection: 'row',
        backgroundColor: '#2196F3',
        borderRadius: 12,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    trackButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: 8,
    },
    continueButton: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#2196F3',
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    confettiContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
    },
    confetti: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 5,
    },
});

export default OrderSuccessScreen;
