import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, StatusBar, Platform, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import YearGrid from '../components/YearGrid';
import LifeGrid from '../components/LifeGrid';
import GoalDisplay from '../components/GoalDisplay';
import { getYearProgress, getWeekProgress, getGoalProgress, getLifeProgress } from '../utils/dateUtils';
import { getConfig, AppConfig } from '../storage/storage';

interface CalendarCardProps {
    title: string;
    description: string;
    buttonText?: string;
    onButtonPress: () => void;
    onCardPress: () => void;
    icon?: string;
}

const CalendarCard = ({ title, description, buttonText = "Set Wallpaper", onButtonPress, onCardPress, icon = "calendar-outline" }: CalendarCardProps) => (
    <TouchableOpacity style={styles.card} onPress={onCardPress} activeOpacity={0.7}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
        <TouchableOpacity style={styles.cardButton} onPress={onButtonPress}>
            <Ionicons name={icon as any} size={20} color="#000" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
    </TouchableOpacity>
);

export default function HomeScreen() {
    const { width } = useWindowDimensions();
    const navigation = useNavigation<any>();

    const [viewMode, setViewMode] = useState<'year' | 'life' | 'goal'>('year');
    const [yearProgress, setYearProgress] = useState(getYearProgress());
    const [weekProgress, setWeekProgress] = useState(getWeekProgress());
    const [lifeProgress, setLifeProgress] = useState(getLifeProgress());
    const [config, setConfig] = useState<AppConfig | null>(null);
    const [daysLeftToGoal, setDaysLeftToGoal] = useState<number | null>(null);

    const loadData = useCallback(async () => {
        const data = await getConfig();
        setConfig(data);
        if (data && data.goalDate) {
            const goal = getGoalProgress(data.goalDate);
            setDaysLeftToGoal(goal.daysRemaining);
        } else {
            setDaysLeftToGoal(null);
        }
        setYearProgress(getYearProgress());
        setWeekProgress(getWeekProgress());
        setLifeProgress(getLifeProgress(data.birthDate || '1995-01-01'));
    }, []);

    const handleEmailSupport = () => {
        const email = 'croodking465@gmail.com';
        const subject = 'TimeApp Support';
        const body = 'Hello, I have a query regarding TimeApp:';
        const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        Linking.canOpenURL(url)
            .then((supported) => {
                if (!supported) {
                    Alert.alert('Error', 'No email app available on this device.');
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch((err) => console.error('An error occurred', err));
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            {/* 1. Navbar */}
            <View style={styles.navbar}>
                <View style={styles.logoSlot}>
                    <Ionicons name="hourglass-outline" size={24} color="#fff" />
                </View>
                <Text style={styles.appName}>TimeApp</Text>
                <View style={{ width: 44 }} /> {/* Spacer for balance */}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* 2. Compact Preview Section */}
                <View style={styles.previewSection}>
                    <Text style={styles.previewLabel}>WALLPAPER PREVIEW</Text>
                    <View style={[
                        styles.compactPreviewWrapper,
                        viewMode === 'goal' && { justifyContent: 'flex-end', paddingBottom: 40 }
                    ]}>
                        {/* Mockup Status Bar */}
                        <View style={styles.mockupStatusBar}>
                            <Text style={styles.mockupStatusText}>00:12</Text>
                            <View style={styles.mockupIcons}>
                                <Ionicons name="cellular" size={12} color="#fff" style={{ marginRight: 4 }} />
                                <Ionicons name="wifi" size={12} color="#fff" style={{ marginRight: 4 }} />
                                <Ionicons name="battery-full" size={14} color="#fff" />
                            </View>
                        </View>

                        {/* Grid with Overlaid Clock */}
                        <View style={styles.mockupContentWrapper}>
                            {viewMode === 'year' && (
                                <View style={styles.scaleContainer}>
                                    <YearGrid
                                        progress={yearProgress}
                                        showHeader={true}
                                        textColor="#fff"
                                    />
                                </View>
                            )}
                            {viewMode === 'life' && (
                                <View style={styles.scaleContainer}>
                                    <LifeGrid
                                        progress={lifeProgress}
                                        showHeader={true}
                                        textColor="#fff"
                                    />
                                </View>
                            )}

                            {/* Mockup Clock Overlay */}
                            <View style={styles.mockupClockOverlay}>
                                <Text style={styles.mockupClockText}>00:12</Text>
                                <View style={styles.mockupDateContainer}>
                                    <Text style={styles.mockupDateText}>19 Feb</Text>
                                    <Text style={styles.mockupDayText}>Thu</Text>
                                </View>
                            </View>
                        </View>

                        {viewMode === 'goal' && (
                            <TouchableOpacity
                                style={styles.compactGoalWrapper}
                                onPress={() => navigation.navigate('Goal')}
                                activeOpacity={0.6}
                            >
                                <Text style={styles.compactGoalTitle}>{config?.goalTitle || 'Goal'}</Text>
                                <GoalDisplay daysLeft={daysLeftToGoal} textColor="#fff" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* 3. Calendar Selection Cards */}
                <View style={styles.cardsContainer}>
                    <CalendarCard
                        title="Life calendar"
                        description="Each dot is a week in your life."
                        onCardPress={() => setViewMode('life')}
                        onButtonPress={() => navigation.navigate('WallpaperGenerator', { mode: 'life', data: lifeProgress })}
                    />

                    <CalendarCard
                        title="Daily calendar"
                        description="Each dot is a day in this year."
                        onCardPress={() => setViewMode('year')}
                        onButtonPress={() => navigation.navigate('WallpaperGenerator', { mode: 'year', data: yearProgress })}
                    />

                    <CalendarCard
                        title="Goal calendar"
                        description={daysLeftToGoal !== null ? `Tracking: ${config?.goalTitle || 'your goal'}` : "Set a deadline and track it."}
                        onCardPress={() => setViewMode('goal')}
                        buttonText={daysLeftToGoal === null ? "Set Goal" : "Edit / Wallpaper"}
                        onButtonPress={() => {
                            navigation.navigate('Goal');
                        }}
                    />

                    {/* <CalendarCard
                        title="About TimeApp"
                        description="Visualize your most precious resource."
                        icon="information-circle-outline"
                        onCardPress={() => { }}
                        buttonText="Learn More"
                        onButtonPress={() => { }}
                    /> */}

                    <CalendarCard
                        title="Contact Us"
                        description="Have feedback or need help?"
                        icon="mail-outline"
                        onCardPress={handleEmailSupport}
                        buttonText="Email Support"
                        onButtonPress={handleEmailSupport}
                    />
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
    scrollContent: {
        paddingBottom: 40,
        paddingTop: 10,
    },
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 60,
        backgroundColor: '#000',
    },
    logoSlot: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1C1C1E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    appName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 1,
    },
    previewSection: {
        height: 650,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    previewLabel: {
        color: '#666',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 10,
    },
    compactPreviewWrapper: {
        width: '94%',
        height: 600,
        backgroundColor: '#000',
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#333',
        overflow: 'hidden',
        alignItems: 'center',
    },
    mockupStatusBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 25,
        paddingTop: 12,
        alignItems: 'center',
    },
    mockupStatusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    mockupIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mockupClockContainer: {
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 0,
    },
    mockupContentWrapper: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        position: 'relative',
    },
    mockupClockOverlay: {
        position: 'absolute',
        top: 60,
        flexDirection: 'row',
        alignItems: 'center',
    },
    mockupClockText: {
        color: '#fff',
        fontSize: 72,
        fontWeight: '300',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-light',
    },
    mockupDateContainer: {
        marginLeft: 15,
        paddingLeft: 15,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
    },
    mockupDateText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    mockupDayText: {
        color: '#aaa',
        fontSize: 14,
        fontWeight: '400',
    },
    scaleContainer: {
        transform: [{ scale: 0.85 }],
        width: '120%',
        alignItems: 'center',
        marginTop: -40, // Pull grid up into the clock area to clear space at bottom
    },
    compactGoalWrapper: {
        alignItems: 'center',
        transform: [{ scale: 1.0 }],
    },
    compactGoalTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: -5,
    },
    headerGrid: {
        maxHeight: 250,
        overflow: 'hidden',
    },
    goalHeaderWrapper: {
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    goalTitleText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 5,
    },
    editHintText: {
        color: '#888',
        fontSize: 12,
        marginTop: -10,
        fontWeight: '500',
    },
    setGoalPrompt: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        backgroundColor: '#1C1C1E',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#333',
        borderStyle: 'dashed',
    },
    setGoalText: {
        color: '#FF9500',
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
    },
    statsRow: {
        marginTop: 10,
    },
    statsText: {
        color: '#888',
        fontSize: 16,
        fontWeight: '500',
    },
    highlight: {
        color: '#FF9500', // Orange-ish as seen in the screenshot partially
    },
    cardsContainer: {
        paddingHorizontal: 16,
        gap: 16,
    },
    card: {
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        padding: 20,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    cardDescription: {
        color: '#AAAAAA',
        fontSize: 15,
        marginBottom: 20,
    },
    cardButton: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 25,
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: '#000',
        fontWeight: '700',
        fontSize: 15,
    }
});
