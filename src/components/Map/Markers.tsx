import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { MapMarkerProps, Marker } from 'react-native-maps';
import Droplet from './Droplet';

const getMarkerIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'fitness':
      return '⚽️';
    case 'beauty':
      return '💄';
    case 'motors & watercraft':
      return '🚤';
    case 'wellness':
      return '💆🏻';
    default:
      return '📍'; // Default marker
  }
};

interface CustomMarkerProps extends MapMarkerProps {
  type: string;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ type, ...rest }) => {
  return (
    <Marker {...rest}>
      <Droplet>
        <Text style={styles.emoji}>{getMarkerIcon(type)}</Text>
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
