import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Marker } from '@/components/Map/Map.native'; // Use the universal Marker
import Droplet from './Droplet';

const getMarkerIcon = (type: string, services: any[]) => {
  if (services && services.length > 0 && services[0].items.length === 1) {
    // If only one activity, use its emoji
    return '📍'; // Simplified for now
  }
  return '📍';
};

interface CustomMarkerProps {
  type: string;
  services: any[];
  coordinate: {
    latitude: number;
    longitude: number;
  };
  [key: string]: any; // Allow other props
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ type, services, ...rest }) => {
  return (
    <Marker {...rest}>
      <Droplet>
        <Text style={styles.emoji}>{getMarkerIcon(type, services)}</Text>
      </Droplet>
    </Marker>
  );
};

const styles = StyleSheet.create({
  emoji: {
    fontSize: 22,
  },
});

export default CustomMarker;
