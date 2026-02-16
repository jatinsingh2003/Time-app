import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Platform } from 'react-native';

interface GoalDisplayProps {
    daysLeft: number | null;
    textColor?: string;
}

export default function GoalDisplay({ daysLeft, textColor = '#000' }: GoalDisplayProps) {
    const { width } = useWindowDimensions();

    const bigNumberSize = Math.min(width * 0.25, 120);
    const labelSize = Math.max(12, bigNumberSize * 0.15);

    if (daysLeft === null) return null;

    return (
        <View style={styles.counterContainer}>
            <Text style={[styles.counter, { fontSize: bigNumberSize, color: textColor }]}>{daysLeft}</Text>
            <Text style={[styles.counterLabel, { fontSize: labelSize }]}>DAYS TO GO</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    counterContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    counter: {
        fontWeight: '900',
    },
    counterLabel: {
        letterSpacing: 2,
        color: '#666',
    },
});
