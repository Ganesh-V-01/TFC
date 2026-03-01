import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { firebaseFirestore } from '../../services/firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = ({ navigation }) => {
    const [stats, setStats] = useState({ tasks: 0, pending: 0, users: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const tasksSnap = await firebaseFirestore().collection('tasks').get();
                const pendingSnap = await firebaseFirestore().collection('submissions').where('status', '==', 'pending').get();
                const usersSnap = await firebaseFirestore().collection('users').get();

                setStats({
                    tasks: tasksSnap.size,
                    pending: pendingSnap.size,
                    users: usersSnap.size
                });
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        const unsubscribe = navigation.addListener('focus', fetchStats);
        return unsubscribe;
    }, [navigation]);

    if (loading) return <LoadingSpinner />;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Admin Headquarters</Text>

            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{stats.pending}</Text>
                    <Text style={styles.statLabel}>Pending Reviews</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{stats.tasks}</Text>
                    <Text style={styles.statLabel}>Active Tasks</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Quick Actions</Text>

            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('CreateTask')}>
                <View style={styles.actionIconContainer}>
                    <Icon name="add-circle" size={32} color="#38A169" />
                </View>
                <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>Create New Task</Text>
                    <Text style={styles.actionDesc}>Assign a new project or assignment to members</Text>
                </View>
                <Icon name="chevron-forward" size={24} color="#A0AEC0" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('ReviewSubmissions')}>
                <View style={styles.actionIconContainer}>
                    <Icon name="checkmark-done-circle" size={32} color="#3182CE" />
                </View>
                <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>Review Submissions</Text>
                    <Text style={styles.actionDesc}>Grade pending tasks and award stars</Text>
                </View>
                {stats.pending > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{stats.pending}</Text></View>}
                <Icon name="chevron-forward" size={24} color="#A0AEC0" />
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1A202C' },
    header: { fontSize: 28, fontWeight: 'bold', color: '#E2E8F0', padding: 24, paddingTop: 60, paddingBottom: 16 },
    statsRow: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 24, justifyContent: 'space-between' },
    statCard: { flex: 0.48, backgroundColor: '#2D3748', padding: 20, borderRadius: 16, alignItems: 'center' },
    statNumber: { fontSize: 32, fontWeight: 'bold', color: '#FFD700' },
    statLabel: { fontSize: 14, color: '#A0AEC0', marginTop: 8, textAlign: 'center' },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#E2E8F0', marginHorizontal: 24, marginBottom: 16 },
    actionCard: { flexDirection: 'row', backgroundColor: '#2D3748', marginHorizontal: 16, marginBottom: 16, padding: 16, borderRadius: 12, alignItems: 'center' },
    actionIconContainer: { marginRight: 16 },
    actionTextContainer: { flex: 1 },
    actionTitle: { fontSize: 18, fontWeight: 'bold', color: '#E2E8F0' },
    actionDesc: { fontSize: 13, color: '#A0AEC0', marginTop: 4 },
    badge: { backgroundColor: '#E53E3E', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, marginRight: 8 },
    badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});

export default AdminDashboard;
