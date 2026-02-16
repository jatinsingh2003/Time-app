import React, { memo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

interface DotProps {
    filled: boolean;
    isToday: boolean;
    size?: number;
}

// NO-OP default size, handled by parent
const DEFAULT_SIZE = 10;

const Dot = ({ filled, isToday, size = DEFAULT_SIZE }: DotProps) => {
    return (
        <View
            style={[
                styles.dot,
                { width: size, height: size, borderRadius: size / 2 },
                filled && styles.filled,
                isToday && styles.today,
            ]}
        />
    );
};

const styles = StyleSheet.create({
    dot: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#333',
        margin: 0,
    },
    filled: {
        backgroundColor: '#333',
    },
    today: {
        borderColor: '#000',
        borderWidth: 2,
        backgroundColor: 'transparent', // Or specific highlight
    },
});

export default memo(Dot);
