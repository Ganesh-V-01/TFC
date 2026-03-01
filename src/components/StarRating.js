import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const StarRating = ({ rating, onChange, readonly = false, maxStars = 5 }) => {
    return (
        <View style={styles.container}>
            {[...Array(maxStars)].map((_, index) => {
                const starNumber = index + 1;
                const isActive = starNumber <= rating;

                if (readonly) {
                    return (
                        <Icon
                            key={index}
                            name={isActive ? "star" : "star-outline"}
                            size={24}
                            color="#FFD700"
                            style={styles.star}
                        />
                    );
                }

                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => onChange && onChange(starNumber)}
                    >
                        <Icon
                            name={isActive ? "star" : "star-outline"}
                            size={32}
                            color="#FFD700"
                            style={styles.star}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    star: {
        marginRight: 4,
    }
});

export default StarRating;
