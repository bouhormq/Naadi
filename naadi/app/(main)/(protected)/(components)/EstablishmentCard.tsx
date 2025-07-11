import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EstablishmentData } from '../../../../../types';
import { useRouter } from 'expo-router';

const EstablishmentCard = ({ item, layout = 'horizontal', onPress }: { item: EstablishmentData, layout?: 'horizontal' | 'vertical', onPress?: (item: EstablishmentData) => void }) => {
  const { width } = useWindowDimensions();
  const isHorizontal = layout === 'horizontal';
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress(item);
    } else {
      router.push(`/(main)/(protected)/venue/${item.id}`);
    }
  };

  const styles = StyleSheet.create({
    card: {
      width: isHorizontal ? width * 0.7 : '100%',
      maxWidth: isHorizontal ? 300 : undefined,
      marginRight: isHorizontal ? 15 : 0,
      marginBottom: isHorizontal ? 0 : 20,
      backgroundColor: '#fff',
      borderColor: '#f0f0f0',
      borderWidth: 1,
      borderRadius: 12,
      padding: 12,
    },
    cardImage: {
      width: '100%',
      height: isHorizontal ? 180 : 150,
      backgroundColor: '#f0f0f0',
      borderRadius: 12,
      marginBottom: 12,
    },
    cardTitle: {
      fontSize: isHorizontal ? 17 : 16,
      fontWeight: isHorizontal ? '600' : 'bold',
      marginBottom: 4,
      marginTop: isHorizontal ? 0 : 10,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
      marginTop: isHorizontal ? 0 : 5,
    },
    ratingText: {
      marginLeft: 5,
      fontSize: 15,
      fontWeight: 'bold',
    },
    reviewsText: {
      color: '#666',
      fontWeight: 'normal',
    },
    cardAddress: {
      fontSize: 15,
      color: '#666',
      marginBottom: 8,
    },
    cardTypeContainer: {
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      backgroundColor: '#fff',
    },
    cardTypeText: {
      fontSize: 13,
      fontWeight: '500',
    },
  });

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      {item.images && item.images.length > 0 ? (
        <Image source={{ uri: item.images[0] }} style={styles.cardImage} />
      ) : (
        <View style={[styles.cardImage, { backgroundColor: '#f0f0f0' }]} />
      )}
      <Text style={styles.cardTitle}>{item.name}</Text>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color="#FFC107" />
        <Text style={styles.ratingText}>
          {item.rating.toFixed(1)} <Text style={styles.reviewsText}>({item.numberReviews})</Text>
        </Text>
      </View>
      <Text style={styles.cardAddress}>{item.address}</Text>
      <View style={styles.cardTypeContainer}>
        <Text style={styles.cardTypeText}>{item.type}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default EstablishmentCard;
