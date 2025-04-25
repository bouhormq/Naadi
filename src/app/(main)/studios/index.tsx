import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomText from '@/components/CustomText';

// This would be replaced with a real hook to fetch studios
const useBusinessStudios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  // Mock empty studios list for now with proper typing
  const studios: any[] = [];
  
  return { studios, loading, error };
};

export default function StudiosScreen() {
  const router = useRouter();
  const { studios, loading, error } = useBusinessStudios();

  const navigateToStudioDetail = (studioId: string) => {
    router.push(`/studios/${studioId}`);
  };

  const navigateToAddStudio = () => {
    router.push('/studios/add');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <CustomText style={styles.errorText}>Failed to load studios.</CustomText>
        <CustomText style={styles.errorSubText}>{error.message}</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={navigateToAddStudio}
      >
        <Ionicons name="add" size={20} color="#fff" />
        <CustomText style={styles.addButtonText}>Add New Studio</CustomText>
      </TouchableOpacity>

      {studios.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="partner-outline" size={64} color="#ccc" />
          <CustomText style={styles.emptyStateText}>No Studios Yet</CustomText>
          <CustomText style={styles.emptyStateSubText}>
            Add your first studio to get started
          </CustomText>
        </View>
      ) : (
        <FlatList
          data={studios}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.studioCard}
              onPress={() => navigateToStudioDetail(item.id)}
            >
              <View style={styles.studioInfo}>
                <CustomText style={styles.studioName}>{item.name}</CustomText>
                <CustomText style={styles.studioAddress} numberOfLines={1}>{item.address}</CustomText>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#999" />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff3b30',
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    margin: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  studioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  studioInfo: {
    flex: 1,
  },
  studioName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  studioAddress: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
}); 