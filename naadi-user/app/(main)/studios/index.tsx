import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useStudios } from '../../../hooks/useStudios';

export default function StudiosScreen() {
  const router = useRouter();
  const { studios, loading, error } = useStudios();

  const navigateToStudioDetail = (studioId: string) => {
    router.push(`/studios/${studioId}`);
  };

  const navigateToMap = () => {
    router.push('/studios/mapped');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load studios.</Text>
        <Text style={styles.errorSubText}>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.mapButton}
        onPress={navigateToMap}
      >
        <Text style={styles.mapButtonText}>View on Map</Text>
      </TouchableOpacity>

      <FlatList
        data={studios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.studioCard}
            onPress={() => navigateToStudioDetail(item.id)}
          >
            {item.photos && item.photos.length > 0 ? (
              <Image source={{ uri: item.photos[0] }} style={styles.studioImage} />
            ) : (
              <View style={[styles.studioImage, styles.placeholderImage]}>
                <Text style={styles.placeholderText}>{item.name.substring(0, 1)}</Text>
              </View>
            )}
            <View style={styles.studioInfo}>
              <Text style={styles.studioName}>{item.name}</Text>
              <Text style={styles.studioAddress} numberOfLines={1}>{item.address}</Text>
              <Text style={styles.studioDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff3b30',
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  mapButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    margin: 16,
    alignItems: 'center',
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  studioCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  studioImage: {
    width: 100,
    height: 100,
  },
  placeholderImage: {
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#999',
  },
  studioInfo: {
    flex: 1,
    padding: 12,
  },
  studioName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  studioAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  studioDescription: {
    fontSize: 14,
    color: '#666',
  },
}); 