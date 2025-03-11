import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import Header from '../../components/Header';

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
        header: (props) => <Header title={props.options.title} />
      }}
    >
      <Tabs.Screen
        name="studios"
        options={{
          title: 'Studios',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="classes"
        options={{
          title: 'Classes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="upcoming"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
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