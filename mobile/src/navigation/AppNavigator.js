import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ModeSelectionScreen from '../screens/ModeSelectionScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BuyerNavigator from './BuyerNavigator';
import ProductDetailsScreen from '../screens/buyer/ProductDetailsScreen';
import WishlistScreen from '../screens/buyer/WishlistScreen';
import AddressScreen from '../screens/buyer/AddressScreen';
import PaymentMethodScreen from '../screens/buyer/PaymentMethodScreen';
import HelpSupportScreen from '../screens/buyer/HelpSupportScreen';
import SettingsScreen from '../screens/buyer/SettingsScreen';
import ProfileSettingsScreen from '../screens/buyer/ProfileSettingsScreen';
import ChangePasswordScreen from '../screens/buyer/ChangePasswordScreen';
import CartScreen from '../screens/buyer/CartScreen';
import CheckoutScreen from '../screens/buyer/CheckoutScreen';
import OrderSuccessScreen from '../screens/buyer/OrderSuccessScreen';
import SellerNavigator from './SellerNavigator';
import SellerProductsScreen from '../screens/seller/SellerProductsScreen';
import SellerOrdersScreen from '../screens/seller/SellerOrdersScreen';
import AddProductScreen from '../screens/seller/AddProductScreen';
import CategoryScreen from '../screens/buyer/CategoryScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="Wishlist" component={WishlistScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ headerShown: false }} />
                <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Address" component={AddressScreen} options={{ headerShown: false }} />
                <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} options={{ headerShown: false }} />
                <Stack.Screen name="HelpSupport" component={HelpSupportScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }} />

                {/* Seller Screens */}
                <Stack.Screen name="CompanySeller" component={SellerNavigator} options={{ headerShown: false }} />
                <Stack.Screen name="SellerProducts" component={SellerProductsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="SellerOrders" component={SellerOrdersScreen} options={{ headerShown: false }} />
                <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ headerShown: false }} />

                <Stack.Screen
                    name="ModeSelection"
                    component={ModeSelectionScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="BuyerHome"
                    component={BuyerNavigator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ProductDetails"
                    component={ProductDetailsScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Category"
                    component={CategoryScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="CompanySellerPlaceholder"
                    component={PlaceholderScreen}
                    initialParams={{ role: 'Company Seller' }}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="StudentSellerPlaceholder"
                    component={PlaceholderScreen}
                    initialParams={{ role: 'Student Seller' }}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="RentalPlaceholder"
                    component={PlaceholderScreen}
                    initialParams={{ role: 'Rental' }}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
