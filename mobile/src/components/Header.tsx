
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Header = ({ title, role = 'buyer', type = 'default', onBack, rightActions }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.headerWrapper}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.contentContainer}>
                    <View style={styles.leftContainer}>
                        {/* Back Button */}
                        {onBack && (
                            <TouchableOpacity onPress={onBack} style={styles.backButton}>
                                <Ionicons name="arrow-back" size={24} color="#333" />
                            </TouchableOpacity>
                        )}

                        {/* Title or Home Header */}
                        {role === 'buyer' && type === 'home' ? (
                            <View>
                                <Text style={styles.appName}>Optimus</Text>
                                <View style={styles.addressRow}>
                                    <Ionicons name="location-sharp" size={12} color="#666" style={{ marginRight: 2 }} />
                                    <Text style={styles.addressText}>Home - 123, Campus St</Text>
                                    <Ionicons name="chevron-down" size={12} color="#666" style={{ marginLeft: 2 }} />
                                </View>
                            </View>
                        ) : (
                            <Text style={styles.title} numberOfLines={1}>{title}</Text>
                        )}
                    </View>

                    {/* Right Section */}
                    <View style={styles.rightSection}>
                        {rightActions ? rightActions : (
                            type === 'home' && (
                                <TouchableOpacity
                                    style={styles.iconButton}
                                    onPress={() => navigation.navigate('Wishlist')}
                                >
                                    <Ionicons name="heart-outline" size={24} color="#333" />
                                </TouchableOpacity>
                            )
                        )}
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    headerWrapper: {
        backgroundColor: '#F7F7F7', // Off-white background
        // Shadow/Elevation
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        // Removed manual paddingTop as SafeAreaView handles it
    },
    safeArea: {
        backgroundColor: '#F7F7F7', // Off-white
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Ensures Left and Right are pushed apart
        minHeight: Platform.OS === 'android' ? 40 : 30, // Minimum height
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 16,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: 4,
    },
    backButton: {
        marginRight: 12,
        padding: 4,
    },
    title: {
        fontSize: 20, // Slightly smaller for long category names
        fontWeight: '700', // Bold
        color: '#333',
        letterSpacing: 0.3,
        flex: 1,
    },
    appName: {
        fontSize: 24, // Increased size
        fontWeight: '900', // Extra bold
        color: '#2196F3', // Brand color
        letterSpacing: 0.5,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    addressText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
});

export default Header;
