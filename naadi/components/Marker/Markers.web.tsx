import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// @ts-ignore: next-line for import
import { subCategoriesData } from '@naadi/assets/data/venues'; // Adjust the import path as necessary
import Droplet from './Droplet';
import { Marker } from '../Map/Map.web'; // Adjust the import path as necessary

const getMarkerIcon = (type: string, services: any[]) => {
  if (services && services.length > 0 && services[0].items.length === 1) {
    return '📍'; // Simplified for now, can be enhanced
  }
  return '📍';
};

// A simplified interface for web, omitting native-only MapMarkerProps
interface CustomMarkerProps {
  type: string;
  services: any[];
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
    fontSize: 24,
  },
});

export default CustomMarker;