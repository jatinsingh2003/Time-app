import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, useWindowDimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getWeekProgress } from '../utils/dateUtils';
import WeeksGrid from '../components/WeeksGrid';
import { useNavigation } from '@react-navigation/native';

export default function WeeksViewScreen() {
    const { width } = useWindowDimensions();
    const [progress, setProgress] = useState(getWeekProgress());
    const navigation = useNavigation<any>();

    useEffect(() => {
        setProgress(getWeekProgress());
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
                <WeeksGrid progress={progress} />

                <TouchableOpacity
                    style={styles.wallpaperButton}
                    onPress={() => navigation.navigate('WallpaperGenerator', { mode: 'weeks', data: progress })}
                >
                    <Text style={styles.buttonText}>SET AS WALLPAPER</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    wallpaperButton: {
        marginVertical: 20,
        backgroundColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1,
    }
});
