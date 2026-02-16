import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import YearDotsScreen from '../screens/YearDotsScreen';
import WeeksViewScreen from '../screens/WeeksViewScreen';
import GoalSetupScreen from '../screens/GoalSetupScreen';
import WallpaperGeneratorScreen from '../screens/WallpaperGeneratorScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 60,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'square';

                    if (route.name === 'Year') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'Weeks') {
                        iconName = focused ? 'grid' : 'grid-outline';
                    } else if (route.name === 'Goal') {
                        iconName = focused ? 'flag' : 'flag-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#000',
                tabBarInactiveTintColor: '#999',
                tabBarShowLabel: false,
            })}
        >
            <Tab.Screen name="Year" component={YearDotsScreen} />
            <Tab.Screen name="Weeks" component={WeeksViewScreen} />
            <Tab.Screen name="Goal" component={GoalSetupScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="MainTabs" component={MainTabs} />
                <Stack.Screen
                    name="WallpaperGenerator"
                    component={WallpaperGeneratorScreen}
                    options={{ presentation: 'modal' }} // Optional: nicely presents as a modal
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
