import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function FavouritesScreen() {
  const router = useRouter();

  const handleStartSearching = () => {
    router.push('/(main)/(protected)/(tabs)/search');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Favourites</Text>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginTop: 90,
    marginBottom: 20,
    textAlign: 'left',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  heartContainer: {
    marginBottom: 30,
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
  subtext: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 30,
  },
  searchButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
});
