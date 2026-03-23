import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ModeCard = ({ title, description, onPress, color }) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: color }]} onPress={onPress}>
        <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <Text style={styles.cardDescription}>{description}</Text>
    </TouchableOpacity>
);

const ModeSelectionScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.headerTitle}>Select Your Mode</Text>
                <Text style={styles.subHeader}>Choose how you want to use Optimus today</Text>

                <View style={styles.grid}>
                    <ModeCard
                        title="Buyer Mode"
                        description="Browse, buy, and rent products easily."
                        onPress={() => navigation.navigate('BuyerHome')}
                        color="#E3F2FD"
                    />
                    <ModeCard
                        title="Company Seller"
                        description="Sell brand new products directly to customers."
                        onPress={() => navigation.navigate('CompanySeller')}
                        color="#E8F5E9"
                    />
                    <ModeCard
                        title="Student Seller"
                        description="Sell your used items to fellow students."
                        onPress={() => navigation.navigate('StudentSellerPlaceholder')}
                        color="#FFF3E0"
                    />
                    <ModeCard
                        title="Rental Mode"
                        description="List items for rent and earn extra income."
                        onPress={() => navigation.navigate('RentalPlaceholder')}
                        color="#F3E5F5"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        padding: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subHeader: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },
    grid: {
        gap: 16,
    },
    card: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    cardDescription: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
});

export default ModeSelectionScreen;
