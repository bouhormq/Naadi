import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Marker } from '@/components/Map/Map.native'; // Use the universal Marker
import Droplet from './Droplet';
import { subCategoriesData } from '@naadi/assets/data/venues'; // Adjust the import path as necessary

const getMarkerIcon = (type: string, activities: Array<any>) => {
  if (activities && activities.length === 1) {
    // If only one activity, use its emoji
    return activities[0].emoji || '📍';
  } else if (activities && activities.length > 1) {
    // If more than one activity, use the emoji from subCategoriesData for the type
    const subCategory = subCategoriesData.find(
      (cat: { category: string; emoji: string }) => cat.category.toLowerCase() === type.toLowerCase()
    );
    return subCategory?.emoji || '📍';
  }
  return '📍';
};

interface CustomMarkerProps {
  type: string;
  activities: any[];
  coordinate: {
    latitude: number;
    longitude: number;
  };
  [key: string]: any; // Allow other props
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ type, activities, ...rest }) => {
  return (
    <Marker {...rest}>
      <Droplet>
        <Text style={styles.emoji}>{getMarkerIcon(type, activities)}</Text>
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
