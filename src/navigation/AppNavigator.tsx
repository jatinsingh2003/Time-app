import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import GoalSetupScreen from '../screens/GoalSetupScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import { getConfig } from '../storage/storage';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const [isReady, setIsReady] = useState(false);
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

    useEffect(() => {
        const loadState = async () => {
            const config = await getConfig();
            setHasCompletedOnboarding(config.hasCompletedOnboarding || false);
            setIsReady(true);
        };
        loadState();
    }, []);

    if (!isReady) {
        return (
            <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FF9500" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={hasCompletedOnboarding ? "Home" : "Onboarding"}>
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Goal" component={GoalSetupScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

