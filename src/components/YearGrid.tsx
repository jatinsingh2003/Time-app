import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, useWindowDimensions, Platform } from 'react-native';
import Dot from './Dot';

interface YearGridProps {
    progress: {
        dayOfYear: number;
        totalDays: number;
        daysRemaining: number;
    };
    textColor?: string;
}

export default function YearGrid({ progress, textColor = '#000' }: YearGridProps) {
    const { width } = useWindowDimensions();

    // Responsive Layout Constants
    const isTablet = width > 600;
    const MAX_CONTENT_WIDTH = 600;
    const horizontalPadding = 20;

    // Constrain the grid width on tablets
    const contentWidth = Math.min(width, MAX_CONTENT_WIDTH) - (horizontalPadding * 2);

    const targetCols = width < 350 ? 15 : (isTablet ? 25 : 20);
    const numColumns = targetCols;
    const dotMargin = 2; // total horizontal margin per dot (1+1)

    const itemSize = contentWidth / numColumns;
    const dotSize = Math.floor(itemSize - dotMargin * 2);

    const dotsData = useMemo(() => {
        return Array.from({ length: progress.totalDays }, (_, i) => ({
            id: i,
            filled: i < progress.dayOfYear - 1,
            isToday: i === progress.dayOfYear - 1,
        }));
    }, [progress]);

    const renderItem = (item: any) => (
        <View key={item.id} style={{ width: itemSize, height: itemSize, alignItems: 'center', justifyContent: 'center' }}>
            <Dot filled={item.filled} isToday={item.isToday} size={dotSize} />
        </View>
    );

    // Typography Scaling
    const bigNumberSize = Math.min(width * 0.2, 120);
    const subtitleSize = Math.max(14, bigNumberSize * 0.15);

    return (
        <View style={{ width: Math.min(width, MAX_CONTENT_WIDTH), paddingHorizontal: horizontalPadding, alignItems: 'center' }}>
            <View style={styles.header}>
                <Text style={[styles.bigNumber, { fontSize: bigNumberSize, lineHeight: bigNumberSize, color: textColor }]}>
                    {progress.daysRemaining}
                </Text>
                <Text style={[styles.subtitle, { fontSize: subtitleSize }]}>DAYS LEFT</Text>
                <Text style={styles.miniDetail}>Day {progress.dayOfYear} of {progress.totalDays}</Text>
            </View>

            <View style={[styles.grid, { flexDirection: 'row', flexWrap: 'wrap' }]}>
                {dotsData.map((item) => renderItem(item))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        marginTop: '5%',
        marginBottom: '5%',
        alignItems: 'center',
    },
    bigNumber: {
        fontWeight: '900',
        color: '#000',
        letterSpacing: -2,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
    subtitle: {
        fontWeight: '600',
        letterSpacing: 4,
        color: '#666',
        marginTop: 0,
    },
    miniDetail: {
        fontSize: 12,
        color: '#999',
        marginTop: 10,
    },
    grid: {
        alignItems: 'center',
        justifyContent: 'center', // Center the grid
        paddingBottom: 40,
    },
});
