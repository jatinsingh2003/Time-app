import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert, ActivityIndicator, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
// WallpaperManager is imported dynamically for Android only


import YearGrid from '../components/YearGrid';
import WeeksGrid from '../components/WeeksGrid';
import LifeGrid from '../components/LifeGrid';
import GoalDisplay from '../components/GoalDisplay';




export default function WallpaperGeneratorScreen({ route, navigation }: any) {
    const { mode, data } = route.params; // mode: 'year' | 'weeks' | 'goal'
    const viewShotRef = useRef<ViewShot>(null);
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    const [processing, setProcessing] = useState(false);

    // We want the capture to be the full screen size
    const { width, height } = useWindowDimensions();

    const handleSetWallpaper = async (type: 'home' | 'lock' | 'both') => {
        if (processing) return;
        setProcessing(true);

        try {
            // 1. Capture Image
            const uri = await captureRef(viewShotRef, {
                format: 'png',
                quality: 1.0,
                result: 'tmpfile'
            });

            if (Platform.OS === 'android') {
                const { NativeModules } = require('react-native');
                const manager = NativeModules.WallpaperManager;

                if (manager && manager.setWallpaper) {
                    // ✅ Use our custom native module
                    manager.setWallpaper({ uri, type }, (err: any) => {
                        setProcessing(false);
                        if (err) {
                            Alert.alert('Error', String(err));
                        } else {
                            Alert.alert('Success', '🎉 Wallpaper set!');
                        }
                    });
                } else {
                    // Fallback - save to gallery
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
                return <YearGrid progress={data} textColor="#fff" showHeader={true} />;
            case 'life':
                return <LifeGrid progress={data} textColor="#fff" showHeader={true} />;
            case 'weeks':
                return <WeeksGrid progress={data} textColor="#fff" />;
            case 'goal':
                return (
                    <View style={{ alignItems: 'center' }}>
                        {data.goalTitle && (
                            <Text style={styles.goalTitleText}>{data.goalTitle}</Text>
                        )}
                        <GoalDisplay daysLeft={data.daysLeft} textColor="#fff" />
                    </View>
                );

            default:
                return null;
        }
    };


    return (
        <View style={styles.container}>
            {/* ViewShot Capture Area - Hidden from UI usage but visible for capture */}
            <ViewShot
                ref={viewShotRef}
                style={[styles.captureArea, {
                    width: width,
                    height: height,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: -1
                }]}
                options={{ format: 'png', quality: 1 }}
            >
                <View style={styles.contentWrapper}>
                    {renderPreview()}
                </View>
            </ViewShot>

            {/* Visual Preview (Overlay on top of the black background) */}
            <SafeAreaView style={styles.uiContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                        {/* Drag handle look or close icon */}
                        <Ionicons name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Empty space to show preview */}
                <View style={{ flex: 1 }} />

                {/* Bottom Sheet Controls */}
                <View style={styles.bottomSheet}>
                    <View style={styles.dragHandle} />
                    <Text style={styles.sheetTitle}>Set Live Wallpaper</Text>

                    {processing ? (
                        <ActivityIndicator size="large" color="#fff" style={{ marginVertical: 40 }} />
                    ) : (
                        <TouchableOpacity
                            style={styles.liveWallpaperBtn}
                            onPress={() => {
                                Alert.alert(
                                    'Set Wallpaper',
                                    'Choose where to apply',
                                    [
                                        { text: 'Home Screen', onPress: () => handleSetWallpaper('home') },
                                        { text: 'Lock Screen', onPress: () => handleSetWallpaper('lock') },
                                        { text: 'Both', onPress: () => handleSetWallpaper('both') },
                                        { text: 'Cancel', style: 'cancel' },
                                    ]
                                );
                            }}
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
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    uiContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    captureArea: {
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    contentWrapper: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        alignItems: 'flex-end',
    },
    closeButton: {
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
    },
    bottomSheet: {
        backgroundColor: '#1C1C1E', // Dark grey like iOS/Android native sheets
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 40,
        paddingTop: 10,
        paddingHorizontal: 20,
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#555',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    sheetTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    iconContainer: {
        width: 40,
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    optionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    optionSubtitle: {
        color: '#888',
        fontSize: 13,
        marginTop: 2,
    },
    goalTitleText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 10,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 10,
    },
    liveWallpaperBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF9500',
        borderRadius: 16,
        padding: 18,
        marginTop: 8,
        marginBottom: 8,
    },
    liveWallpaperTitle: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
    liveWallpaperSubtitle: {
        color: 'rgba(0,0,0,0.6)',
        fontSize: 12,
        marginTop: 2,
    },
    liveWallpaperOption: {
        marginTop: 10,
        paddingBottom: 20,
    },
});

