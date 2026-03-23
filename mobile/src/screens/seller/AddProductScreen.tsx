import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';

const AddProductScreen = ({ navigation }) => {
    const [productData, setProductData] = useState({
        title: '',
        description: '',
        price: '',
        originalPrice: '',
        category: '',
        stock: '',
        brand: '',
    });

    const categories = [
        'Electronics', 'Fashion', 'Sports', 'Books', 'Home & Kitchen', 'Beauty'
    ];

    const handleSubmit = () => {
        if (!productData.title || !productData.price || !productData.category || !productData.stock) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        Alert.alert(
            'Success',
            'Product added successfully!',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
    };

    return (
        <View style={styles.container}>
            <Header
                title="Add Product"
                role="seller"
                onBack={() => navigation.goBack()}
            />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Product Images */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Product Images *</Text>
                    <View style={styles.imageUploadContainer}>
                        <TouchableOpacity style={styles.imageUploadBox}>
                            <Ionicons name="camera-outline" size={32} color="#757575" />
                            <Text style={styles.imageUploadText}>Add Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.imageUploadBox}>
                            <Ionicons name="add" size={32} color="#BDBDBD" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.imageUploadBox}>
                            <Ionicons name="add" size={32} color="#BDBDBD" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.helperText}>First image will be the cover photo</Text>
                </View>

                {/* Product Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Product Details</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Product Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter product name"
                            placeholderTextColor="#9E9E9E"
                            value={productData.title}
                            onChangeText={(text) => setProductData({ ...productData, title: text })}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Describe your product"
                            placeholderTextColor="#9E9E9E"
                            multiline
                            numberOfLines={4}
                            value={productData.description}
                            onChangeText={(text) => setProductData({ ...productData, description: text })}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Category *</Text>
                        <View style={styles.categoryContainer}>
                            {categories.map(cat => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.categoryChip,
                                        productData.category === cat && styles.categoryChipActive
                                    ]}
                                    onPress={() => setProductData({ ...productData, category: cat })}
                                >
                                    <Text style={[
                                        styles.categoryText,
                                        productData.category === cat && styles.categoryTextActive
                                    ]}>
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Brand</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter brand name"
                            placeholderTextColor="#9E9E9E"
                            value={productData.brand}
                            onChangeText={(text) => setProductData({ ...productData, brand: text })}
                        />
                    </View>
                </View>

                {/* Pricing */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Pricing</Text>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.label}>Selling Price *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="₹0"
                                placeholderTextColor="#9E9E9E"
                                keyboardType="numeric"
                                value={productData.price}
                                onChangeText={(text) => setProductData({ ...productData, price: text })}
                            />
                        </View>
                        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.label}>MRP</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="₹0"
                                placeholderTextColor="#9E9E9E"
                                keyboardType="numeric"
                                value={productData.originalPrice}
                                onChangeText={(text) => setProductData({ ...productData, originalPrice: text })}
                            />
                        </View>
                    </View>
                    {productData.price && productData.originalPrice && (
                        <Text style={styles.discountText}>
                            Discount: {Math.round((1 - productData.price / productData.originalPrice) * 100)}% off
                        </Text>
                    )}
                </View>

                {/* Inventory */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Inventory</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Stock Quantity *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0"
                            placeholderTextColor="#9E9E9E"
                            keyboardType="numeric"
                            value={productData.stock}
                            onChangeText={(text) => setProductData({ ...productData, stock: text })}
                        />
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Add Product</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F3F6',
    },
    content: {
        paddingBottom: 20,
    },
    section: {
        backgroundColor: '#FFF',
        padding: 16,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#212121',
        marginBottom: 16,
    },
    imageUploadContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
    },
    imageUploadBox: {
        width: 100,
        height: 100,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
    },
    imageUploadText: {
        fontSize: 12,
        color: '#757575',
        marginTop: 8,
    },
    helperText: {
        fontSize: 12,
        color: '#757575',
        marginTop: 4,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
        color: '#424242',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FAFAFA',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        padding: 12,
        fontSize: 14,
        color: '#212121',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    categoryChipActive: {
        backgroundColor: '#2874F0',
        borderColor: '#2874F0',
    },
    categoryText: {
        fontSize: 13,
        color: '#757575',
        fontWeight: '500',
    },
    categoryTextActive: {
        color: '#FFF',
    },
    row: {
        flexDirection: 'row',
    },
    discountText: {
        fontSize: 12,
        color: '#388E3C',
        fontWeight: '500',
        marginTop: 4,
    },
    bottomBar: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#757575',
    },
    submitButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 4,
        backgroundColor: '#2874F0',
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFF',
    },
});

export default AddProductScreen;
