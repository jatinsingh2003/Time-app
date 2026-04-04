import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, useWindowDimensions, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveConfig, getConfig, AppConfig } from '../storage/storage';
import { getGoalProgress } from '../utils/dateUtils';
import GoalDisplay from '../components/GoalDisplay';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

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
            <View style={styles.topHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }} keyboardShouldPersistTaps="handled">
                <View style={{ width: Math.min(width, maxContentWidth), paddingHorizontal: horizontalPadding }}>
                    <Text style={styles.header}>TARGET</Text>

                    <GoalDisplay daysLeft={daysLeft} textColor="#fff" />

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
        backgroundColor: '#000',
    },
    topHeader: {
        paddingHorizontal: 20,
        paddingTop: 10,
        alignItems: 'flex-end',
    },
    closeButton: {
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 20,
        textTransform: 'uppercase',
        letterSpacing: 2,
        textAlign: 'center',
        color: '#fff',
    },
    form: {
        width: '100%',
        marginTop: 40,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingVertical: 12,
        fontSize: 18,
        marginBottom: 25,
        color: '#fff',
    },
    button: {
        backgroundColor: '#fff',
        padding: 18,
        alignItems: 'center',
        marginTop: 20,
        borderRadius: 30,
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
        letterSpacing: 1,
        fontSize: 15,
    },
    wallpaperButton: {
        backgroundColor: '#1C1C1E',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        alignSelf: 'center',
        marginBottom: 20,
    },
});
