import React, { FC } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/context/CartContext';

const App: FC = () => {
  return (
    <SafeAreaProvider>
      <CartProvider>
        <AppNavigator />
      </CartProvider>
    </SafeAreaProvider>
  );
};

export default App;
