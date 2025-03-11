import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Text, View, StyleSheet } from 'react-native';

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#eee',
          backgroundColor: '#fff',
          height: Platform.OS === 'ios' ? 90 : 60,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        },
        headerStyle: {
          backgroundColor: '#4A90E2',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="studios"
        options={{
          title: 'Studios',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 