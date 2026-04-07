import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Platform } from 'react-native';

interface LifeGridProps {
    progress: {
        weeksLived: number;
        totalWeeks: number;
        remainingWeeks: number;
    };
    textColor?: string;
    showHeader?: boolean;
    style?: any;
}

export default function LifeGrid({ progress, textColor = '#000', showHeader = true, style }: LifeGridProps) {
    const { width, height } = useWindowDimensions();

    const MAX_CONTENT_WIDTH = 600;
    const horizontalPadding = 30;
    const verticalPadding = 120; // More padding for life grid as it's very dense

    const contentWidth = Math.min(width, MAX_CONTENT_WIDTH) - (horizontalPadding * 2);

    // 52 columns for weeks
    const numColumns = 52;
    const numRows = Math.ceil(progress.totalWeeks / numColumns);
    
    const availableHeight = height - verticalPadding;

    const widthItemSize = contentWidth / numColumns;
    const heightItemSize = availableHeight / numRows;

    const itemSize = Math.min(widthItemSize, heightItemSize);
    const dotMargin = itemSize * 0.1; // Minimal margin to keep them visible but spaced
    const dotSize = itemSize - (dotMargin * 2);

    const dotsData = useMemo(() => {
        return Array.from({ length: progress.totalWeeks }, (_, i) => ({
            id: i,
            filled: i < progress.weeksLived,
            isThisWeek: i === progress.weeksLived,
        }));
    }, [progress]);

    const renderDot = (item: any) => (
        <View key={item.id} style={{ width: itemSize, height: itemSize, alignItems: 'center', justifyContent: 'center' }}>
            <View
                style={[
                    styles.dot,
                    {
                        width: dotSize,
                        height: dotSize,
                        borderRadius: dotSize / 2,
                        backgroundColor: item.isThisWeek ? '#FF9500' : (item.filled ? '#FFFFFF' : '#333333')
                    }
                ]}
            />
        </View>
    );

    return (
        <View style={[{ width: Math.min(width, MAX_CONTENT_WIDTH), paddingHorizontal: horizontalPadding, alignItems: 'center' }, style]}>
            <View style={[styles.grid, { width: contentWidth, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }]}>
                {dotsData.map(renderDot)}
            </View>

            {showHeader && (
                <View style={styles.header}>
                    <Text style={[styles.bigNumber, { fontSize: 16, color: '#FF9500' }]}>
                        {progress.remainingWeeks}w left · {Math.round((progress.weeksLived / progress.totalWeeks) * 100)}%
                    </Text>
                </View>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    header: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    bigNumber: {
        fontWeight: '900',
        letterSpacing: -1,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
    subtitle: {
        fontWeight: '600',
        letterSpacing: 2,
        color: '#666',
        marginLeft: 8,
    },
    passedText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
        opacity: 0.5,
        marginTop: 4,
    },
    grid: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 40,
    },
    dot: {
        // dynamic styles
    }
});

