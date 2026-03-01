import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { firebaseFirestore } from '../../services/firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import StarRating from '../../components/StarRating';
import LoadingSpinner from '../../components/LoadingSpinner';

const ReviewSubmissions = ({ navigation }) => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = firebaseFirestore()
            .collection('submissions')
            .where('status', '==', 'pending')
            .orderBy('submittedAt', 'asc')
            .onSnapshot((snapshot) => {
                const subsData = [];
                snapshot.forEach((doc) => {
                    subsData.push({ id: doc.id, ...doc.data() });
                });
                // State arrays need to keep individual star ratings being given by admin before submission
                setSubmissions(subsData.map(sub => ({ ...sub, currentStars: 0 })));
                setLoading(false);
            }, (error) => {
                console.error('Error fetching submissions:', error);
                setLoading(false);
            });

        return () => unsubscribe();
    }, []);

    const handleStarChange = (id, rating) => {
        setSubmissions(prev =>
            prev.map(sub => sub.id === id ? { ...sub, currentStars: rating } : sub)
        );
    };

    const handleAction = async (submission, action) => {
        try {
            if (action === 'approved' && submission.currentStars === 0) {
                Alert.alert('Hold on', 'Please assign at least 1 star to approve.');
                return;
            }

            const batch = firebaseFirestore().batch();

            // 1. Update submission doc
            const subRef = firebaseFirestore().collection('submissions').doc(submission.id);
            batch.update(subRef, {
                status: action,
                starsGiven: action === 'approved' ? submission.currentStars : 0
            });

            // 2. Increment user totalStars if approved
            if (action === 'approved') {
                const userRef = firebaseFirestore().collection('users').doc(submission.userId);
                batch.update(userRef, {
                    totalStars: firebaseFirestore.FieldValue.increment(submission.currentStars)
                });
            }

            await batch.commit();
            // Toast/Alert success (since it's a snapshot, it'll auto-remove from list)
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to process submission.');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.studentName}>{item.userName || 'Member'}</Text>
                <Text style={styles.dateText}>
                    {item.submittedAt?.toDate ? item.submittedAt.toDate().toLocaleDateString() : 'Recent'}
                </Text>
            </View>

            <Text style={styles.answerLabel}>Submission:</Text>
            <Text style={styles.answerText}>{item.submissionText}</Text>

            {item.submissionFileUrl ? (
                <TouchableOpacity
                    style={styles.attachmentButton}
                    onPress={() => Linking.openURL(item.submissionFileUrl)}
                >
                    <Icon name="link" size={20} color="#3182CE" />
                    <Text style={styles.attachmentText}>View Attachment</Text>
                </TouchableOpacity>
            ) : null}

            <View style={styles.ratingSection}>
                <Text style={styles.ratingLabel}>Award Stars:</Text>
                <StarRating
                    rating={item.currentStars}
                    onChange={(rating) => handleStarChange(item.id, rating)}
                />
            </View>

            <View style={styles.actionRow}>
                <TouchableOpacity
                    style={[styles.actionBtn, styles.rejectBtn]}
                    onPress={() => handleAction(item, 'rejected')}
                >
                    <Icon name="close" size={20} color="#fff" />
                    <Text style={styles.btnText}>Reject</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionBtn, styles.approveBtn]}
                    onPress={() => handleAction(item, 'approved')}
                >
                    <Icon name="checkmark" size={20} color="#fff" />
                    <Text style={styles.btnText}>Approve</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) return <LoadingSpinner />;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#E2E8F0" />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Review Submissions</Text>
            </View>

            {submissions.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon name="checkmark-done-circle-outline" size={64} color="#A0AEC0" />
                    <Text style={styles.emptyText}>All caught up! No pending submissions.</Text>
                </View>
            ) : (
                <FlatList
                    data={submissions}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1A202C' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 48, borderBottomWidth: 1, borderBottomColor: '#2D3748' },
    backButton: { marginRight: 16 },
    screenTitle: { fontSize: 20, fontWeight: 'bold', color: '#E2E8F0' },
    listContainer: { padding: 16 },
    card: { backgroundColor: '#2D3748', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#4A5568' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    studentName: { color: '#FFD700', fontSize: 18, fontWeight: 'bold' },
    dateText: { color: '#A0AEC0', fontSize: 12 },
    answerLabel: { color: '#A0AEC0', fontSize: 14, marginBottom: 4 },
    answerText: { color: '#E2E8F0', fontSize: 16, backgroundColor: '#1A202C', padding: 12, borderRadius: 8, marginBottom: 16 },
    attachmentButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A202C', padding: 12, borderRadius: 8, marginBottom: 16, alignSelf: 'flex-start' },
    attachmentText: { color: '#3182CE', marginLeft: 8, fontWeight: 'bold' },
    ratingSection: { alignItems: 'center', marginBottom: 16 },
    ratingLabel: { color: '#E2E8F0', marginBottom: 8, fontWeight: 'bold' },
    actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    actionBtn: { flex: 0.48, flexDirection: 'row', padding: 12, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    rejectBtn: { backgroundColor: '#E53E3E' },
    approveBtn: { backgroundColor: '#38A169' },
    btnText: { color: '#fff', fontWeight: 'bold', marginLeft: 8 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: '#A0AEC0', fontSize: 16, marginTop: 16 }
});

export default ReviewSubmissions;
