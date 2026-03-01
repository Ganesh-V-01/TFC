import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { firebaseFirestore } from '../services/firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import LoadingSpinner from '../components/LoadingSpinner';

const TaskDetailScreen = ({ route, navigation }) => {
    const { task } = route.params;
    const { user } = useContext(AuthContext);
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const subSnapshot = await firebaseFirestore()
                    .collection('submissions')
                    .where('taskId', '==', task.id)
                    .where('userId', '==', user.uid)
                    .get();

                if (!subSnapshot.empty) {
                    setSubmission({
                        id: subSnapshot.docs[0].id,
                        ...subSnapshot.docs[0].data()
                    });
                }
            } catch (error) {
                console.error('Error fetching submission:', error);
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = navigation.addListener('focus', () => {
            fetchSubmission();
        });

        fetchSubmission();

        return unsubscribe;
    }, [task.id, user.uid, navigation]);

    if (loading) return <LoadingSpinner />;

    const formattedDate = task.deadline?.toDate ? task.deadline.toDate().toLocaleString() : '';

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#E2E8F0" />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Task Details</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.title}>{task.title}</Text>
                <Text style={styles.deadline}><Icon name="time-outline" /> Due: {formattedDate}</Text>
                <Text style={styles.description}>{task.description}</Text>
            </View>

            {submission ? (
                <View style={styles.submissionCard}>
                    <Text style={styles.subHeading}>Your Submission</Text>
                    <View style={styles.statusRow}>
                        <Text style={styles.statusLabel}>Status: </Text>
                        <Text style={[styles.statusValue,
                        submission.status === 'approved' ? { color: '#38A169' } :
                            submission.status === 'rejected' ? { color: '#E53E3E' } : { color: '#ED8936' }
                        ]}>
                            {submission.status.toUpperCase()}
                        </Text>
                    </View>

                    {submission.starsGiven > 0 && (
                        <View style={styles.statusRow}>
                            <Text style={styles.statusLabel}>Stars Earned: </Text>
                            <Text style={{ color: '#FFD700', fontWeight: 'bold' }}>{submission.starsGiven} ⭐</Text>
                        </View>
                    )}

                    <Text style={styles.subTextLabel}>Answer:</Text>
                    <Text style={styles.subTextValue}>{submission.submissionText}</Text>

                    {submission.submissionFileUrl && (
                        <Text style={styles.attachmentText}>📎 Attachment included</Text>
                    )}
                </View>
            ) : (
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => navigation.navigate('SubmitTask', { task })}
                >
                    <Text style={styles.submitButtonText}>Submit Work</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1A202C' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 48 },
    backButton: { marginRight: 16 },
    screenTitle: { fontSize: 20, fontWeight: 'bold', color: '#E2E8F0' },
    card: { backgroundColor: '#2D3748', padding: 16, margin: 16, borderRadius: 12 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#E2E8F0', marginBottom: 8 },
    deadline: { fontSize: 14, color: '#A0AEC0', marginBottom: 16 },
    description: { fontSize: 16, color: '#CBD5E0', lineHeight: 24 },
    submissionCard: { backgroundColor: '#2D3748', padding: 16, margin: 16, borderRadius: 12, borderWidth: 1, borderColor: '#4A5568' },
    subHeading: { fontSize: 18, fontWeight: 'bold', color: '#FFD700', marginBottom: 12 },
    statusRow: { flexDirection: 'row', marginBottom: 8 },
    statusLabel: { color: '#A0AEC0', fontSize: 16 },
    statusValue: { fontSize: 16, fontWeight: 'bold' },
    subTextLabel: { color: '#A0AEC0', fontSize: 14, marginTop: 12, marginBottom: 4 },
    subTextValue: { color: '#E2E8F0', fontSize: 16, backgroundColor: '#1A202C', padding: 12, borderRadius: 8 },
    attachmentText: { color: '#3182CE', marginTop: 12, fontSize: 14 },
    submitButton: { backgroundColor: '#3182CE', margin: 16, padding: 16, borderRadius: 8, alignItems: 'center' },
    submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default TaskDetailScreen;
