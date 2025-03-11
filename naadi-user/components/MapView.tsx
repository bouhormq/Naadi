import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Studio } from '@naadi/types';

interface StudioMapProps {
  studios: Studio[];
  onStudioSelect?: (studio: Studio) => void;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

export default function StudioMapView({ 
  studios, 
  onStudioSelect,
  initialRegion = {
    latitude: 31.6295, // Default to Marrakech
    longitude: -7.9811,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }
}: StudioMapProps) {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
      >
        {studios.map((studio) => (
          <Marker
            key={studio.id}
            coordinate={{
              latitude: studio.location.lat,
              longitude: studio.location.lng,
            }}
            title={studio.name}
            description={studio.description}
            onPress={() => onStudioSelect && onStudioSelect(studio)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
}); 