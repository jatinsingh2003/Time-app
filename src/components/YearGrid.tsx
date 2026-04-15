// import React, { useMemo } from 'react';
// import { View, Text, StyleSheet, useWindowDimensions, Platform } from 'react-native';

// interface YearGridProps {
//     progress: {
//         dayOfYear: number;
//         totalDays: number;
//         daysRemaining: number;
//     };
//     textColor?: string;
//     showHeader?: boolean;
//     style?: any;
//     goalDayOfYear?: number; // shows a red dot at the goal date position
// }

// export default function YearGrid({ progress, textColor = '#000', showHeader = true, style, goalDayOfYear }: YearGridProps) {

//     const { width, height } = useWindowDimensions();

//     const MAX_CONTENT_WIDTH = 600;
//     const horizontalPadding = 30;
//     const verticalPadding = 140; // space for header + footer

//     const contentWidth = Math.min(width, MAX_CONTENT_WIDTH) - (horizontalPadding * 2);

//     const numColumns = width < 350 ? 12 : 15;
//     const numRows = Math.ceil(progress.totalDays / numColumns);

//     const availableHeight = height - verticalPadding;

//     const widthItemSize = contentWidth / numColumns;
//     const heightItemSize = availableHeight / numRows;

//     const itemSize = Math.min(widthItemSize, heightItemSize);
//     const dotMargin = itemSize * 0.2;
//     const dotSize = itemSize - (dotMargin * 2);

//     const dotsData = useMemo(() => {
//         return Array.from({ length: progress.totalDays }, (_, i) => ({
//             id: i,
//             filled: i < progress.dayOfYear - 1,
//             isToday: i === progress.dayOfYear - 1,
//             isGoal: goalDayOfYear !== undefined && i === goalDayOfYear - 1,
//         }));
//     }, [progress, goalDayOfYear]);

//     const getDotColor = (item: { filled: boolean; isToday: boolean; isGoal: boolean }) => {
//         if (item.isGoal) return '#FF3B30';   // red — goal date
//         if (item.isToday) return '#FF9500';  // orange — today
//         if (item.filled) return '#FFFFFF';   // white — past
//         return '#333333';                    // dark — future
//     };

//     const renderItem = (item: any) => (
//         <View key={item.id} style={{ width: itemSize, height: itemSize, alignItems: 'center', justifyContent: 'center' }}>
//             <View
//                 style={[
//                     styles.dot,
//                     {
//                         width: dotSize,
//                         height: dotSize,
//                         borderRadius: dotSize / 2,
//                         backgroundColor: getDotColor(item),
//                     }
//                 ]}
//             />
//         </View>
//     );

//     const percentage = Math.round((progress.dayOfYear / progress.totalDays) * 100);

//     return (
//         <View style={[{ width: Math.min(width, MAX_CONTENT_WIDTH), paddingHorizontal: horizontalPadding, alignItems: 'center' }, style]}>
//             <View style={[styles.grid, { width: contentWidth, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }]}>
//                 {dotsData.map((item) => renderItem(item))}
//             </View>

//             {/* Footer stat */}
//             <View style={styles.footer}>
//                 <Text style={styles.footerText}>
//                     {`${progress.daysRemaining}D left · ${percentage}%`}
//                 </Text>
//             </View>
//         </View>
//     );
// }


// const styles = StyleSheet.create(
//     {
//         grid: {
//             alignItems: 'center',
//             justifyContent: 'center',
//             paddingBottom: 12,
//         },
//         dot: {
//             // dynamic background color
//         },
//         footer: {
//             marginTop: 8,
//             alignItems: 'center',
//         },
//         footerText: {
//             fontSize: 15,
//             fontWeight: '700',
//             color: '#FF9500',
//             letterSpacing: 0.5,
//             fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//         },
//     }
// );
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Platform } from 'react-native';

interface YearGridProps {
    progress: {
        dayOfYear: number;
        totalDays: number;
        daysRemaining: number;
    };
    textColor?: string;
    showHeader?: boolean;
    style?: any;
    goalDayOfYear?: number;
    /**
     * When true, the grid shows ONLY the dots from Day 1 → goalDayOfYear.
     * Dot colours:
     *   - Before today  → white  (days already passed)
     *   - Today         → orange
     *   - After today   → grey   (days remaining)
     *   - Goal day      → red
     */
    goalMode?: boolean;
}

export default function YearGrid({
    progress,
    textColor = '#000',
    showHeader = true,
    style,
    goalDayOfYear,
    goalMode = false,
}: YearGridProps) {
    const { width, height } = useWindowDimensions();

    const MAX_CONTENT_WIDTH = 600;
    const horizontalPadding = 30;
    const verticalPadding = 140;

    const contentWidth = Math.min(width, MAX_CONTENT_WIDTH) - horizontalPadding * 2;

    // ── In goal mode we only render dots 1 … goalDayOfYear ──────────────────
    const totalDots = goalMode && goalDayOfYear ? goalDayOfYear - progress.dayOfYear + 1 : progress.totalDays;

    const numColumns = width < 350 ? 12 : 15;
    const numRows = Math.ceil(totalDots / numColumns);

    const availableHeight = height - verticalPadding;
    const widthItemSize = contentWidth / numColumns;
    const heightItemSize = availableHeight / numRows;
    const itemSize = Math.min(widthItemSize, heightItemSize);
    const dotMargin = itemSize * 0.2;
    const dotSize = itemSize - dotMargin * 2;

    // ── Build dot descriptors ────────────────────────────────────────────────
    const dotsData = useMemo(() => {
        return Array.from({ length: totalDots }, (_, i) => {
            const dayNum = goalMode && goalDayOfYear ? progress.dayOfYear + i : i + 1; // 1-based day of year
            if (goalMode && goalDayOfYear) {
                // i < dayOfYear - 1  → past (white)
                // i === dayOfYear - 1 → today (orange)
                // i === goalDayOfYear - 1 → goal (red)
                // else → remaining (grey)
                const isToday = dayNum === progress.dayOfYear;
                const isGoal = dayNum === goalDayOfYear;
                const isFuture = !isToday && !isGoal;
                return { id: i, isPast: false, isToday, isGoal, isFuture };
            } else {
                // Original year-mode colouring
                return {
                    id: i,
                    isPast: i < progress.dayOfYear - 1,
                    isToday: i === progress.dayOfYear - 1,
                    isGoal: goalDayOfYear !== undefined && i === goalDayOfYear - 1,
                    isFuture: false,
                };
            }
        });
    }, [totalDots, progress.dayOfYear, goalDayOfYear, goalMode]);

    const getDotColor = (item: {
        isPast: boolean;
        isToday: boolean;
        isGoal: boolean;
        isFuture: boolean;
    }) => {
        if (item.isGoal) return '#FF3B30'; // red   — goal day
        if (item.isToday) return '#FF9500'; // orange — today
        if (item.isPast) return '#FFFFFF'; // white  — already passed
        return '#333333';                    // grey   — future / remaining
    };

    // ── Footer text ──────────────────────────────────────────────────────────
    const daysToGoal = goalMode && goalDayOfYear
        ? goalDayOfYear - progress.dayOfYear
        : progress.daysRemaining;

    const percentage = goalMode && goalDayOfYear
        ? Math.round(((progress.dayOfYear - 1) / goalDayOfYear) * 100)
        : Math.round((progress.dayOfYear / progress.totalDays) * 100);

    return (
        <View
            style={[
                {
                    width: Math.min(width, MAX_CONTENT_WIDTH),
                    paddingHorizontal: horizontalPadding,
                    alignItems: 'center',
                },
                style,
            ]}
        >
            <View
                style={[
                    styles.grid,
                    { 
                        width: contentWidth, 
                        flexDirection: 'row', 
                        flexWrap: 'wrap', 
                        justifyContent: 'flex-start',
                        marginLeft: (contentWidth % (itemSize * numColumns)) / 2
                    },
                ]}
            >
                {dotsData.map((item) => (
                    <View
                        key={item.id}
                        style={{ width: itemSize, height: itemSize, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <View
                            style={{
                                width: dotSize,
                                height: dotSize,
                                borderRadius: dotSize / 2,
                                backgroundColor: getDotColor(item),
                            }}
                        />
                    </View>
                ))}
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    {goalMode
                        ? `${daysToGoal}D left · ${percentage}%`
                        : `${progress.daysRemaining}D left · ${percentage}%`}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 12,
    },
    footer: {
        marginTop: 8,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FF9500',
        letterSpacing: 0.5,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
});