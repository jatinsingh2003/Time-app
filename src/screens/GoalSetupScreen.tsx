import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    Keyboard, useWindowDimensions, Modal, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveConfig, getConfig, AppConfig } from '../storage/storage';
import { getGoalProgress } from '../utils/dateUtils';
import GoalDisplay from '../components/GoalDisplay';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
}
function toDateStr(year: number, month: number, day: number): string {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
}
function getGoalDayOfYear(dateStr: string): number {
    const goalDate = new Date(dateStr);
    const start = new Date(goalDate.getFullYear(), 0, 0);
    const diff = goalDate.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}
function formatSelectedDate(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    const d = new Date(Number(year), Number(month) - 1, Number(day));
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function GoalSetupScreen() {
    const { width } = useWindowDimensions();
    const navigation = useNavigation<any>();
    const [config, setConfig] = useState<AppConfig | null>(null);
    const [title, setTitle] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [daysLeft, setDaysLeft] = useState<number | null>(null);
    const [showPicker, setShowPicker] = useState(false);

    const today = new Date();
    const [pickerYear, setPickerYear] = useState(today.getFullYear());
    const [pickerMonth, setPickerMonth] = useState(today.getMonth());

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        const data = await getConfig();
        setConfig(data);
        if (data.goalTitle) setTitle(data.goalTitle);
        if (data.goalDate) {
            setSelectedDate(data.goalDate);
            const progress = getGoalProgress(data.goalDate);
            setDaysLeft(progress.daysRemaining);
        }
    };

    const handleSelectDay = (day: number) => {
        const ds = toDateStr(pickerYear, pickerMonth, day);
        setSelectedDate(ds);
        setShowPicker(false);
    };

    const handleSave = async () => {
        if (!title || !selectedDate) return;
        const newConfig: AppConfig = {
            ...config,
            selectedMode: 'goal',
            goalTitle: title,
            goalDate: selectedDate,
            theme: config?.theme || 'dark',
            accentColor: config?.accentColor || '#fff',
        } as AppConfig;
        await saveConfig(newConfig);
        setConfig(newConfig);
        const progress = getGoalProgress(selectedDate);
        setDaysLeft(progress.daysRemaining);
        Keyboard.dismiss();

        // Auto-navigate to the goal preview page
        navigation.navigate('WallpaperGenerator', {
            mode: 'goal',
            data: {
                goalTitle: title,
                daysLeft: progress.daysRemaining,
                goalDayOfYear: getGoalDayOfYear(selectedDate),
            },
        });
    };

    const prevMonth = () => {
        if (pickerMonth === 0) { setPickerMonth(11); setPickerYear(y => y - 1); }
        else setPickerMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (pickerMonth === 11) { setPickerMonth(0); setPickerYear(y => y + 1); }
        else setPickerMonth(m => m + 1);
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(pickerYear, pickerMonth);
        const firstDay = getFirstDayOfMonth(pickerYear, pickerMonth);
        const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const cells: React.ReactNode[] = [];

        for (let i = 0; i < firstDay; i++) {
            cells.push(<View key={`e-${i}`} style={styles.dayCell} />);
        }
        for (let d = 1; d <= daysInMonth; d++) {
            const thisDate = new Date(pickerYear, pickerMonth, d);
            const isPast = thisDate < todayMidnight;
            const ds = toDateStr(pickerYear, pickerMonth, d);
            const isSelected = ds === selectedDate;
            const isToday = thisDate.getTime() === todayMidnight.getTime();

            cells.push(
                <TouchableOpacity
                    key={d}
                    style={[styles.dayCell, isSelected && styles.selectedDay, isToday && !isSelected && styles.todayCell]}
                    onPress={() => !isPast && handleSelectDay(d)}
                    disabled={isPast}
                >
                    <Text style={[styles.dayText, isSelected && styles.selectedDayText, isPast && styles.pastDayText, isToday && !isSelected && styles.todayText]}>
                        {d}
                    </Text>
                </TouchableOpacity>
            );
        }
        return cells;
    };

    const canSave = title.trim().length > 0 && selectedDate.length > 0;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }} keyboardShouldPersistTaps="handled">
                <View style={{ width: Math.min(width, 600), paddingHorizontal: 20 }}>
                    <Text style={styles.header}>TARGET</Text>

                    <GoalDisplay daysLeft={daysLeft} textColor="#fff" />

                    {daysLeft !== null && (
                        <TouchableOpacity
                            style={styles.wallpaperButton}
                            onPress={() => navigation.navigate('WallpaperGenerator', {
                                mode: 'goal',
                                data: {
                                    goalTitle: title,
                                    daysLeft,
                                    goalDayOfYear: getGoalDayOfYear(selectedDate),
                                },
                            })}
                        >
                            <Text style={styles.buttonText}>SET AS WALLPAPER</Text>
                        </TouchableOpacity>
                    )}

                    <View style={styles.form}>
                        <Text style={styles.label}>Goal Title</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Launch App, Exam Day…"
                            value={title}
                            onChangeText={setTitle}
                            placeholderTextColor="#555"
                        />

                        <Text style={styles.label}>Goal Date</Text>
                        <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
                            <Ionicons
                                name="calendar-outline"
                                size={20}
                                color={selectedDate ? '#FF9500' : '#666'}
                                style={{ marginRight: 12 }}
                            />
                            <Text style={[styles.dateButtonText, selectedDate && { color: '#fff' }]}>
                                {selectedDate ? formatSelectedDate(selectedDate) : 'Tap to pick a date'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, !canSave && styles.buttonDisabled]}
                            onPress={handleSave}
                            disabled={!canSave}
                        >
                            <Text style={styles.buttonText}>SET GOAL</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Calendar Picker Modal */}
            <Modal visible={showPicker} transparent animationType="slide" onRequestClose={() => setShowPicker(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.calendarModal}>
                        {/* Month Nav */}
                        <View style={styles.calendarHeader}>
                            <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
                                <Ionicons name="chevron-back" size={22} color="#fff" />
                            </TouchableOpacity>
                            <Text style={styles.monthTitle}>{MONTHS[pickerMonth]} {pickerYear}</Text>
                            <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
                                <Ionicons name="chevron-forward" size={22} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {/* Day Name Headers */}
                        <View style={styles.dayNamesRow}>
                            {DAY_NAMES.map(dn => (
                                <Text key={dn} style={styles.dayNameText}>{dn}</Text>
                            ))}
                        </View>

                        {/* Calendar Grid */}
                        <View style={styles.calendarGrid}>
                            {renderCalendar()}
                        </View>

                        <TouchableOpacity onPress={() => setShowPicker(false)} style={styles.cancelBtn}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    topHeader: { paddingHorizontal: 20, paddingTop: 10, alignItems: 'flex-end' },
    closeButton: { padding: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20 },
    header: {
        fontSize: 24, fontWeight: '900', marginBottom: 20,
        textTransform: 'uppercase', letterSpacing: 2,
        textAlign: 'center', color: '#fff', marginTop: 10,
    },
    form: { width: '100%', marginTop: 30 },
    label: { color: '#888', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
    input: {
        borderWidth: 1, borderColor: '#222', backgroundColor: '#111',
        borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16,
        fontSize: 16, marginBottom: 24, color: '#fff',
    },
    dateButton: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1, borderColor: '#222', backgroundColor: '#111',
        borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16, marginBottom: 24,
    },
    dateButtonText: { color: '#666', fontSize: 16, flex: 1 },
    button: {
        backgroundColor: '#fff', padding: 18, alignItems: 'center',
        marginTop: 10, borderRadius: 30,
    },
    buttonDisabled: { backgroundColor: '#333' },
    buttonText: { color: '#000', fontWeight: 'bold', letterSpacing: 1, fontSize: 15 },
    wallpaperButton: {
        backgroundColor: '#1C1C1E', paddingVertical: 12, paddingHorizontal: 24,
        borderRadius: 30, alignSelf: 'center', marginBottom: 20,
    },
    // Modal
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    calendarModal: {
        backgroundColor: '#1C1C1E', borderTopLeftRadius: 24,
        borderTopRightRadius: 24, paddingHorizontal: 16,
        paddingTop: 20, paddingBottom: 40,
    },
    calendarHeader: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 20,
    },
    navBtn: { padding: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)' },
    monthTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
    dayNamesRow: { flexDirection: 'row', marginBottom: 8 },
    dayNameText: {
        flex: 1, textAlign: 'center', color: '#666',
        fontSize: 12, fontWeight: '600', letterSpacing: 1,
    },
    calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    dayCell: {
        width: `${100 / 7}%`, aspectRatio: 1,
        alignItems: 'center', justifyContent: 'center',
        borderRadius: 100,
    },
    dayText: { color: '#fff', fontSize: 14, fontWeight: '500' },
    selectedDay: { backgroundColor: '#FF9500' },
    selectedDayText: { color: '#000', fontWeight: '800' },
    pastDayText: { color: '#444' },
    todayCell: { borderWidth: 1, borderColor: '#FF9500' },
    todayText: { color: '#FF9500', fontWeight: '700' },
    cancelBtn: {
        marginTop: 16, paddingVertical: 14,
        alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.07)',
        borderRadius: 14,
    },
    cancelBtnText: { color: '#aaa', fontSize: 14, fontWeight: '600' },
});
