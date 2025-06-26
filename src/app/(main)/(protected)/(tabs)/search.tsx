// Example: app/screens/MapScreen.js
import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import type MapView from 'react-native-maps';
import type { Region } from 'react-native-maps';

// Import your universal components
import CustomMapView from '../../../../components/Map';

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);

  const initialRegion: Region = {
    latitude: 35.5785, // Tetouan
    longitude: -5.3684,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const moroccoBounds = {
    north: 36,
    south: 21,
    west: -17.5,
    east: -1,
  };

  const onRegionChangeComplete = (region: Region) => {
    const { latitude, longitude } = region;

    let newLatitude = latitude;
    let newLongitude = longitude;

    if (latitude > moroccoBounds.north) {
      newLatitude = moroccoBounds.north;
    } else if (latitude < moroccoBounds.south) {
      newLatitude = moroccoBounds.south;
    }

    if (longitude > moroccoBounds.east) {
      newLongitude = moroccoBounds.east;
    } else if (longitude < moroccoBounds.west) {
      newLongitude = moroccoBounds.west;
    }

    if (newLatitude !== latitude || newLongitude !== longitude) {
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          ...region,
          latitude: newLatitude,
          longitude: newLongitude,
        });
      }
    }
  };

  return (
    <View style={styles.container} id="map-screen">
      {/* Ensure the map fills the screen */}
      <CustomMapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        onRegionChangeComplete={onRegionChangeComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
