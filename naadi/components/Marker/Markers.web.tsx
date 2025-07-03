import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// @ts-ignore: next-line for import
import { subCategoriesData } from '@naadi/assets/data/venues'; // Adjust the import path as necessary
import Droplet from './Droplet';
import { Marker } from '../Map/Map.web'; // Adjust the import path as necessary

const getMarkerIcon = (type: string, activities: Array<any>) => {
  if (activities && activities.length === 1) {
    return activities[0].emoji || '📍';
  } else if (activities && activities.length > 1) {
    const subCategory = subCategoriesData.find(
      (cat: { category: string; emoji: string }) => cat.category.toLowerCase() === type.toLowerCase()
    );
    return subCategory?.emoji || '📍';
  }
  return '📍';
};

// A simplified interface for web, omitting native-only MapMarkerProps
interface CustomMarkerProps {
  type: string;
  activities: any[];
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
    fontSize: 24,
  },
});

export default CustomMarker;