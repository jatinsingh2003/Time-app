import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Platform } from 'react-native';

interface GoalDisplayProps {
    daysLeft: number | null;
    textColor?: string;
}

export default function GoalDisplay({ daysLeft, textColor = '#000' }: GoalDisplayProps) {
    const { width } = useWindowDimensions();

    const bigNumberSize = Math.min(width * 0.1, 50);
    const labelSize = 10;

    if (daysLeft === null) return null;

    return (
        <View style={styles.counterContainer}>
            <Text style={[styles.counter, { fontSize: bigNumberSize, lineHeight: bigNumberSize, color: textColor }]}>
                {daysLeft} <Text style={[styles.counterLabel, { fontSize: labelSize, color: textColor }]}>DAYS TO GO</Text>
            </Text>
            {/* We could add logic here for passed days if the goal had a start date */}
        </View>
    );
}

const styles = StyleSheet.create({
    counterContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    counter: {
        fontWeight: '900',
        letterSpacing: -1,
    },
    counterLabel: {
        fontWeight: '600',
        letterSpacing: 2,
        opacity: 0.6,
        marginLeft: 8,
    },
    passedText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
        opacity: 0.5,
        marginTop: 4,
        textAlign: 'center',
    },
});

