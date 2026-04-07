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
    const { width, height } = useWindowDimensions();

    const isTablet = width > 600;
    const horizontalPadding = 30;
    const maxContentWidth = 600;
    const verticalPadding = 150;

    const contentWidth = Math.min(width, maxContentWidth) - (horizontalPadding * 2);

    // 52 weeks layout logic
    const numColumns = isTablet ? 13 : 4;
    const numRows = Math.ceil(52 / numColumns);
    
    const availableHeight = height - verticalPadding;

    const widthItemSize = contentWidth / numColumns;
    const heightItemSize = availableHeight / numRows;

    const itemSize = Math.min(widthItemSize, heightItemSize);
    const dotMargin = itemSize * 0.15;
    const dotSize = itemSize - (dotMargin * 2);

    const weeksData = useMemo(() => {
        return Array.from({ length: 52 }, (_, i) => ({
            id: i + 1,
            completed: i + 1 < progress.currentWeek,
            isCurrent: i + 1 === progress.currentWeek,
        }));
    }, [progress]);

    const renderItem = (item: any) => (
        <View key={item.id} style={{ width: itemSize, height: itemSize, alignItems: 'center', justifyContent: 'center' }}>
            <View
                style={[
                    styles.dot,
                    {
                        width: dotSize,
                        height: dotSize,
                        borderRadius: dotSize / 2,
                        backgroundColor: item.isCurrent ? '#FF9500' : (item.completed ? '#FFFFFF' : '#333333')
                    }
                ]}
            />
        </View>
    );

    return (
        <View style={{ width: Math.min(width, maxContentWidth), paddingHorizontal: horizontalPadding, alignItems: 'center' }}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: textColor }]}>52 WEEKS</Text>
                <Text style={styles.subtitle}>{'Week '}{progress.currentWeek}{' / 52'}</Text>
            </View>

            <View style={[styles.grid, { width: contentWidth, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }]}>
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
    dot: {
        // dynamic styles
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
