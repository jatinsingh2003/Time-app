import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, useWindowDimensions, TouchableOpacity, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import YearGrid from '../components/YearGrid';
import { getYearProgress } from '../utils/dateUtils';
import { useNavigation } from '@react-navigation/native';

export default function YearDotsScreen() {
    const { width } = useWindowDimensions();
    const [progress, setProgress] = useState(getYearProgress());
    const navigation = useNavigation<any>();

    useEffect(() => {
        const update = () => setProgress(getYearProgress());
        update();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={[styles.contentContainer, { width: width }]}>
                <ScrollView contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }}>
                    <YearGrid progress={progress} />

                    <TouchableOpacity
                        style={styles.wallpaperButton}
                        onPress={() => navigation.navigate('WallpaperGenerator', { mode: 'year', data: progress })}
                    >
                        <Text style={styles.buttonText}>SET AS WALLPAPER</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flex: 1,
    },
    wallpaperButton: {
        marginTop: 20,
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
