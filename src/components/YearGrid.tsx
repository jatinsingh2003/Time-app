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
    showHeader?: boolean;
    style?: any;
}

export default function YearGrid({ progress, textColor = '#000', showHeader = true, style }: YearGridProps) {

    const { width, height } = useWindowDimensions();

    // Responsive Layout Constants
    const MAX_CONTENT_WIDTH = 600;
    const horizontalPadding = 30; // Increased padding for better look
    const verticalPadding = 100; // Leave space for headers/footers in the app

    // Constrain the grid width
    const contentWidth = Math.min(width, MAX_CONTENT_WIDTH) - (horizontalPadding * 2);
    
    // We want the grid to be more spaced out like the reference
    const numColumns = width < 350 ? 12 : 15;
    const numRows = Math.ceil(progress.totalDays / numColumns);
    
    // Calculate available height for the grid
    const availableHeight = height - verticalPadding;
    
    // Calculate itemSize based on both width and height to prevent overflow
    const widthItemSize = contentWidth / numColumns;
    const heightItemSize = availableHeight / numRows;
    
    const itemSize = Math.min(widthItemSize, heightItemSize);
    const dotMargin = itemSize * 0.2; // 20% margin for dots to be spaced out
    const dotSize = itemSize - (dotMargin * 2);


    const dotsData = useMemo(() => {
        return Array.from({ length: progress.totalDays }, (_, i) => ({
            id: i,
            filled: i < progress.dayOfYear - 1,
            isToday: i === progress.dayOfYear - 1,
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
                        backgroundColor: item.isToday ? '#FF9500' : (item.filled ? '#FFFFFF' : '#333333')
                    }
                ]}
            />
        </View>
    );


    return (
        <View style={[{ width: Math.min(width, MAX_CONTENT_WIDTH), paddingHorizontal: horizontalPadding, alignItems: 'center' }, style]}>
            <View style={[styles.grid, { width: contentWidth, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }]}>
                {dotsData.map((item) => renderItem(item))}
            </View>

            {showHeader && (
                <View style={styles.header}>
                    <Text style={[styles.bigNumber, { fontSize: 16, color: '#FF9500' }]}>
                        {progress.daysRemaining}d left · {Math.round((progress.dayOfYear / progress.totalDays) * 100)}%
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
        marginLeft: 4,
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
        paddingBottom: 20,
    },
    dot: {
        // dynamic background color
    }
});


