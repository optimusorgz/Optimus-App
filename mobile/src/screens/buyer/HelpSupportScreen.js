import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';

const HelpSupportScreen = () => {
    const navigation = useNavigation();

    const faqData = [
        {
            id: '1',
            question: 'How do I track my order?',
            answer: 'Go to Orders tab and tap on any order to see tracking details.',
        },
        {
            id: '2',
            question: 'What is the return policy?',
            answer: 'You can return items within 7 days of delivery. Items must be unused and in original packaging.',
        },
        {
            id: '3',
            question: 'How do I cancel an order?',
            answer: 'You can cancel orders before they are shipped from the Orders section.',
        },
    ];

    const contactOptions = [
        {
            id: '1',
            icon: 'mail-outline',
            title: 'Email Support',
            subtitle: 'support@optimus.com',
            action: () => Linking.openURL('mailto:support@optimus.com'),
        },
        {
            id: '2',
            icon: 'call-outline',
            title: 'Phone Support',
            subtitle: '+91 1800 123 4567',
            action: () => Linking.openURL('tel:+911800123456'),
        },
        {
            id: '3',
            icon: 'chatbubble-outline',
            title: 'Live Chat',
            subtitle: 'Chat with our support team',
            action: () => { },
        },
    ];

    return (
        <View style={styles.container}>
            <Header title="Help & Support" role="buyer" onBack={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Contact Options */}
                <Text style={styles.sectionTitle}>Contact Us</Text>
                {contactOptions.map(option => (
                    <TouchableOpacity
                        key={option.id}
                        style={styles.contactCard}
                        onPress={option.action}
                    >
                        <View style={styles.iconContainer}>
                            <Ionicons name={option.icon} size={24} color="#2196F3" />
                        </View>
                        <View style={styles.contactDetails}>
                            <Text style={styles.contactTitle}>{option.title}</Text>
                            <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                ))}

                {/* FAQs */}
                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Frequently Asked Questions</Text>
                {faqData.map(faq => (
                    <View key={faq.id} style={styles.faqCard}>
                        <Text style={styles.question}>{faq.question}</Text>
                        <Text style={styles.answer}>{faq.answer}</Text>
                    </View>
                ))}

                {/* Report Issue */}
                <TouchableOpacity style={styles.reportButton}>
                    <Ionicons name="flag-outline" size={20} color="#FFF" />
                    <Text style={styles.reportButtonText}>Report an Issue</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    contactDetails: {
        flex: 1,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    contactSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    faqCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    question: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    answer: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    reportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF3B30',
        borderRadius: 12,
        padding: 16,
        marginTop: 24,
    },
    reportButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: 8,
    },
});

export default HelpSupportScreen;
