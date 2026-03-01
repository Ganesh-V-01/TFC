import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const TaskCard = ({ title, description, deadline, onPress, status }) => {
    const formattedDate = deadline?.toDate ? deadline.toDate().toLocaleDateString() : '';

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.header}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                {status && (
                    <View style={[styles.statusBadge,
                    status === 'approved' ? styles.approved :
                        status === 'rejected' ? styles.rejected : styles.pending
                    ]}>
                        <Text style={styles.statusText}>{status.toUpperCase()}</Text>
                    </View>
                )}
            </View>

            <Text style={styles.description} numberOfLines={2}>{description}</Text>

            <View style={styles.footer}>
                <Icon name="calendar-outline" size={16} color="#A0AEC0" />
                <Text style={styles.dateText}>Due: {formattedDate}</Text>
                <Icon name="chevron-forward" size={20} color="#FFD700" style={styles.arrowIcon} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#2D3748',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        color: '#E2E8F0',
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    pending: { backgroundColor: '#4A5568' },
    approved: { backgroundColor: '#38A169' },
    rejected: { backgroundColor: '#E53E3E' },
    statusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    description: {
        color: '#CBD5E0',
        fontSize: 14,
        marginBottom: 12,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        color: '#A0AEC0',
        fontSize: 12,
        marginLeft: 6,
        flex: 1,
    },
    arrowIcon: {
        marginLeft: 'auto',
    },
});

export default TaskCard;
