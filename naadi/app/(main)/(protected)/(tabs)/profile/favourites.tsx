import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSession } from '@naadi/hooks/ctx';
import { getFavorites } from '@naadi/api';
import { EstablishmentData } from '@naadi/types';
import EstablishmentCard from '../../(components)/EstablishmentCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import EmptyFavorites from '../../(components)/EmptyFavorites';

const FavoritesScreen = () => {
  const { session, isLoading: isSessionLoading } = useSession();
  const [favorites, setFavorites] = useState<EstablishmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchFavorites = useCallback(async () => {
    if (isSessionLoading) {
      return; 
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
      setLoading(false);
      setFavorites([]);
    }
  }, [session, isSessionLoading]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [fetchFavorites])
  );

  if (loading || isSessionLoading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
        <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <EstablishmentCard item={item} layout='vertical' />}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<EmptyFavorites />}
            ListHeaderComponent={
              <>
                <View style={styles.header}>
                  <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back"  size={28} color="#000" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.title}>Favourites</Text>
              </>
            }
        />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingTop: 10,
  },
  backButton: {
    padding: 6,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 15,
    marginBottom: 15,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
});

export default FavoritesScreen;
