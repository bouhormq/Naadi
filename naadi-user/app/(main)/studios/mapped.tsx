import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import StudioMapView from '../../../components/MapView';
import { useStudios } from '../../../hooks/useStudios';
import { Studio } from '@naadi/types';

export default function MappedStudiosScreen() {
  const router = useRouter();
  const { studios, loading, error } = useStudios();
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);

  const handleStudioSelect = (studio: Studio) => {
    setSelectedStudio(studio);
  };

  const navigateToStudioDetail = (studioId: string) => {
    router.push(`/studios/${studioId}`);
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
        <Text style={styles.errorText}>Failed to load studios.</Text>
        <Text style={styles.errorSubText}>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StudioMapView 
        studios={studios} 
        onStudioSelect={handleStudioSelect} 
      />
      
      {selectedStudio && (
        <View style={styles.studioPreview}>
          <View style={styles.studioPreviewContent}>
            <Text style={styles.studioName}>{selectedStudio.name}</Text>
            <Text style={styles.studioAddress} numberOfLines={1}>{selectedStudio.address}</Text>
            <Text style={styles.studioDescription} numberOfLines={2}>
              {selectedStudio.description}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.detailButton}
            onPress={() => navigateToStudioDetail(selectedStudio.id)}
          >
            <Text style={styles.detailButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  studioPreview: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    flexDirection: 'row',
  },
  studioPreviewContent: {
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
    marginBottom: 6,
  },
  studioDescription: {
    fontSize: 14,
    color: '#666',
  },
  detailButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    marginLeft: 12,
  },
  detailButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
}); 