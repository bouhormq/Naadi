import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import CustomMapView, { Marker } from '@/components/Map/Map';
import CustomMarker from '@/components/Marker/Markers';

// Define Region locally to avoid importing from react-native-maps
interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const moroccoBounds = {
  north: 36,
  south: 21,
  west: -17.5,
  east: -1,
};

const initialRegion: Region = {
  latitude: 35.5585,
  longitude: -5.3584,
  latitudeDelta: 0.05, // Zoomed in more
  longitudeDelta: 0.025, // Zoomed in more
};

const renderCluster = (cluster: any) => {
  const { id, geometry, onPress, properties } = cluster;
  const points = properties.point_count;

  return (
    <Marker
      key={`cluster-${id}`}
      coordinate={{
        latitude: geometry.coordinates[1],
        longitude: geometry.coordinates[0],
      }}
      onPress={onPress}
    >
      <View style={styles.clusterContainer}>
        <Text style={styles.clusterText}>{points}</Text>
      </View>
    </Marker>
  );
};

type MapViewComponentProps = {
  mapRef: React.RefObject<any>;
  filteredVenues: Array<any>;
  animatedY: { setValue: (value: number) => void };
  handleCardPress: (venue: any, height: number) => void;
  region?: Region;
  singleVenueMode?: boolean;
  scrollEnabled?: boolean;
  zoomEnabled?: boolean;
  options?: any;
};

export default function MapViewComponent({ mapRef, filteredVenues, animatedY, handleCardPress, region, singleVenueMode, scrollEnabled = true, zoomEnabled = true, options, onMarkerPress }: MapViewComponentProps & { onMarkerPress?: (venueId: string) => void }) {
  const onRegionChangeComplete = (region: Region) => {
    const { latitude, longitude } = region;

    let newLatitude = latitude;
    let newLongitude = longitude;

    if (latitude > moroccoBounds.north) newLatitude = moroccoBounds.north;
    else if (latitude < moroccoBounds.south) newLatitude = moroccoBounds.south;

    if (longitude > moroccoBounds.east) newLongitude = moroccoBounds.east;
    else if (longitude < moroccoBounds.west) newLongitude = moroccoBounds.west;

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

  // Force update map region when prop changes
  React.useEffect(() => {
    if (region && mapRef.current) {
      // Ensure google.maps is available before using animateToRegion (web implementation)
      if (typeof google !== 'undefined' && google.maps && typeof google.maps.LatLngBounds === 'function') {
        mapRef.current.animateToRegion(region, 1000);
      } else if (mapRef.current.setCamera) {
        // Fallback for web maps: set camera directly
        mapRef.current.setCamera({
          center: { latitude: region.latitude, longitude: region.longitude },
          zoom: 15,
        });
      }
    }
  }, [region]);



  const handleMarkerPress = (venueId: string) => {
    animatedY.setValue(0);
    if (onMarkerPress) {
      onMarkerPress(venueId);
    } else {
      const venue = filteredVenues.find((v) => v.id === venueId);
      if (venue) {
        handleCardPress(venue, 300); // Approximate bottom sheet height
      }
    }
  };

  return (
    <CustomMapView
      ref={mapRef}
      style={styles.map}
      initialRegion={initialRegion}
      {...(region ? { region } : {})}
      onRegionChangeComplete={onRegionChangeComplete}
      renderCluster={renderCluster}
      radius={500}
      scrollEnabled={scrollEnabled}
      zoomEnabled={zoomEnabled}
      options={options}
    >
      {singleVenueMode && filteredVenues.length === 1 ? (
        <CustomMarker
          key={filteredVenues[0].id}
          coordinate={filteredVenues[0].coordinate}
          onPress={() => { }}
          type={filteredVenues[0].type}
          services={filteredVenues[0].services || filteredVenues[0].activities || []}
        />
      ) : (
        filteredVenues.map((venue) => (
          <CustomMarker
            key={venue.id}
            coordinate={venue.coordinate}
            onPress={() => handleMarkerPress(venue.id)}
            type={venue.type}
            services={venue.services || venue.activities || []}
          />
        ))
      )}
    </CustomMapView>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  clusterContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3674B5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  clusterText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});