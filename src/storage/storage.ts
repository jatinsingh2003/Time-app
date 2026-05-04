// import AsyncStorage from '@react-native-async-storage/async-storage';

// export type AppMode = 'year' | 'goal';
// export type Theme = 'dark' | 'light';

// export interface AppConfig {
//     selectedMode: AppMode;
//     goalDate?: string;
//     goalTitle?: string;
//     birthDate?: string;
//     theme: Theme;
//     accentColor: string;
//     hasCompletedOnboarding?: boolean;
// }


// const STORAGE_KEY = '@antigravity_config';

// const DEFAULT_CONFIG: AppConfig = {
//     selectedMode: 'year',
//     theme: 'dark',
//     accentColor: '#FFFFFF', // Default white for strict minimal look
// };

// export const saveConfig = async (config: AppConfig) => {
//     try {
//         const jsonValue = JSON.stringify(config);
//         await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
//     } catch (e) {
//         console.error('Error saving config', e);
//     }
// };

// export const getConfig = async (): Promise<AppConfig> => {
//     try {
//         const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
//         return jsonValue != null ? { ...DEFAULT_CONFIG, ...JSON.parse(jsonValue) } : DEFAULT_CONFIG;
//     } catch (e) {
//         console.error('Error reading config', e);
//         return DEFAULT_CONFIG;
//     }
// };

// export const clearConfig = async () => {
//     try {
//         await AsyncStorage.removeItem(STORAGE_KEY);
//     } catch (e) {
//         console.error('Error clearing config', e);
//     }
// }
import AsyncStorage from '@react-native-async-storage/async-storage';

import { syncWidgets } from '../widgets/widgetSync';

export type AppMode = 'life' | 'year' | 'goal';
export type Theme = 'dark' | 'light';

export interface AppConfig {
    selectedMode: AppMode;
    goalDate?: string;
    goalTitle?: string;
    goalStartDay?: number; // day-of-year when the goal was originally set
    birthDate?: string;
    theme: Theme;
    accentColor: string;
    hasCompletedOnboarding?: boolean;
}


const STORAGE_KEY = '@antigravity_config';

const DEFAULT_CONFIG: AppConfig = {
    selectedMode: 'year',
    theme: 'dark',
    accentColor: '#FFFFFF',
};

export const saveConfig = async (config: AppConfig) => {
    try {
        const jsonValue = JSON.stringify(config);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        await syncWidgets(config);
    } catch (e) {
        console.error('Error saving config', e);
    }
};

export const getConfig = async (): Promise<AppConfig> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? { ...DEFAULT_CONFIG, ...JSON.parse(jsonValue) } : DEFAULT_CONFIG;
    } catch (e) {
        console.error('Error reading config', e);
        return DEFAULT_CONFIG;
    }
};

export const clearConfig = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
        await syncWidgets(DEFAULT_CONFIG);
    } catch (e) {
        console.error('Error clearing config', e);
    }
};
