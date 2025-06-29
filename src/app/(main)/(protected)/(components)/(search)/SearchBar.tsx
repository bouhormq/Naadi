import React from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SearchBarProps = {
  onPress: () => void;
  searchQuery: string;
  searchLocation: string;
  icon: React.ReactNode;
  onListIconPress: () => void;
};

export default function SearchBar({ onPress, searchQuery, searchLocation, icon, onListIconPress }: SearchBarProps) {
  return (
    <TouchableOpacity style={styles.searchContainer} onPress={onPress}>
      <View style={{ flex: 1, marginLeft: 10 }} pointerEvents="none">
        <TextInput
          placeholder="Any venue"
          style={styles.searchInput}
          placeholderTextColor="black"
          editable={false}
          value={searchQuery}
        />
        <Text style={styles.locationText}>{searchLocation}</Text>
      </View>
      <TouchableOpacity style={styles.listIconContainer} onPress={onListIconPress} activeOpacity={0.7}>
        {icon}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    fontSize: 16,
    fontWeight: '500',
  },
  locationText: {
    color: 'gray',
    fontSize: 14,
  },
  listIconContainer: {
    marginLeft: 10,
    height: 36,
    width: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});