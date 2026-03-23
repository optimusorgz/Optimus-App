import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';

const SellerProfileScreen = ({ navigation }) => {
    const sellerInfo = {
        name: 'Tech Store India',
        email: 'contact@techstore.com',
        phone: '+91 98765 43210',
        address: 'MG Road, Bangalore, Karnataka 560001',
        gst: 'GST123456789',
        rating: 4.5,
        totalSales: 1250,
    };

    const ProfileOption = ({ icon, title, subtitle, onPress, showBadge, badgeColor }) => (
        <TouchableOpacity style={styles.optionCard} onPress={onPress}>
            <View style={[styles.optionIcon, { backgroundColor: badgeColor + '20' }]}>
                <Ionicons name={icon} size={24} color={badgeColor} />
            </View>
            <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{title}</Text>
                {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Header title="Seller Profile" role="seller" />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Ionicons name="storefront" size={40} color="#4CAF50" />
                        </View>
                        <TouchableOpacity style={styles.editAvatarButton}>
                            <Ionicons name="camera" size={16} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.profileName}>{sellerInfo.name}</Text>
                    <Text style={styles.profileEmail}>{sellerInfo.email}</Text>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <View style={styles.ratingBadge}>
                                <Ionicons name="star" size={16} color="#FFD700" />
                                <Text style={styles.ratingText}>{sellerInfo.rating}</Text>
                            </View>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{sellerInfo.totalSales}</Text>
                            <Text style={styles.statLabel}>Total Sales</Text>
                        </View>
                    </View>
                </View>

                {/* Business Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Business Information</Text>
                    <ProfileOption
                        icon="business-outline"
                        title="Company Details"
                        subtitle="Update business information"
                        badgeColor="#2196F3"
                        onPress={() => navigation.navigate('CompanyDetails')}
                    />
                    <ProfileOption
                        icon="document-text-outline"
                        title="GST Details"
                        subtitle={sellerInfo.gst}
                        badgeColor="#9C27B0"
                        onPress={() => navigation.navigate('GSTDetails')}
                    />
                    <ProfileOption
                        icon="card-outline"
                        title="Bank Account"
                        subtitle="Manage payment details"
                        badgeColor="#4CAF50"
                        onPress={() => navigation.navigate('BankDetails')}
                    />
                </View>

                {/* Store Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Store Settings</Text>
                    <ProfileOption
                        icon="location-outline"
                        title="Pickup Address"
                        subtitle={sellerInfo.address}
                        badgeColor="#FF9800"
                        onPress={() => navigation.navigate('PickupAddress')}
                    />
                    <ProfileOption
                        icon="time-outline"
                        title="Business Hours"
                        subtitle="Set your availability"
                        badgeColor="#00BCD4"
                        onPress={() => navigation.navigate('BusinessHours')}
                    />
                    <ProfileOption
                        icon="pricetag-outline"
                        title="Shipping Settings"
                        subtitle="Configure shipping options"
                        badgeColor="#FF5722"
                        onPress={() => navigation.navigate('ShippingSettings')}
                    />
                </View>

                {/* Account Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                    <ProfileOption
                        icon="notifications-outline"
                        title="Notifications"
                        subtitle="Manage notification preferences"
                        badgeColor="#2196F3"
                        onPress={() => navigation.navigate('SellerNotifications')}
                    />
                    <ProfileOption
                        icon="lock-closed-outline"
                        title="Privacy & Security"
                        subtitle="Password, 2FA settings"
                        badgeColor="#9C27B0"
                        onPress={() => navigation.navigate('SellerSecurity')}
                    />
                    <ProfileOption
                        icon="help-circle-outline"
                        title="Help & Support"
                        subtitle="FAQs, contact support"
                        badgeColor="#FF9800"
                        onPress={() => navigation.navigate('SellerSupport')}
                    />
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={20} color="#F44336" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    profileHeader: {
        backgroundColor: '#FFF',
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#4CAF50',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        width: '100%',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#E0E0E0',
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 8,
        gap: 4,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    section: {
        backgroundColor: '#FFF',
        paddingVertical: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    optionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    optionSubtitle: {
        fontSize: 13,
        color: '#666',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        marginTop: 8,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F44336',
        gap: 8,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#F44336',
    },
});

export default SellerProfileScreen;
