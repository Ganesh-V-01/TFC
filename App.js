import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <StatusBar barStyle="light-content" backgroundColor="#1A202C" />
                <AppNavigator />
            </AuthProvider>
        </SafeAreaProvider>
    );
};

export default App;
