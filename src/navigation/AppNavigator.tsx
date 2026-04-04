import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import GoalSetupScreen from '../screens/GoalSetupScreen';
import WallpaperGeneratorScreen from '../screens/WallpaperGeneratorScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Goal" component={GoalSetupScreen} />
                <Stack.Screen
                    name="WallpaperGenerator"
                    component={WallpaperGeneratorScreen}
                    options={{ presentation: 'modal' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

