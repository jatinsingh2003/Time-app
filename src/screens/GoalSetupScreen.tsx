import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, useWindowDimensions, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveConfig, getConfig, AppConfig } from '../storage/storage';
import { getGoalProgress } from '../utils/dateUtils';
import GoalDisplay from '../components/GoalDisplay';
import { useNavigation } from '@react-navigation/native';

export default function GoalSetupScreen() {
    const { width } = useWindowDimensions();
    const navigation = useNavigation<any>();
    const [config, setConfig] = useState<AppConfig | null>(null);
    const [title, setTitle] = useState('');
    const [dateStr, setDateStr] = useState(''); // YYYY-MM-DD for simplicity in MVP
    const [daysLeft, setDaysLeft] = useState<number | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getConfig();
        setConfig(data);
        if (data.goalTitle) setTitle(data.goalTitle);
        if (data.goalDate) {
            setDateStr(data.goalDate);
            const progress = getGoalProgress(data.goalDate);
            setDaysLeft(progress.daysRemaining);
        }
    };

    const handleSave = async () => {
        if (!title || !dateStr) return;
        // Basic format validation
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateStr)) {
            alert('Format: YYYY-MM-DD');
            return;
        }

        const newConfig: AppConfig = {
            ...config,
            selectedMode: 'goal',
            goalTitle: title,
            goalDate: dateStr,
            theme: config?.theme || 'dark', // Fallback
            accentColor: config?.accentColor || '#fff', // Fallback
        } as AppConfig;

        await saveConfig(newConfig);
        setConfig(newConfig);
        const progress = getGoalProgress(dateStr);
        setDaysLeft(progress.daysRemaining);
        Keyboard.dismiss();
    };

    const maxContentWidth = 600;
    const horizontalPadding = 20;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }} keyboardShouldPersistTaps="handled">
                <View style={{ width: Math.min(width, maxContentWidth), paddingHorizontal: horizontalPadding }}>
                    <Text style={styles.header}>TARGET</Text>

                    <GoalDisplay daysLeft={daysLeft} />

                    {daysLeft !== null && (
                        <TouchableOpacity
                            style={styles.wallpaperButton}
                            onPress={() => navigation.navigate('WallpaperGenerator', { mode: 'goal', data: { daysLeft } })}
                        >
                            <Text style={styles.buttonText}>SET AS WALLPAPER</Text>
                        </TouchableOpacity>
                    )}

                    <View style={styles.form}>
                        <TextInput
                            style={styles.input}
                            placeholder="Goal Title (e.g. Launch TimeApp)"
                            value={title}
                            onChangeText={setTitle}
                            placeholderTextColor="#999"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="YYYY-MM-DD"
                            value={dateStr}
                            onChangeText={setDateStr}
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                        />

                        <TouchableOpacity style={styles.button} onPress={handleSave}>
                            <Text style={styles.buttonText}>SET GOAL</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: '900',
        marginVertical: 40,
        textTransform: 'uppercase',
        letterSpacing: 2,
        textAlign: 'center',
    },
    form: {
        width: '100%',
        marginTop: 40,
    },
    input: {
        borderBottomWidth: 2,
        borderBottomColor: '#000',
        paddingVertical: 10,
        fontSize: 18,
        marginBottom: 20,
        color: '#000',
    },
    button: {
        backgroundColor: '#000',
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
        borderRadius: 4,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    wallpaperButton: {
        backgroundColor: '#333',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        alignSelf: 'center',
        marginBottom: 20,
    },
});
