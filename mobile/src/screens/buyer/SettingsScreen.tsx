import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';

const SettingsScreen = () => {
    const navigation = useNavigation();
    const [notifications, setNotifications] = useState(true);
    const [emailUpdates, setEmailUpdates] = useState(false);
    const [orderUpdates, setOrderUpdates] = useState(true);

    const settingsSections = [
        {
            title: 'Notifications',
            items: [
                {
                    id: '1',
                    icon: 'notifications-outline',
                    label: 'Push Notifications',
                    type: 'toggle',
                    value: notifications,
                    onToggle: setNotifications,
                },
                {
                    id: '2',
                    icon: 'mail-outline',
                    label: 'Email Updates',
                    type: 'toggle',
                    value: emailUpdates,
                    onToggle: setEmailUpdates,
                },
                {
                    id: '3',
                    icon: 'cube-outline',
                    label: 'Order Updates',
                    type: 'toggle',
                    value: orderUpdates,
                    onToggle: setOrderUpdates,
                },
            ],
        },
        {
            title: 'Account',
            items: [
                {
                    id: '4',
                    icon: 'person-outline',
                    label: 'Edit Profile',
                    type: 'link',
                    onPress: () => navigation.navigate('ProfileSettings'),
                },
                {
                    id: '5',
                    icon: 'lock-closed-outline',
                    label: 'Change Password',
                    type: 'link',
                    onPress: () => navigation.navigate('ChangePassword'),
                },
                {
                    id: '6',
                    icon: 'shield-checkmark-outline',
                    label: 'Privacy Settings',
                    type: 'link',
                    onPress: () => { },
                },
            ],
        },
        {
            title: 'App',
            items: [
                {
                    id: '7',
                    icon: 'language-outline',
                    label: 'Language',
                    type: 'link',
                    value: 'English',
                    onPress: () => { },
                },
                {
                    id: '8',
                    icon: 'document-text-outline',
                    label: 'Terms & Conditions',
                    type: 'link',
                    onPress: () => { },
                },
                {
                    id: '9',
                    icon: 'shield-outline',
                    label: 'Privacy Policy',
                    type: 'link',
                    onPress: () => { },
                },
                {
                    id: '10',
                    icon: 'information-circle-outline',
                    label: 'About',
                    type: 'link',
                    value: 'v1.0.0',
                    onPress: () => { },
                },
            ],
        },
    ];

    const renderSettingItem = (item) => {
        if (item.type === 'toggle') {
            return (
                <View key={item.id} style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                        <Ionicons name={item.icon} size={22} color="#666" />
                        <Text style={styles.settingLabel}>{item.label}</Text>
                    </View>
                    <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: '#D0D0D0', true: '#90CAF9' }}
                        thumbColor={item.value ? '#2196F3' : '#f4f3f4'}
                    />
                </View>
            );
        }

        return (
            <TouchableOpacity key={item.id} style={styles.settingItem} onPress={item.onPress}>
                <View style={styles.settingLeft}>
                    <Ionicons name={item.icon} size={22} color="#666" />
                    <Text style={styles.settingLabel}>{item.label}</Text>
                </View>
                <View style={styles.settingRight}>
                    {item.value && <Text style={styles.settingValue}>{item.value}</Text>}
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Header title="Settings" role="buyer" onBack={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {settingsSections.map((section, index) => (
                    <View key={index} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={styles.sectionCard}>
                            {section.items.map((item, idx) => (
                                <View key={item.id}>
                                    {renderSettingItem(item)}
                                    {idx < section.items.length - 1 && <View style={styles.divider} />}
                                </View>
                            ))}
                        </View>
                    </View>
                ))}

                <TouchableOpacity style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                    <Text style={styles.logoutText}>Logout</Text>
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
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        marginLeft: 4,
    },
    sectionCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingLabel: {
        fontSize: 15,
        color: '#333',
        marginLeft: 12,
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingValue: {
        fontSize: 14,
        color: '#999',
        marginRight: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginLeft: 50,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#FF3B30',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF3B30',
        marginLeft: 8,
    },
});

export default SettingsScreen;
