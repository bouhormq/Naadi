import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const EmptyFavorites = () => {
  const router = useRouter();

  const handleStartSearching = () => {
    router.push('/(main)/(protected)/(tabs)/search');
  };

  return (
    <View style={styles.content}>
      <View style={styles.heartContainer}>
        <LinearGradient
          colors={['#A594F9', '#6C56F8']}
          style={styles.heartBackground}
        >
          <Octicons name="heart" size={50} color="white" />
        </LinearGradient>
      </View>
      <Text style={styles.noFavouritesText}>No favourites</Text>
      <Text style={styles.subtext}>Your favourites list is empty. Let's fill it up!</Text>
      <TouchableOpacity style={styles.searchButton} onPress={handleStartSearching}>
        <Text style={styles.searchButtonText}>Start searching</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
    paddingHorizontal: 16,
    marginTop: 100,
  },
  heartContainer: {
    marginBottom: 30,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
  heartBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-15deg' }],
  },
  noFavouritesText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  subtext: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 30,
  },
});

export default EmptyFavorites;
