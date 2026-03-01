import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { firebaseFirestore, firebaseStorage } from '../services/firebase';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

const SubmitTaskScreen = ({ route, navigation }) => {
    const { task } = route.params;
    const { user } = useContext(AuthContext);
    const [submissionText, setSubmissionText] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [uploading, setUploading] = useState(false);

    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
            if (response.didCancel) return;
            if (response.errorMessage) {
                Alert.alert('Error', response.errorMessage);
                return;
            }
            if (response.assets && response.assets.length > 0) {
                setImageUri(response.assets[0].uri);
            }
        });
    };

    const submitWork = async () => {
        if (!submissionText.trim() && !imageUri) {
            Alert.alert('Error', 'Please provide some text or attach an image.');
            return;
        }

        setUploading(true);
        let downloadUrl = null;

        try {
            if (imageUri) {
                const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
                const storageRef = firebaseStorage().ref(`submissions/${user.uid}/${task.id}/${filename}`);
                await storageRef.putFile(imageUri);
                downloadUrl = await storageRef.getDownloadURL();
            }

            await firebaseFirestore().collection('submissions').add({
                taskId: task.id,
                userId: user.uid,
                userName: user.name || 'Unknown Member',
                submissionText,
                submissionFileUrl: downloadUrl || '',
                starsGiven: 0,
                status: 'pending',
                submittedAt: firebaseFirestore.FieldValue.serverTimestamp()
            });

            Alert.alert('Success', 'Task submitted successfully!', [
                { text: 'OK', onPress: () => navigation.navigate('TasksList') }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Could not submit task.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="close" size={28} color="#E2E8F0" />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Submit Task</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.taskTitle}>{task.title}</Text>

                <Text style={styles.label}>Your Answer/Notes:</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Describe your work, paste a link, etc."
                    placeholderTextColor="#A0AEC0"
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    value={submissionText}
                    onChangeText={setSubmissionText}
                />

                <View style={styles.attachmentSection}>
                    <TouchableOpacity style={styles.attachButton} onPress={selectImage}>
                        <Icon name="image-outline" size={24} color="#E2E8F0" />
                        <Text style={styles.attachText}>{imageUri ? 'Change Image' : 'Attach Image'}</Text>
                    </TouchableOpacity>
                    {imageUri && <Text style={styles.fileSelectedText}>Image selected ✓</Text>}
                </View>

                <TouchableOpacity
                    style={[styles.submitBtn, uploading && styles.disabledBtn]}
                    onPress={submitWork}
                    disabled={uploading}
                >
                    <Text style={styles.submitBtnText}>{uploading ? 'Submitting...' : 'Submit Now'}</Text>
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
    content: { padding: 16 },
    taskTitle: { fontSize: 22, color: '#FFD700', fontWeight: 'bold', marginBottom: 24 },
    label: { fontSize: 16, color: '#E2E8F0', marginBottom: 8 },
    textInput: { backgroundColor: '#2D3748', color: '#fff', borderRadius: 8, padding: 16, fontSize: 16, minHeight: 120, borderWidth: 1, borderColor: '#4A5568', marginBottom: 24 },
    attachmentSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
    attachButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4A5568', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 },
    attachText: { color: '#E2E8F0', marginLeft: 8, fontSize: 16, fontWeight: 'bold' },
    fileSelectedText: { color: '#38A169', marginLeft: 16, fontSize: 14 },
    submitBtn: { backgroundColor: '#3182CE', padding: 16, borderRadius: 8, alignItems: 'center' },
    disabledBtn: { backgroundColor: '#4A5568' },
    submitBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default SubmitTaskScreen;
