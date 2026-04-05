import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, useWindowDimensions, Platform } from 'react-native';

interface WeeksGridProps {
    progress: {
        currentWeek: number;
        totalWeeks: number;
        remainingWeeks: number;
    };
    textColor?: string;
}

interface WeekBlockProps {
    completed: boolean;
    isCurrent: boolean;
    size: number;
}

const WeekBlock = ({ completed, isCurrent, size }: WeekBlockProps) => (
    <View style={[
        styles.block,
        { width: size, height: size },
        completed && styles.completed,
        isCurrent && styles.current
    ]} />
);

export default function WeeksGrid({ progress, textColor = '#000' }: WeeksGridProps) {
    const { width } = useWindowDimensions();

    const isTablet = width > 600;
    const horizontalPadding = 20;
    const maxContentWidth = 600;
    const contentWidth = Math.min(width, maxContentWidth) - (horizontalPadding * 2);

    // 52 weeks layout logic
    const numColumns = isTablet ? 13 : 4;
    const gap = 10;
    const blockSize = (contentWidth - ((numColumns - 1) * gap)) / numColumns;

    const weeksData = useMemo(() => {
        return Array.from({ length: 52 }, (_, i) => ({
            id: i + 1,
            completed: i + 1 < progress.currentWeek,
            isCurrent: i + 1 === progress.currentWeek,
        }));
    }, [progress]);

    const renderItem = (item: any) => (
        <View key={item.id} style={{ marginBottom: gap }}>
            <WeekBlock completed={item.completed} isCurrent={item.isCurrent} size={blockSize} />
        </View>
    );

    return (
        <View style={{ width: Math.min(width, maxContentWidth), paddingHorizontal: horizontalPadding }}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: textColor }]}>52 WEEKS</Text>
                <Text style={styles.subtitle}>{'Week '}{progress.currentWeek}{' / 52'}</Text>
            </View>

            <View style={[styles.grid, { flexDirection: 'row', flexWrap: 'wrap', gap: gap }]}>
                {weeksData.map((item) => renderItem(item))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        marginVertical: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: '#000',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    grid: {
        paddingBottom: 20,
        justifyContent: 'flex-start', // Align items to start
    },
    block: {
        backgroundColor: '#eee',
        borderRadius: 4,
    },
    completed: {
        backgroundColor: '#000',
    },
    current: {
        borderWidth: 2,
        borderColor: '#000',
        backgroundColor: 'transparent',
    },
});
