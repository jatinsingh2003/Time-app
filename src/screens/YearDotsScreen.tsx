import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, useWindowDimensions, TouchableOpacity, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import YearGrid from '../components/YearGrid';
import { getYearProgress } from '../utils/dateUtils';
import { getConfig } from '../storage/storage';
import { useNavigation } from '@react-navigation/native';

function getGoalDayOfYear(dateStr: string): number {
    if (!dateStr) return -1;
    const goalDate = new Date(dateStr);
    const start = new Date(goalDate.getFullYear(), 0, 0);
    const diff = goalDate.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function YearDotsScreen() {
    const { width } = useWindowDimensions();
    const [progress, setProgress] = useState(getYearProgress());
    const [goalDayOfYear, setGoalDayOfYear] = useState<number | undefined>(undefined);
    const navigation = useNavigation<any>();

    useEffect(() => {
        setProgress(getYearProgress());
        // Load goal date from storage and convert to day-of-year
        getConfig().then(config => {
            if (config?.goalDate) {
                const gd = getGoalDayOfYear(config.goalDate);
                if (gd > 0) setGoalDayOfYear(gd);
            }
        });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <View style={[styles.contentContainer, { width }]}>
                <ScrollView contentContainerStyle={{ alignItems: 'center', flexGrow: 1, paddingVertical: 20 }}>
                    <YearGrid
                        progress={progress}
                        textColor="#fff"
                        goalDayOfYear={goalDayOfYear}
                    />

                    <TouchableOpacity
                        style={styles.wallpaperButton}
                        onPress={() => navigation.navigate('WallpaperGenerator', { mode: 'year', data: progress })}
                    >
                        <Text style={styles.buttonText}>⚡ SET AS LIVE WALLPAPER</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    contentContainer: {
        flex: 1,
    },
    wallpaperButton: {
        marginTop: 24,
        backgroundColor: '#1C1C1E',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#FF9500',
    },
    buttonText: {
        color: '#FF9500',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1,
    }
});
