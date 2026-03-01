import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfileScreen = () => {
    const { user, role, logout } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <View style={styles.headerBackground}>
                <Icon name="person-circle" size={100} color="#FFD700" />
                <Text style={styles.name}>{user?.name || user?.email?.split('@')[0]}</Text>
                <Text style={styles.email}>{user?.email}</Text>
                <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>{role?.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                    <Icon name="star" size={32} color="#FFD700" />
                    <Text style={styles.statValue}>{user?.totalStars || 0}</Text>
                    <Text style={styles.statLabel}>Total Stars</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Icon name="log-out-outline" size={24} color="#E53E3E" style={{ marginRight: 8 }} />
                <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1A202C' },
    headerBackground: { alignItems: 'center', paddingVertical: 48, backgroundColor: '#2D3748', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, elevation: 5 },
    name: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 16 },
    email: { fontSize: 16, color: '#A0AEC0', marginTop: 4 },
    roleBadge: { marginTop: 12, backgroundColor: '#4A5568', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16 },
    roleText: { color: '#fff', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
    statsContainer: { padding: 24, alignItems: 'center' },
    statBox: { backgroundColor: '#2D3748', width: '100%', padding: 24, borderRadius: 16, alignItems: 'center', elevation: 2 },
    statValue: { fontSize: 36, fontWeight: 'bold', color: '#FFD700', marginVertical: 8 },
    statLabel: { fontSize: 16, color: '#A0AEC0' },
    logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 24, padding: 16, backgroundColor: '#2D3748', borderRadius: 12, borderWidth: 1, borderColor: '#E53E3E' },
    logoutText: { color: '#E53E3E', fontSize: 18, fontWeight: 'bold' }
});

export default ProfileScreen;
