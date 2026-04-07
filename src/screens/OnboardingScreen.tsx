import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { saveConfig, getConfig, AppConfig } from '../storage/storage';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
}

export default function OnboardingScreen({ navigation }: any) {
    const { width } = useWindowDimensions();
    const [step, setStep] = useState(1);
    
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [showPicker, setShowPicker] = useState(false);
    
    // Default picker to 20 years ago
    const today = new Date();
    const [pickerYear, setPickerYear] = useState(today.getFullYear() - 20);
    const [pickerMonth, setPickerMonth] = useState(0); // January

    const handleGenerate = async () => {
        const config = await getConfig();
        const newConfig: AppConfig = {
            ...config,
            birthDate: selectedDate,
            hasCompletedOnboarding: true,
        };
        await saveConfig(newConfig);
        // Navigation is handled by AppNavigator observing state change, but we could enforce it
        navigation.replace('Home');
    };

    const handleSelectDay = (day: number) => {
        const mm = String(pickerMonth + 1).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        setSelectedDate(`${pickerYear}-${mm}-${dd}`);
        setShowPicker(false);
    };

    const prevMonth = () => {
        if (pickerMonth === 0) { setPickerMonth(11); setPickerYear(y => y - 1); }
        else setPickerMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (pickerMonth === 11) { setPickerMonth(0); setPickerYear(y => y + 1); }
        else setPickerMonth(m => m + 1);
    };
    const prevYear = () => setPickerYear(y => y - 1);
    const nextYear = () => setPickerYear(y => y + 1);

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(pickerYear, pickerMonth);
        const firstDay = getFirstDayOfMonth(pickerYear, pickerMonth);
        const cells: React.ReactNode[] = [];

        for (let i = 0; i < firstDay; i++) {
            cells.push(<View key={`e-${i}`} style={styles.dayCell} />);
        }
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${pickerYear}-${String(pickerMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isSelected = dateStr === selectedDate;

            cells.push(
                <TouchableOpacity
                    key={d}
                    style={[styles.dayCell, isSelected && styles.selectedDay]}
                    onPress={() => handleSelectDay(d)}
                >
                    <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
                        {d}
                    </Text>
                </TouchableOpacity>
            );
        }
        return cells;
    };

    // Format selected date for display
    const formattedDate = selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {step === 1 ? (
                    <View style={styles.stepContainer}>
                        <View style={styles.heroDots}>
                            {[...Array(24)].map((_, i) => (
                                <View key={i} style={[styles.heroDot, { opacity: i < 7 ? 1 : 0.2 }]} />
                            ))}
                        </View>
                        <Text style={styles.title}>Your life,{'\n'}visualized.</Text>
                        <Text style={styles.subtitle}>Every dot is a week of your life. Watch what you've lived, and what you have left.</Text>
                        
                        <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
                            <Text style={styles.buttonText}>LET'S BEGIN</Text>
                            <Ionicons name="arrow-forward" size={20} color="#000" style={{ marginLeft: 8 }} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.stepContainer}>
                        <Text style={styles.title}>When does{'\n'}it start?</Text>
                        <Text style={styles.subtitle}>We need your birthday to calculate your life progress.</Text>
                        
                        <TouchableOpacity style={styles.dateSelector} onPress={() => setShowPicker(true)}>
                            <Ionicons name="calendar-outline" size={24} color={selectedDate ? "#FF9500" : "#666"} />
                            <Text style={[styles.dateSelectorText, selectedDate && { color: '#fff' }]}>
                                {selectedDate ? formattedDate : 'Tap to select birthday'}
                            </Text>
                        </TouchableOpacity>

                        {selectedDate ? (
                            <TouchableOpacity style={styles.button} onPress={handleGenerate}>
                                <Text style={styles.buttonText}>GENERATE CALENDAR</Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                )}
            </View>

            {/* Date Picker Modal */}
            <Modal visible={showPicker} transparent animationType="slide" onRequestClose={() => setShowPicker(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.calendarModal}>
                        <View style={styles.calendarHeader}>
                            <TouchableOpacity onPress={prevYear} style={styles.navBtn}><Ionicons name="play-back" size={18} color="#fff" /></TouchableOpacity>
                            <TouchableOpacity onPress={prevMonth} style={styles.navBtn}><Ionicons name="chevron-back" size={22} color="#fff" /></TouchableOpacity>
                            <View style={styles.monthYearCenter}>
                                <Text style={styles.monthTitle}>{MONTHS[pickerMonth]} {pickerYear}</Text>
                            </View>
                            <TouchableOpacity onPress={nextMonth} style={styles.navBtn}><Ionicons name="chevron-forward" size={22} color="#fff" /></TouchableOpacity>
                            <TouchableOpacity onPress={nextYear} style={styles.navBtn}><Ionicons name="play-forward" size={18} color="#fff" /></TouchableOpacity>
                        </View>

                        <View style={styles.dayNamesRow}>
                            {DAY_NAMES.map(dn => <Text key={dn} style={styles.dayNameText}>{dn}</Text>)}
                        </View>

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
    content: { flex: 1, justifyContent: 'center', paddingHorizontal: 30 },
    stepContainer: { flex: 1, justifyContent: 'center' },
    heroDots: { flexDirection: 'row', flexWrap: 'wrap', width: 200, marginBottom: 40, gap: 8 },
    heroDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#fff' },
    title: { fontSize: 42, fontWeight: '900', color: '#fff', letterSpacing: -1, lineHeight: 48, marginBottom: 16 },
    subtitle: { fontSize: 18, color: '#888', lineHeight: 26, marginBottom: 40 },
    button: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 18, paddingHorizontal: 32, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
    buttonText: { color: '#000', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
    dateSelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', borderWidth: 1, borderColor: '#333', padding: 20, borderRadius: 20, marginTop: 20 },
    dateSelectorText: { color: '#666', fontSize: 18, fontWeight: '600', marginLeft: 16 },
    
    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
    calendarModal: { backgroundColor: '#1C1C1E', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 },
    calendarHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    monthYearCenter: { flex: 1, alignItems: 'center' },
    navBtn: { padding: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 4 },
    monthTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
    dayNamesRow: { flexDirection: 'row', marginBottom: 8 },
    dayNameText: { flex: 1, textAlign: 'center', color: '#666', fontSize: 12, fontWeight: '600', letterSpacing: 1 },
    calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    dayCell: { width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 100 },
    dayText: { color: '#fff', fontSize: 14, fontWeight: '500' },
    selectedDay: { backgroundColor: '#FF9500' },
    selectedDayText: { color: '#000', fontWeight: '800' },
    cancelBtn: { marginTop: 16, paddingVertical: 14, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 14 },
    cancelBtnText: { color: '#aaa', fontSize: 14, fontWeight: '600' },
});
