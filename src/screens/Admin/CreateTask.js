import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { firebaseFirestore } from '../../services/firebase';
import Icon from 'react-native-vector-icons/Ionicons';

const CreateTask = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [days, setDays] = useState('7'); // Default 7 days deadline
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!title.trim() || !description.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const deadlineDate = new Date();
            deadlineDate.setDate(deadlineDate.getDate() + parseInt(days, 10));

            await firebaseFirestore().collection('tasks').add({
                title,
                description,
                createdBy: user.uid,
                createdAt: firebaseFirestore.FieldValue.serverTimestamp(),
                deadline: firebaseFirestore.Timestamp.fromDate(deadlineDate),
            });

            Alert.alert('Success', 'Task created successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#E2E8F0" />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Create New Task</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Task Title</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Build a React component"
                    placeholderTextColor="#A0AEC0"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={styles.label}>Description & Guidelines</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Details about what needs to be done..."
                    placeholderTextColor="#A0AEC0"
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    value={description}
                    onChangeText={setDescription}
                />

                <Text style={styles.label}>Deadline (Days from today)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="7"
                    placeholderTextColor="#A0AEC0"
                    keyboardType="numeric"
                    value={days}
                    onChangeText={setDays}
                />

                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.disabledButton]}
                    onPress={handleCreate}
                    disabled={loading}
                >
                    <Text style={styles.submitButtonText}>{loading ? 'Creating...' : 'Publish Task'}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1A202C' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 48, borderBottomWidth: 1, borderBottomColor: '#2D3748' },
    backButton: { marginRight: 16 },
    screenTitle: { fontSize: 20, fontWeight: 'bold', color: '#E2E8F0' },
    form: { padding: 24 },
    label: { fontSize: 16, color: '#E2E8F0', marginBottom: 8, fontWeight: 'bold' },
    input: { backgroundColor: '#2D3748', borderRadius: 8, padding: 16, color: '#fff', fontSize: 16, marginBottom: 24, borderWidth: 1, borderColor: '#4A5568' },
    textArea: { minHeight: 120 },
    submitButton: { backgroundColor: '#38A169', padding: 18, borderRadius: 8, alignItems: 'center', marginTop: 16 },
    disabledButton: { backgroundColor: '#4A5568' },
    submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default CreateTask;
