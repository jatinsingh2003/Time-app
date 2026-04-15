// import React, { useState, useEffect, useCallback } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, StatusBar, Platform, Linking, Alert, Modal, NativeModules } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';

// import YearGrid from '../components/YearGrid';
// import LifeGrid from '../components/LifeGrid';
// import GoalDisplay from '../components/GoalDisplay';
// import { getYearProgress, getWeekProgress, getGoalProgress, getLifeProgress } from '../utils/dateUtils';
// import { getConfig, AppConfig, clearConfig } from '../storage/storage';

// function getGoalDayOfYear(dateStr: string): number {
//     if (!dateStr) return -1;
//     const goalDate = new Date(dateStr);
//     const start = new Date(goalDate.getFullYear(), 0, 0);
//     const diff = goalDate.getTime() - start.getTime();
//     return Math.floor(diff / (1000 * 60 * 60 * 24));
// }

// export default function HomeScreen() {
//     const { width, height } = useWindowDimensions();
//     const navigation = useNavigation<any>();

//     const [viewMode, setViewMode] = useState<'life' | 'year' | 'goal'>('life');
//     const [yearProgress, setYearProgress] = useState(getYearProgress());
//     const [lifeProgress, setLifeProgress] = useState(getLifeProgress());
//     const [config, setConfig] = useState<AppConfig | null>(null);
//     const [goalDayOfYear, setGoalDayOfYear] = useState<number | undefined>(undefined);
//     const [showSettings, setShowSettings] = useState(false);

//     const loadData = useCallback(async () => {
//         const data = await getConfig();
//         setConfig(data);
//         if (data && data.goalDate) {
//             const gd = getGoalDayOfYear(data.goalDate);
//             if (gd > 0) setGoalDayOfYear(gd);
//         } else {
//             setGoalDayOfYear(undefined);
//         }
//         setYearProgress(getYearProgress());
//         setLifeProgress(getLifeProgress(data.birthDate || '1995-01-01'));
//         if (data.selectedMode) {
//              setViewMode(data.selectedMode);
//         }
//     }, []);

//     useFocusEffect(
//         useCallback(() => {
//             loadData();
//         }, [loadData])
//     );

//     const handleSetLiveWallpaper = () => {
//         if (Platform.OS === 'android') {
//             if (NativeModules.LiveWallpaperModule) {
//                 const bDate = config?.birthDate || "1995-01-01";
//                 const gDate = config?.goalDate || "";
//                 const gTitle = config?.goalTitle || "";
//                 NativeModules.LiveWallpaperModule.setConfig(viewMode, bDate, gDate, gTitle);
//                 NativeModules.LiveWallpaperModule.openLiveWallpaperPicker();
//             } else {
//                 Alert.alert('Not Available', 'Live wallpaper native module not found.');
//             }
//         } else {
//             Alert.alert('Not Supported', 'Live wallpaper is only available on Android.');
//         }
//     };

//     const handleEmailSupport = () => {
//         const url = 'mailto:croodking465@gmail.com?subject=TimeApp Support';
//         Linking.openURL(url).catch(() => Alert.alert('Error', 'No email app available.'));
//     };

//     // Calculate grid height to take up remaining space
//     const gridContainerHeight = height - 250; // Approximations for Top + Bottom bars

//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar barStyle="light-content" backgroundColor="#000" />

//             {/* Top Bar with Segmented Control & Settings */}
//             <View style={styles.topBar}>
//                 <View style={{ width: 44 }} /> {/* Spacer */}

//                 <View style={styles.segmentControl}>
//                     <TouchableOpacity 
//                         style={[styles.segmentBtn, viewMode === 'life' && styles.segmentBtnActive]}
//                         onPress={() => setViewMode('life')}
//                     >
//                         <Text style={[styles.segmentText, viewMode === 'life' && styles.segmentTextActive]}>Life</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity 
//                         style={[styles.segmentBtn, viewMode === 'year' && styles.segmentBtnActive]}
//                         onPress={() => setViewMode('year')}
//                     >
//                         <Text style={[styles.segmentText, viewMode === 'year' && styles.segmentTextActive]}>Year</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity 
//                         style={[styles.segmentBtn, viewMode === 'goal' && styles.segmentBtnActive]}
//                         onPress={() => setViewMode('goal')}
//                     >
//                         <Text style={[styles.segmentText, viewMode === 'goal' && styles.segmentTextActive]}>Goal</Text>
//                     </TouchableOpacity>
//                 </View>

//                 <TouchableOpacity style={styles.settingsBtn} onPress={() => setShowSettings(true)}>
//                     <Ionicons name="settings-outline" size={24} color="#fff" />
//                 </TouchableOpacity>
//             </View>

//             {/* Center Grid Area */}
//             <View style={[styles.gridArea, { height: gridContainerHeight }]}>
//                 {viewMode === 'life' && (
//                     <LifeGrid progress={lifeProgress} showHeader={true} textColor="#fff" />
//                 )}

//                 {viewMode === 'year' && (
//                     <YearGrid progress={yearProgress} showHeader={true} textColor="#fff" />
//                 )}

//                 {viewMode === 'goal' && (
//                     <>
//                         {goalDayOfYear !== undefined ? (
//                             <View>
//                                 <View style={styles.goalTitleRow}>
//                                     <Text style={styles.goalTitle}>{config?.goalTitle || 'Target Goal'}</Text>
//                                     <TouchableOpacity style={styles.editGoalBtn} onPress={() => navigation.navigate('Goal')}>
//                                         <Ionicons name="pencil" size={18} color="#FF9500" />
//                                     </TouchableOpacity>
//                                 </View>
//                                 <YearGrid progress={yearProgress} showHeader={true} textColor="#fff" goalDayOfYear={goalDayOfYear} />
//                             </View>
//                         ) : (
//                             <View style={styles.emptyGoal}>
//                                 <Ionicons name="flag-outline" size={48} color="#666" style={{ marginBottom: 16 }} />
//                                 <Text style={styles.emptyGoalTitle}>No Goal Set</Text>
//                                 <Text style={styles.emptyGoalSub}>Set a specific date to track your progress towards a target.</Text>
//                                 <TouchableOpacity style={styles.setGoalBtn} onPress={() => navigation.navigate('Goal')}>
//                                     <Text style={styles.setGoalBtnText}>SET A GOAL</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         )}
//                     </>
//                 )}
//             </View>

//             {/* Huge Sticky Footer CTA */}
//             <View style={styles.footerArea}>
//                 <TouchableOpacity style={styles.liveWallpaperAction} onPress={handleSetLiveWallpaper}>
//                     <Ionicons name="flash" size={24} color="#000" />
//                     <Text style={styles.liveWallpaperActionText}>SET AS LIVE WALLPAPER</Text>
//                 </TouchableOpacity>
//             </View>


//             {/* Settings Modal (Action Sheet style) */}
//             <Modal visible={showSettings} transparent animationType="fade" onRequestClose={() => setShowSettings(false)}>
//                 <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowSettings(false)}>
//                     <View style={styles.settingsSheet}>
//                         <View style={styles.dragHandle} />
//                         <Text style={styles.sheetTitle}>Settings</Text>

//                         <TouchableOpacity style={styles.sheetOption} onPress={() => {
//                             setShowSettings(false);
//                             // Clear onboarding flag and config, then reload app to show onboarding
//                             clearConfig().then(() => {
//                                 navigation.replace('Onboarding');
//                             });
//                         }}>
//                             <View style={styles.sheetIconWrapper}><Ionicons name="calendar" size={24} color="#fff" /></View>
//                             <View>
//                                 <Text style={styles.sheetOptionTitle}>Edit Birthday</Text>
//                                 <Text style={styles.sheetOptionSub}>Recalculate your life calendar</Text>
//                             </View>
//                         </TouchableOpacity>

//                         <TouchableOpacity style={styles.sheetOption} onPress={() => { setShowSettings(false); navigation.navigate('Goal'); }}>
//                             <View style={styles.sheetIconWrapper}><Ionicons name="flag" size={24} color="#fff" /></View>
//                             <View>
//                                 <Text style={styles.sheetOptionTitle}>Edit Goal</Text>
//                                 <Text style={styles.sheetOptionSub}>Change your target date</Text>
//                             </View>
//                         </TouchableOpacity>

//                         <TouchableOpacity style={styles.sheetOption} onPress={() => { setShowSettings(false); handleEmailSupport(); }}>
//                             <View style={styles.sheetIconWrapper}><Ionicons name="mail" size={24} color="#fff" /></View>
//                             <View>
//                                 <Text style={styles.sheetOptionTitle}>Contact Support</Text>
//                                 <Text style={styles.sheetOptionSub}>Report a bug or suggest a feature</Text>
//                             </View>
//                         </TouchableOpacity>
//                     </View>
//                 </TouchableOpacity>
//             </Modal>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#000' },
//     topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 60 },
//     settingsBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },

//     // Segmented Control
//     segmentControl: { flexDirection: 'row', backgroundColor: '#1C1C1E', borderRadius: 20, padding: 4 },
//     segmentBtn: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 16 },
//     segmentBtnActive: { backgroundColor: '#333' },
//     segmentText: { color: '#666', fontSize: 14, fontWeight: '700' },
//     segmentTextActive: { color: '#fff' },

//     // Grid Area
//     gridArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//     goalTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20, marginTop: -20 },
//     goalTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginRight: 12 },
//     editGoalBtn: { padding: 4, backgroundColor: 'rgba(255, 149, 0, 0.1)', borderRadius: 12 },

//     // Empty Goal State
//     emptyGoal: { alignItems: 'center', justifyContent: 'center', padding: 40 },
//     emptyGoalTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
//     emptyGoalSub: { color: '#888', fontSize: 16, textAlign: 'center', marginBottom: 30, lineHeight: 24 },
//     setGoalBtn: { backgroundColor: '#FF9500', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 30 },
//     setGoalBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },

//     // Footer
//     footerArea: { paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 10 : 30, paddingTop: 10 },
//     liveWallpaperAction: { flexDirection: 'row', backgroundColor: '#FF9500', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, borderRadius: 24, shadowColor: '#FF9500', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 10 },
//     liveWallpaperActionText: { color: '#000', fontWeight: '900', fontSize: 16, letterSpacing: 1.5, marginLeft: 12 },

//     // Modal / Sheet
//     modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
//     settingsSheet: { backgroundColor: '#1C1C1E', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 24, paddingBottom: 50, paddingTop: 16 },
//     dragHandle: { width: 40, height: 5, backgroundColor: '#333', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
//     sheetTitle: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 24 },
//     sheetOption: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
//     sheetIconWrapper: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
//     sheetOptionTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
//     sheetOptionSub: { color: '#888', fontSize: 14, marginTop: 4 },
// });
import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, useWindowDimensions,
    StatusBar, Platform, Linking, Alert, Modal, NativeModules, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import YearGrid from '../components/YearGrid';
import LifeGrid from '../components/LifeGrid';
import GoalDisplay from '../components/GoalDisplay';
import { getYearProgress, getWeekProgress, getGoalProgress, getLifeProgress } from '../utils/dateUtils';
import { getConfig, AppConfig, clearConfig } from '../storage/storage';

function getGoalDayOfYear(dateStr: string): number {
    if (!dateStr) return -1;
    const goalDate = new Date(dateStr);
    const start = new Date(goalDate.getFullYear(), 0, 0);
    const diff = goalDate.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function HomeScreen() {
    const { width, height } = useWindowDimensions();
    const navigation = useNavigation<any>();

    const [viewMode, setViewMode] = useState<'life' | 'year' | 'goal'>('life');
    const [yearProgress, setYearProgress] = useState(getYearProgress());
    const [lifeProgress, setLifeProgress] = useState(getLifeProgress());
    const [config, setConfig] = useState<AppConfig | null>(null);
    const [goalDayOfYear, setGoalDayOfYear] = useState<number | undefined>(undefined);
    const [showSettings, setShowSettings] = useState(false);

    const loadData = useCallback(async () => {
        const data = await getConfig();
        setConfig(data);
        if (data && data.goalDate) {
            const gd = getGoalDayOfYear(data.goalDate);
            if (gd > 0) setGoalDayOfYear(gd);
        } else {
            setGoalDayOfYear(undefined);
        }
        setYearProgress(getYearProgress());
        setLifeProgress(getLifeProgress(data.birthDate || '1995-01-01'));
        if (data.selectedMode) {
            setViewMode(data.selectedMode);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const handleSetLiveWallpaper = () => {
        if (Platform.OS === 'android') {
            if (NativeModules.LiveWallpaperModule) {
                const bDate = config?.birthDate || '1995-01-01';
                const gDate = config?.goalDate || '';
                const gTitle = config?.goalTitle || '';
                NativeModules.LiveWallpaperModule.setConfig(viewMode, bDate, gDate, gTitle);
                NativeModules.LiveWallpaperModule.openLiveWallpaperPicker();
            } else {
                Alert.alert('Not Available', 'Live wallpaper native module not found.');
            }
        } else {
            Alert.alert('Not Supported', 'Live wallpaper is only available on Android.');
        }
    };

    const handleEmailSupport = () => {
        const url = 'mailto:admin@spritzstudio.in?subject=TimeApp Support';
        Linking.openURL(url).catch(() => Alert.alert('Error', 'No email app available.'));
    };

    const gridContainerHeight = height - 250;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            {/* Top Bar */}
            <View style={styles.topBar}>
                <Image source={require('../../assets/images/logo.png')} style={{ width: 65, height: 65, resizeMode: 'contain' }} />
                <View style={styles.segmentControl}>
                    {(['life', 'year', 'goal'] as const).map((mode) => (
                        <TouchableOpacity
                            key={mode}
                            style={[styles.segmentBtn, viewMode === mode && styles.segmentBtnActive]}
                            onPress={() => setViewMode(mode)}
                        >
                            <Text style={[styles.segmentText, viewMode === mode && styles.segmentTextActive]}>
                                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity style={styles.settingsBtn} onPress={() => setShowSettings(true)}>
                    <Ionicons name="settings-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Center Grid Area */}
            <View style={[styles.gridArea, { height: gridContainerHeight }]}>
                {viewMode === 'life' && (
                    <LifeGrid progress={lifeProgress} showHeader={true} textColor="#fff" />
                )}

                {viewMode === 'year' && (
                    <YearGrid progress={yearProgress} showHeader={true} textColor="#fff" />
                )}

                {viewMode === 'goal' && (
                    <>
                        {goalDayOfYear !== undefined ? (
                            <View style={{ alignItems: 'center' }}>
                                {/* Goal title + edit */}
                                <View style={styles.goalTitleRow}>
                                    <Text style={styles.goalTitle}>{config?.goalTitle || 'Target Goal'}</Text>
                                    <TouchableOpacity
                                        style={styles.editGoalBtn}
                                        onPress={() => navigation.navigate('Goal')}
                                    >
                                        <Ionicons name="pencil" size={18} color="#FF9500" />
                                    </TouchableOpacity>
                                </View>

                                {/*
                                  ✅ KEY CHANGE:
                                  goalMode={true}  → grid shows only Day 1 → goalDayOfYear dots
                                  Dot colours:
                                    past   = white
                                    today  = orange
                                    future = grey
                                    goal   = red
                                */}
                                <YearGrid
                                    progress={yearProgress}
                                    showHeader={false}
                                    textColor="#fff"
                                    goalDayOfYear={goalDayOfYear}
                                    goalMode={true}
                                />
                            </View>
                        ) : (
                            <View style={styles.emptyGoal}>
                                <Ionicons name="flag-outline" size={48} color="#666" style={{ marginBottom: 16 }} />
                                <Text style={styles.emptyGoalTitle}>No Goal Set</Text>
                                <Text style={styles.emptyGoalSub}>
                                    Set a specific date to track your progress towards a target.
                                </Text>
                                <TouchableOpacity
                                    style={styles.setGoalBtn}
                                    onPress={() => navigation.navigate('Goal')}
                                >
                                    <Text style={styles.setGoalBtnText}>SET A GOAL</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </>
                )}
            </View>

            {/* Footer CTA */}
            <View style={styles.footerArea}>
                <TouchableOpacity style={styles.liveWallpaperAction} onPress={handleSetLiveWallpaper}>
                    <Ionicons name="flash" size={24} color="#000" />
                    <Text style={styles.liveWallpaperActionText}>SET AS LIVE WALLPAPER</Text>
                </TouchableOpacity>
            </View>

            {/* Settings Modal */}
            <Modal
                visible={showSettings}
                transparent
                animationType="fade"
                onRequestClose={() => setShowSettings(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowSettings(false)}
                >
                    <View style={styles.settingsSheet}>
                        <View style={styles.dragHandle} />
                        <Text style={styles.sheetTitle}>Settings</Text>

                        <TouchableOpacity
                            style={styles.sheetOption}
                            onPress={() => {
                                setShowSettings(false);
                                clearConfig().then(() => navigation.replace('Onboarding'));
                            }}
                        >
                            <View style={styles.sheetIconWrapper}>
                                <Ionicons name="calendar" size={24} color="#fff" />
                            </View>
                            <View>
                                <Text style={styles.sheetOptionTitle}>Edit Birthday</Text>
                                <Text style={styles.sheetOptionSub}>Recalculate your life calendar</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.sheetOption}
                            onPress={() => { setShowSettings(false); navigation.navigate('Goal'); }}
                        >
                            <View style={styles.sheetIconWrapper}>
                                <Ionicons name="flag" size={24} color="#fff" />
                            </View>
                            <View>
                                <Text style={styles.sheetOptionTitle}>Edit Goal</Text>
                                <Text style={styles.sheetOptionSub}>Change your target date</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.sheetOption}
                            onPress={() => { setShowSettings(false); handleEmailSupport(); }}
                        >
                            <View style={styles.sheetIconWrapper}>
                                <Ionicons name="mail" size={24} color="#fff" />
                            </View>
                            <View>
                                <Text style={styles.sheetOptionTitle}>Contact Support</Text>
                                <Text style={styles.sheetOptionSub}>Report a bug or suggest a feature</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    topBar: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, height: 60,
    },
    settingsBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    segmentControl: { flexDirection: 'row', backgroundColor: '#1C1C1E', borderRadius: 20, padding: 4 },
    segmentBtn: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 16 },
    segmentBtnActive: { backgroundColor: '#333' },
    segmentText: { color: '#666', fontSize: 14, fontWeight: '700' },
    segmentTextActive: { color: '#fff' },
    gridArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    goalTitleRow: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20, marginTop: -20,
    },
    goalTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginRight: 12 },
    editGoalBtn: { padding: 4, backgroundColor: 'rgba(255, 149, 0, 0.1)', borderRadius: 12 },
    emptyGoal: { alignItems: 'center', justifyContent: 'center', padding: 40 },
    emptyGoalTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
    emptyGoalSub: { color: '#888', fontSize: 16, textAlign: 'center', marginBottom: 30, lineHeight: 24 },
    setGoalBtn: { backgroundColor: '#FF9500', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 30 },
    setGoalBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
    footerArea: {
        paddingHorizontal: 24,
        paddingBottom: Platform.OS === 'ios' ? 10 : 30,
        paddingTop: 10,
    },
    liveWallpaperAction: {
        flexDirection: 'row', backgroundColor: '#FF9500', alignItems: 'center',
        justifyContent: 'center', paddingVertical: 20, borderRadius: 24,
        shadowColor: '#FF9500', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3, shadowRadius: 15, elevation: 10,
    },
    liveWallpaperActionText: {
        color: '#000', fontWeight: '900', fontSize: 16, letterSpacing: 1.5, marginLeft: 12,
    },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    settingsSheet: {
        backgroundColor: '#1C1C1E', borderTopLeftRadius: 30, borderTopRightRadius: 30,
        paddingHorizontal: 24, paddingBottom: 50, paddingTop: 16,
    },
    dragHandle: { width: 40, height: 5, backgroundColor: '#333', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
    sheetTitle: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 24 },
    sheetOption: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    sheetIconWrapper: {
        width: 48, height: 48, borderRadius: 24, backgroundColor: '#333',
        alignItems: 'center', justifyContent: 'center', marginRight: 16,
    },
    sheetOptionTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
    sheetOptionSub: { color: '#888', fontSize: 14, marginTop: 4 },
});