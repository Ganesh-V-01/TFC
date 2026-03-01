import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { firebaseFirestore } from '../services/firebase';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';

const TasksScreen = ({ navigation }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = firebaseFirestore()
            .collection('tasks')
            .orderBy('deadline', 'asc')
            .onSnapshot((querySnapshot) => {
                const tasksData = [];
                querySnapshot.forEach((documentSnapshot) => {
                    tasksData.push({
                        id: documentSnapshot.id,
                        ...documentSnapshot.data(),
                    });
                });
                setTasks(tasksData);
                setLoading(false);
            }, (error) => {
                console.error('Error fetching tasks:', error);
                setLoading(false);
            });

        return () => unsubscribe();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Assigned Tasks</Text>
            {tasks.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No tasks assigned yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TaskCard
                            title={item.title}
                            description={item.description}
                            deadline={item.deadline}
                            onPress={() => navigation.navigate('TaskDetail', { task: item })}
                        />
                    )}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A202C',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E2E8F0',
        padding: 16,
        paddingTop: 48,
    },
    listContainer: {
        paddingBottom: 24,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#A0AEC0',
        fontSize: 16,
    }
});

export default TasksScreen;
