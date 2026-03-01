import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { firebaseFirestore } from '../services/firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import LoadingSpinner from '../components/LoadingSpinner';

const LeaderboardScreen = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = firebaseFirestore()
            .collection('users')
            .orderBy('totalStars', 'desc')
            .limit(50)
            .onSnapshot((snapshot) => {
                const usersData = [];
                snapshot.forEach((doc) => {
                    usersData.push({ id: doc.id, ...doc.data() });
                });
                setUsers(usersData);
                setLoading(false);
            }, (error) => {
                console.error('Leaderboard error:', error);
                setLoading(false);
            });

        return () => unsubscribe();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Leaderboard</Text>

            <View style={styles.headerRow}>
                <Text style={[styles.columnText, { flex: 0.5 }]}>Rank</Text>
                <Text style={[styles.columnText, { flex: 2 }]}>Member</Text>
                <Text style={[styles.columnText, { flex: 1, textAlign: 'right' }]}>Stars ⭐</Text>
            </View>

            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <View style={[styles.row, index === 0 && styles.firstPlaceRow]}>
                        <Text style={[styles.rankText, index === 0 && styles.firstPlaceText]}>
                            #{index + 1}
                        </Text>
                        <Text style={[styles.nameText, index === 0 && styles.firstPlaceText]} numberOfLines={1}>
                            {item.name || item.email?.split('@')[0]}
                        </Text>
                        <Text style={styles.scoreText}>{item.totalStars || 0}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1A202C' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFD700', padding: 16, paddingTop: 48, textAlign: 'center' },
    headerRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#2D3748', borderBottomWidth: 1, borderBottomColor: '#4A5568' },
    columnText: { color: '#A0AEC0', fontSize: 14, fontWeight: 'bold' },
    row: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#2D3748' },
    firstPlaceRow: { backgroundColor: '#312E81', borderBottomColor: '#4338CA' },
    rankText: { flex: 0.5, color: '#E2E8F0', fontSize: 18, fontWeight: 'bold' },
    nameText: { flex: 2, color: '#E2E8F0', fontSize: 18 },
    scoreText: { flex: 1, color: '#FFD700', fontSize: 18, fontWeight: 'bold', textAlign: 'right' },
    firstPlaceText: { color: '#FFD700' }
});

export default LeaderboardScreen;
