import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingSpinner = () => (
    <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFD700" />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1A202C',
    },
});

export default LoadingSpinner;
