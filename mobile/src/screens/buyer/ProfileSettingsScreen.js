import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';

const ProfileSettingsScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('Kaushik Ranjan');
    const [email, setEmail] = useState('kaushik@example.com');
    const [phone, setPhone] = useState('+91 98765 43210');
    const [college, setCollege] = useState('IIT Bangalore');
    const [city, setCity] = useState('Bangalore');

    const handleSave = () => {
        // Save profile logic here
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Header title="Edit Profile" role="buyer" onBack={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Picture */}
                <View style={styles.avatarSection}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&q=80' }}
                        style={styles.avatar}
                    />
                    <TouchableOpacity style={styles.cameraButton}>
                        <Ionicons name="camera" size={20} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.changePhotoText}>Change Photo</Text>
                </View>

                {/* Form Fields */}
                <View style={styles.formSection}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your name"
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Enter your email"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="call-outline" size={20} color="#999" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Enter your phone"
                                placeholderTextColor="#999"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>College/University</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="school-outline" size={20} color="#999" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={college}
                                onChangeText={setCollege}
                                placeholder="Enter your college"
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>City</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="location-outline" size={20} color="#999" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={city}
                                onChangeText={setCity}
                                placeholder="Enter your city"
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>
                </View>

                {/* Additional Options */}
                <View style={styles.optionsSection}>
                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={() => navigation.navigate('ChangePassword')}
                    >
                        <Ionicons name="lock-closed-outline" size={20} color="#2196F3" />
                        <Text style={styles.optionText}>Change Password</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton}>
                        <Ionicons name="shield-checkmark-outline" size={20} color="#2196F3" />
                        <Text style={styles.optionText}>Privacy Settings</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>

                {/* Delete Account */}
                <TouchableOpacity style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                    <Text style={styles.deleteButtonText}>Delete Account</Text>
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
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#E3F2FD',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 24,
        right: '35%',
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    changePhotoText: {
        marginTop: 12,
        fontSize: 14,
        color: '#2196F3',
        fontWeight: '600',
    },
    formSection: {
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        paddingVertical: 14,
    },
    optionsSection: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 24,
        overflow: 'hidden',
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    optionText: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        marginLeft: 12,
        fontWeight: '500',
    },
    saveButton: {
        backgroundColor: '#2196F3',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        marginBottom: 32,
    },
    deleteButtonText: {
        fontSize: 14,
        color: '#FF3B30',
        marginLeft: 8,
        fontWeight: '600',
    },
});

export default ProfileSettingsScreen;
