import React, { useRef, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Platform,
    Alert, ActivityIndicator, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';

import YearGrid from '../components/YearGrid';
import WeeksGrid from '../components/WeeksGrid';
import LifeGrid from '../components/LifeGrid';
import { getYearProgress } from '../utils/dateUtils';

/**
 * route.params for mode === 'goal':
 *   { mode: 'goal', data: { goalTitle: string, daysLeft: number, goalDayOfYear: number } }
 *
 * Make sure GoalSetupScreen passes goalDayOfYear when navigating here.
 */
export default function WallpaperGeneratorScreen({ route, navigation }: any) {
    const { mode, data } = route.params;
    const viewShotRef = useRef<ViewShot>(null);
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    const [processing, setProcessing] = useState(false);
    const { width, height } = useWindowDimensions();

    // We need yearProgress for the goal grid (to know today's dayOfYear)
    const yearProgress = getYearProgress();

    const handleSetWallpaper = async (type: 'home' | 'lock' | 'both') => {
        if (processing) return;
        setProcessing(true);

        try {
            const uri = await captureRef(viewShotRef, {
                format: 'png',
                quality: 1.0,
                result: 'tmpfile',
            });

            if (Platform.OS === 'android') {
                const { NativeModules } = require('react-native');
                const manager = NativeModules.WallpaperManager;

                if (manager && manager.setWallpaper) {
                    manager.setWallpaper({ uri, type }, (err: any) => {
                        setProcessing(false);
                        if (err) {
                            Alert.alert('Error', String(err));
                        } else {
                            Alert.alert('Success', '?? Wallpaper set!');
                        }
                    });
                } else {
                    if (!permissionResponse?.granted) {
                        const { granted } = await requestPermission();
                        if (!granted) {
                            Alert.alert('Permission needed', 'Please allow access to save image.');
                            setProcessing(false);
                            return;
                        }
                    }
                    await MediaLibrary.saveToLibraryAsync(uri);
                    setProcessing(false);
                    Alert.alert('Saved to Gallery', 'Open your gallery and set it as wallpaper manually.');
                }
            } else if (Platform.OS === 'ios') {
                if (!permissionResponse?.granted) {
                    const { granted } = await requestPermission();
                    if (!granted) {
                        Alert.alert('Permission needed', 'Please allow access to save wallpaper.');
                        setProcessing(false);
                        return;
                    }
                }
                await MediaLibrary.saveToLibraryAsync(uri);
                setProcessing(false);
                Alert.alert('Saved to Photos', 'Go to Settings > Wallpaper to set it as your background.');
            } else {
                setProcessing(false);
                Alert.alert('Not Supported', 'Wallpaper setting is only available on mobile devices.');
            }
        } catch (error) {
            console.error(error);
            setProcessing(false);
            Alert.alert('Error', 'Failed to generate wallpaper.');
        }
    };

    const renderPreview = () => {
        switch (mode) {
            case 'year':
                return <YearGrid progress={data} textColor="#fff" showHeader={true} wallpaperMatch={true} />;

            case 'life':
                return <LifeGrid progress={data} textColor="#fff" showHeader={true} />;

            case 'weeks':
                return <WeeksGrid progress={data} textColor="#fff" />;

            case 'goal':
                return (
                    <View style={{ alignItems: 'center' }}>
                        {data.goalTitle ? (
                            <Text style={styles.goalTitleText}>{data.goalTitle}</Text>
                        ) : null}
                        <YearGrid
                            progress={yearProgress}
                            showHeader={false}
                            textColor="#fff"
                            goalDayOfYear={data.goalDayOfYear}
                            goalMode={true}
                            wallpaperMatch={true}
                        />
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <ViewShot
                ref={viewShotRef}
                style={[
                    styles.captureArea,
                    { width, height, position: 'absolute', top: 0, left: 0, zIndex: -1 },
                ]}
                options={{ format: 'png', quality: 1 }}
            >
                <View style={styles.contentWrapper}>{renderPreview()}</View>
            </ViewShot>

            <SafeAreaView style={styles.uiContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.livePreviewArea}>
                    {renderPreview()}
                </View>

                <View style={styles.bottomSheet}>
                    <View style={styles.dragHandle} />
                    <Text style={styles.sheetTitle}>Set as Wallpaper</Text>

                    {processing ? (
                        <ActivityIndicator size="large" color="#fff" style={{ marginVertical: 40 }} />
                    ) : (
                        <TouchableOpacity
                            style={styles.liveWallpaperBtn}
                            onPress={() =>
                                Alert.alert('Set Wallpaper', 'Choose where to apply', [
                                    { text: 'Home Screen', onPress: () => handleSetWallpaper('home') },
                                    { text: 'Lock Screen', onPress: () => handleSetWallpaper('lock') },
                                    { text: 'Both', onPress: () => handleSetWallpaper('both') },
                                    { text: 'Cancel', style: 'cancel' },
                                ])
                            }
                        >
                            <Ionicons name="image-outline" size={22} color="#000" style={{ marginRight: 12 }} />
                            <View>
                                <Text style={styles.liveWallpaperTitle}>Set Wallpaper</Text>
                                <Text style={styles.liveWallpaperSubtitle}>Home screen, lock screen, or both</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    uiContainer: { flex: 1, justifyContent: 'space-between' },
    captureArea: { backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', flex: 1 },
    contentWrapper: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' },
    header: { paddingHorizontal: 20, paddingTop: 10, alignItems: 'flex-start' },
    closeButton: { padding: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20 },
    livePreviewArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    bottomSheet: {
        backgroundColor: '#1C1C1E',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 40,
        paddingTop: 10,
        paddingHorizontal: 20,
    },
    dragHandle: { width: 40, height: 4, backgroundColor: '#555', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
    sheetTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 20 },
    goalTitleText: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 16 },
    liveWallpaperBtn: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF9500',
        borderRadius: 16, padding: 18, marginTop: 8, marginBottom: 8,
    },
    liveWallpaperTitle: { color: '#000', fontSize: 16, fontWeight: '700' },
    liveWallpaperSubtitle: { color: 'rgba(0,0,0,0.6)', fontSize: 12, marginTop: 2 },
});
