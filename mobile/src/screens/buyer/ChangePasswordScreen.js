import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';

const ChangePasswordScreen = () => {
    const navigation = useNavigation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChangePassword = () => {
        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (newPassword.length < 8) {
            Alert.alert('Error', 'New password must be at least 8 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }

        // API call to change password would go here
        Alert.alert(
            'Success',
            'Your password has been changed successfully',
            [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Header title="Change Password" role="buyer" onBack={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Security Info */}
                <View style={styles.infoCard}>
                    <Ionicons name="shield-checkmark" size={40} color="#2196F3" />
                    <Text style={styles.infoTitle}>Keep Your Account Secure</Text>
                    <Text style={styles.infoText}>
                        Choose a strong password that you don't use for other accounts
                    </Text>
                </View>

                {/* Password Fields */}
                <View style={styles.formSection}>
                    {/* Current Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Current Password</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                placeholder="Enter current password"
                                placeholderTextColor="#999"
                                secureTextEntry={!showCurrentPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                style={styles.eyeButton}
                            >
                                <Ionicons
                                    name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color="#999"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* New Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>New Password</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder="Enter new password"
                                placeholderTextColor="#999"
                                secureTextEntry={!showNewPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                onPress={() => setShowNewPassword(!showNewPassword)}
                                style={styles.eyeButton}
                            >
                                <Ionicons
                                    name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color="#999"
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.hint}>Must be at least 8 characters</Text>
                    </View>

                    {/* Confirm Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm New Password</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Re-enter new password"
                                placeholderTextColor="#999"
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.eyeButton}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color="#999"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Password Requirements */}
                <View style={styles.requirementsCard}>
                    <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                    <View style={styles.requirement}>
                        <Ionicons
                            name={newPassword.length >= 8 ? 'checkmark-circle' : 'ellipse-outline'}
                            size={18}
                            color={newPassword.length >= 8 ? '#4CAF50' : '#999'}
                        />
                        <Text style={styles.requirementText}>At least 8 characters</Text>
                    </View>
                    <View style={styles.requirement}>
                        <Ionicons
                            name={/[A-Z]/.test(newPassword) ? 'checkmark-circle' : 'ellipse-outline'}
                            size={18}
                            color={/[A-Z]/.test(newPassword) ? '#4CAF50' : '#999'}
                        />
                        <Text style={styles.requirementText}>One uppercase letter</Text>
                    </View>
                    <View style={styles.requirement}>
                        <Ionicons
                            name={/[0-9]/.test(newPassword) ? 'checkmark-circle' : 'ellipse-outline'}
                            size={18}
                            color={/[0-9]/.test(newPassword) ? '#4CAF50' : '#999'}
                        />
                        <Text style={styles.requirementText}>One number</Text>
                    </View>
                    <View style={styles.requirement}>
                        <Ionicons
                            name={newPassword === confirmPassword && newPassword.length > 0 ? 'checkmark-circle' : 'ellipse-outline'}
                            size={18}
                            color={newPassword === confirmPassword && newPassword.length > 0 ? '#4CAF50' : '#999'}
                        />
                        <Text style={styles.requirementText}>Passwords match</Text>
                    </View>
                </View>

                {/* Change Password Button */}
                <TouchableOpacity style={styles.changeButton} onPress={handleChangePassword}>
                    <Text style={styles.changeButtonText}>Change Password</Text>
                </TouchableOpacity>

                {/* Forgot Password Link */}
                <TouchableOpacity style={styles.forgotButton}>
                    <Text style={styles.forgotText}>Forgot your current password?</Text>
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
    infoCard: {
        backgroundColor: '#E3F2FD',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        marginBottom: 24,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1976D2',
        marginTop: 12,
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#1976D2',
        textAlign: 'center',
        lineHeight: 20,
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
    eyeButton: {
        padding: 4,
    },
    hint: {
        fontSize: 12,
        color: '#999',
        marginTop: 6,
        marginLeft: 4,
    },
    requirementsCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    requirementsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    requirement: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    requirementText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    changeButton: {
        backgroundColor: '#2196F3',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    changeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    forgotButton: {
        alignItems: 'center',
        padding: 12,
        marginBottom: 32,
    },
    forgotText: {
        fontSize: 14,
        color: '#2196F3',
        fontWeight: '600',
    },
});

export default ChangePasswordScreen;
