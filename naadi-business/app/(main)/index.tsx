import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Dashboard</Text>
        <Text style={styles.subtitle}>Manage your fitness business all in one place</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Studios</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Classes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Bookings</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/studios/add')}
        >
          <Ionicons name="add-circle-outline" size={24} color="#4A90E2" />
          <Text style={styles.actionButtonText}>Add New Studio</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/studios')}
        >
          <Ionicons name="list-outline" size={24} color="#4A90E2" />
          <Text style={styles.actionButtonText}>Manage Studios</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => console.log('View calendar')}
        >
          <Ionicons name="calendar-outline" size={24} color="#4A90E2" />
          <Text style={styles.actionButtonText}>View Bookings Calendar</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.emptyState}>
          <Ionicons name="notifications-outline" size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>No recent activity</Text>
          <Text style={styles.emptyStateSubText}>
            Activity from your studios and bookings will appear here
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  section: {
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
  },
}); 