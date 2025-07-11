import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function VouchersScreen() {
  const router = useRouter();

  const handleFindSalons = () => {
    router.push('/(main)/(protected)/(tabs)/search');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>My vouchers</Text>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground} />
            <Ionicons name="ticket-outline" size={50} color="black" style={styles.icon} />
          </View>
          <Text style={styles.noVouchersText}>You have no active vouchers</Text>
          <Text style={styles.subtext}>Find venues to buy a voucher or book a service.</Text>
          <TouchableOpacity style={styles.searchButton} onPress={handleFindSalons}>
            <Text style={styles.searchButtonText}>Find venues near you</Text>
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
  iconContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  iconBackground: {
    position: 'absolute',
    width: 70,
    height: 50,
    backgroundColor: '#FFD44D',
    opacity: 0.8,
  },
  icon: {
    transform: [{ rotate: '-30deg' }],
  },
  noVouchersText: {
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
    backgroundColor: '#111827',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
});
