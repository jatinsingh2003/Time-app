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
//     goalDayOfYear?: number;
//     goalMode?: boolean;
//     wallpaperMatch?: boolean;
// }

// export default function YearGrid({
//     progress,
//     textColor = '#000',
//     showHeader = true,
//     style,
//     goalDayOfYear,
//     goalMode = false,
//     wallpaperMatch = false,
// }: YearGridProps) {
//     const { width, height, scale } = useWindowDimensions();

//     const MAX_CONTENT_WIDTH = 600;
//     const horizontalPadding = 30;
//     const verticalPadding = 140;

//     const contentWidth = wallpaperMatch
//         ? width
//         : Math.min(width, MAX_CONTENT_WIDTH) - horizontalPadding * 2;
//     const totalDots = goalMode && goalDayOfYear ? goalDayOfYear - progress.dayOfYear + 1 : progress.totalDays;
//     const numColumns = wallpaperMatch ? 15 : width < 350 ? 12 : 15;
//     const numRows = Math.ceil(totalDots / numColumns);

//     const dpToPx = (dp: number) => Math.round(dp * scale);
//     const wallpaperFooterSpace = goalMode ? dpToPx(120) : dpToPx(80);
//     const availableHeight = wallpaperMatch ? height - wallpaperFooterSpace : height - verticalPadding;
//     const widthItemSize = contentWidth / numColumns;
//     const heightItemSize = availableHeight / numRows;
//     const itemSize = Math.min(widthItemSize, heightItemSize);
//     const dotSize = wallpaperMatch ? itemSize * 0.6 : itemSize * 0.6;

//     const dotsData = useMemo(() => {
//         return Array.from({ length: totalDots }, (_, i) => {
//             const dayNum = goalMode && goalDayOfYear ? progress.dayOfYear + i : i + 1;

//             if (goalMode && goalDayOfYear) {
//                 const isToday = dayNum === progress.dayOfYear;
//                 const isGoal = dayNum === goalDayOfYear;
//                 const isFuture = !isToday && !isGoal;

//                 return { id: i, isPast: false, isToday, isGoal, isFuture };
//             }

//             return {
//                 id: i,
//                 isPast: i < progress.dayOfYear - 1,
//                 isToday: i === progress.dayOfYear - 1,
//                 isGoal: goalDayOfYear !== undefined && i === goalDayOfYear - 1,
//                 isFuture: false,
//             };
//         });
//     }, [totalDots, progress.dayOfYear, goalDayOfYear, goalMode]);

//     const getDotColor = (item: {
//         isPast: boolean;
//         isToday: boolean;
//         isGoal: boolean;
//         isFuture: boolean;
//     }) => {
//         if (item.isGoal) return '#FF3B30';
//         if (item.isToday) return '#FF9500';
//         if (item.isPast) return '#FFFFFF';
//         return '#333333';
//     };

//     const daysToGoal = goalMode && goalDayOfYear
//         ? goalDayOfYear - progress.dayOfYear
//         : progress.daysRemaining;

//     const percentage = goalMode && goalDayOfYear
//         ? Math.round(((progress.dayOfYear - 1) / goalDayOfYear) * 100)
//         : Math.round((progress.dayOfYear / progress.totalDays) * 100);

//     return (
//         <View
//             style={[
//                 {
//                     width: wallpaperMatch ? width : Math.min(width, MAX_CONTENT_WIDTH),
//                     paddingHorizontal: wallpaperMatch ? 0 : horizontalPadding,
//                     alignItems: 'center',
//                 },
//                 style,
//             ]}
//         >
//             <View
//                 style={[
//                     styles.grid,
//                     {
//                         width: contentWidth,
//                         flexDirection: 'row',
//                         flexWrap: 'wrap',
//                         justifyContent: wallpaperMatch ? 'flex-start' : 'center',
//                     },
//                 ]}
//             >
//                 {dotsData.map((item) => (
//                     <View
//                         key={item.id}
//                         style={{ width: itemSize, height: itemSize, alignItems: 'center', justifyContent: 'center' }}
//                     >
//                         <View
//                             style={{
//                                 width: dotSize,
//                                 height: dotSize,
//                                 borderRadius: dotSize / 2,
//                                 backgroundColor: getDotColor(item),
//                             }}
//                         />
//                     </View>
//                 ))}
//             </View>

//             <View style={styles.footer}>
//                 <Text style={styles.footerText}>
//                     {goalMode
//                         ? `${daysToGoal}D left · ${percentage}%`
//                         : `${progress.daysRemaining}D left · ${percentage}%`}
//                 </Text>
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     grid: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingBottom: 12,
//     },
//     footer: {
//         marginTop: 8,
//         alignItems: 'center',
//     },
//     footerText: {
//         fontSize: 15,
//         fontWeight: '700',
//         color: '#FF9500',
//         letterSpacing: 0.5,
//         fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
//     },
// });
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
    goalStartDayOfYear?: number; // day the goal was originally set
    goalMode?: boolean;
    wallpaperMatch?: boolean;
}

export default function YearGrid({
    progress,
    textColor = '#000',
    showHeader = true,
    style,
    goalDayOfYear,
    goalStartDayOfYear,
    goalMode = false,
    wallpaperMatch = false,
}: YearGridProps) {
    const { width, height, scale } = useWindowDimensions();

    const MAX_CONTENT_WIDTH = 600;
    const horizontalPadding = 30;
    const verticalPadding = 140;

    const contentWidth = wallpaperMatch
        ? width
        : Math.min(width, MAX_CONTENT_WIDTH) - horizontalPadding * 2;

    // In goal mode: dots go from goalStartDayOfYear → goalDayOfYear
    // If no start day saved, fall back to dayOfYear (today) so at minimum today→goal shows
    const goalStart = (goalMode && goalStartDayOfYear) ? goalStartDayOfYear : progress.dayOfYear;

    const totalDots = goalMode && goalDayOfYear
        ? goalDayOfYear - goalStart + 1
        : progress.totalDays;

    const numColumns = wallpaperMatch ? 15 : width < 350 ? 12 : 15;
    const numRows = Math.ceil(totalDots / numColumns);

    const dpToPx = (dp: number) => Math.round(dp * scale);
    const wallpaperFooterSpace = goalMode ? dpToPx(120) : dpToPx(80);
    const availableHeight = wallpaperMatch ? height - wallpaperFooterSpace : height - verticalPadding;
    const widthItemSize = contentWidth / numColumns;
    const heightItemSize = availableHeight / numRows;
    const itemSize = Math.min(widthItemSize, heightItemSize);
    const dotSize = itemSize * 0.6;

    const dotsData = useMemo(() => {
        return Array.from({ length: totalDots }, (_, i) => {
            if (goalMode && goalDayOfYear) {
                // dayNum goes from goalStart → goalDayOfYear
                const dayNum = goalStart + i;
                const isGoal = dayNum === goalDayOfYear;
                const isToday = dayNum === progress.dayOfYear;
                const isPast = dayNum < progress.dayOfYear && !isGoal;
                const isFuture = !isPast && !isToday && !isGoal;

                return { id: i, isPast, isToday, isGoal, isFuture };
            }

            // Normal year mode
            return {
                id: i,
                isPast: i < progress.dayOfYear - 1,
                isToday: i === progress.dayOfYear - 1,
                isGoal: goalDayOfYear !== undefined && i === goalDayOfYear - 1,
                isFuture: false,
            };
        });
    }, [totalDots, goalStart, progress.dayOfYear, goalDayOfYear, goalMode]);

    const getDotColor = (item: {
        isPast: boolean;
        isToday: boolean;
        isGoal: boolean;
        isFuture: boolean;
    }) => {
        if (item.isGoal) return '#FF3B30'; // red
        if (item.isToday) return '#FF9500'; // orange
        if (item.isPast) return '#FFFFFF'; // white
        return '#333333';                    // grey (future)
    };

    const daysToGoal = goalMode && goalDayOfYear
        ? goalDayOfYear - progress.dayOfYear
        : progress.daysRemaining;

    const percentage = goalMode && goalDayOfYear
        ? Math.round(((progress.dayOfYear - goalStart) / (goalDayOfYear - goalStart)) * 100)
        : Math.round((progress.dayOfYear / progress.totalDays) * 100);

    return (
        <View
            style={[
                {
                    width: wallpaperMatch ? width : Math.min(width, MAX_CONTENT_WIDTH),
                    paddingHorizontal: wallpaperMatch ? 0 : horizontalPadding,
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
                        justifyContent: wallpaperMatch ? 'flex-start' : 'center',
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