import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useSession } from '@naadi/ctx';
import { getFavorites } from '@naadi/api';
import { EstablishmentData } from '@naadi/types';
import EstablishmentCard from './(components)/EstablishmentCard';
import { SafeAreaView } from 'react-native-safe-area-context';

const FavoritesScreen = () => {
  const { session, isLoading: isSessionLoading } = useSession();
  const [favorites, setFavorites] = useState<EstablishmentData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    console.log('fetchFavorites called. isSessionLoading:', isSessionLoading, 'session:', session);
    if (isSessionLoading) {
      return; // Wait for session to be loaded
    }

    if (session?.uid) {
      try {
        setLoading(true);
        const favs = await getFavorites(session.uid);
        setFavorites(favs);
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // No user session, so stop loading and show empty list
      console.warn('No user session found, clearing favorites.');
      setLoading(false);
      setFavorites([]);
    }
  }, [session, isSessionLoading]);

  useEffect(() => {
    console.log('Favorites screen mounted');
    fetchFavorites();
  }, [fetchFavorites]);

  useFocusEffect(
    useCallback(() => {
      console.log('Favorites screen focused');
      fetchFavorites();
    }, [fetchFavorites])
  );

  if (loading || isSessionLoading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.title}>Favorites</Text>
        <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <EstablishmentCard item={item} layout='vertical' />}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={styles.emptyText}>You have no favorites yet.</Text>}
        />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

export default FavoritesScreen;
