
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Header from '../../components/Header';

const BuyerProfileScreen = ({ navigation }) => {
    return (
        <View style={styles.safeArea}>
            <Header title="Profile" role="buyer" />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Premium Profile Header content starts here... (Note: user said "remove profile icon from HEADER", not from the profile page content itself, confusing? 
                "remove profile icon from hrader". "header".
                I assume they mean the small circular icon in the top right of the HOME header.
                The Profile Screen (this one) shows the user's large avatar. That should stay.
                The *top bar* (Screen Header) has "Profile" text.
                My new Header component does this validation.
                */}
                <View style={styles.profileHeaderContainer}>
                    <View style={styles.profileRow}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&q=80' }}
                            style={styles.largeAvatar}
                        />
                        <View>
                            <Text style={styles.profileName}>Kaushik Ranjan</Text>
                            <Text style={styles.profileEmail}>Buyer Account</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.profileEditIcon}
                        onPress={() => navigation.navigate('ProfileSettings')}
                    >
                        <Ionicons name="create-outline" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* Wallet / Credits Card */}
                <View style={styles.walletCard}>
                    <View style={styles.walletItem}>
                        <View style={styles.walletIconBg}>
                            <Ionicons name="wallet" size={24} color="#2196F3" />
                        </View>
                        <View>
                            <Text style={styles.walletLabel}>Optimus Cash</Text>
                            <Text style={styles.walletValue}>₹120.50</Text>
                        </View>
                    </View>
                    <View style={styles.verticalDivider} />
                    <View style={styles.walletItem}>
                        <View style={[styles.walletIconBg, { backgroundColor: '#FFF3E0' }]}>
                            <Ionicons name="gift" size={24} color="#EF6C00" />
                        </View>
                        <View>
                            <Text style={styles.walletLabel}>Rewards</Text>
                            <Text style={styles.walletValue}>500 pts</Text>
                        </View>
                    </View>
                </View>

                {/* Menu Sections */}
                <Text style={styles.sectionHeader}>Account</Text>
                <View style={styles.menuSection}>
                    <MenuRow
                        icon="location-outline"
                        title="Saved Addresses"
                        subtitle="Home, Work"
                        onPress={() => navigation.navigate('Address')}
                    />
                    <MenuRow
                        icon="card-outline"
                        title="Payment Methods"
                        subtitle="Visa **42"
                        onPress={() => navigation.navigate('PaymentMethod')}
                    />
                    <MenuRow
                        icon="heart-outline"
                        title="Wishlist"
                        subtitle="5 items"
                        onPress={() => navigation.navigate('Wishlist')}
                    />
                </View>

                <Text style={styles.sectionHeader}>Settings & Support</Text>
                <View style={styles.menuSection}>
                    <MenuRow
                        icon="settings-outline"
                        title="Settings"
                        onPress={() => navigation.navigate('Settings')}
                    />
                    <MenuRow
                        icon="help-circle-outline"
                        title="Help & Support"
                        onPress={() => navigation.navigate('HelpSupport')}
                    />
                    <MenuRow
                        icon="log-out-outline"
                        title="Log Out"
                        color="#FF5252"
                        onPress={() => navigation.replace('Login')}
                    />
                </View>

                <Text style={styles.versionText}>v1.2.0 • Optimus Inc.</Text>
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const MenuRow = ({ icon, title, subtitle, color = '#333', onPress }) => (
    <TouchableOpacity style={styles.menuRow} onPress={onPress}>
        <View style={[styles.menuRowIcon, { backgroundColor: color === '#FF5252' ? '#FFEBEE' : '#F5F5F5' }]}>
            <Ionicons name={icon} size={20} color={color} />
        </View>
        <View style={styles.menuRowContent}>
            <Text style={[styles.menuRowTitle, { color }]}>{title}</Text>
            {subtitle && <Text style={styles.menuRowSubtitle}>{subtitle}</Text>}
        </View>
        <Ionicons name="chevron-forward" size={16} color="#CCC" />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F7F7F7',
        paddingTop: 0,
    },
    scrollContent: {
        paddingTop: 0,
    },
    profileHeaderContainer: {
        backgroundColor: '#FFF',
        padding: 24,
        paddingTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    largeAvatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 16,
        borderWidth: 3,
        borderColor: '#E3F2FD',
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: '#666',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        overflow: 'hidden',
    },
    profileEditIcon: {
        padding: 8,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
    },
    walletCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        marginBottom: 24,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        justifyContent: 'space-between',
    },
    walletItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    verticalDivider: {
        width: 1,
        backgroundColor: '#EEEEEE',
        height: '100%',
        marginHorizontal: 16,
    },
    walletIconBg: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    walletLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 2,
    },
    walletValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
        marginLeft: 20,
        marginBottom: 12,
    },
    menuSection: {
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        borderRadius: 16,
        paddingVertical: 8,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
        elevation: 1,
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F9F9F9',
    },
    menuRowIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuRowContent: {
        flex: 1,
    },
    menuRowTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    menuRowSubtitle: {
        fontSize: 12,
        color: '#999',
    },
    versionText: {
        textAlign: 'center',
        color: '#CCC',
        fontSize: 12,
        marginBottom: 20,
    },
});

export default BuyerProfileScreen;
