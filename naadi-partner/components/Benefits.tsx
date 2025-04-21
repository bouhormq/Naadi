import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  useWindowDimensions,
} from 'react-native';

// --- Card Data ---
const businessCardData = [
  {
    id: 'b1',
    // NOTE: Ensure these paths are correct relative to your component file
    image: require('../assets/get-discovered.png'),
    title: 'Get discovered by new clients',
    text: 'Reach a global community committed to their fitness & wellness goals and access targeted promotions to get them through your doors.',
  },
  {
    id: 'b2',
    image: require('../assets/fill-empty-spots.png'),
    title: 'Fill your empty spots',
    text: 'Pack your schedule by listing available classes and appointments for our members to book. And avoid no-shows and late cancellations.',
  },
  {
    id: 'b3',
    image: require('../assets/generate-more.png'),
    title: 'Generate more revenue',
    text: 'Get paid for reservations made through Naadi and use the extra income to grow your business.',
  },
];

// Define a threshold for switching layouts
const DESKTOP_BREAKPOINT = 768;

export default function Benefits() {
  const { width } = useWindowDimensions();

  // Determine number of columns based on width
  const numColumns = width > DESKTOP_BREAKPOINT ? 3 : 1;
  const isDesktop = numColumns === 3;

  // Reusable Card Component
  interface CardProps {
    item: {
      image: any;
      title: string;
      text: string;
    };
    isDesktopLayout: boolean;
  }

  const Card = ({ item, isDesktopLayout }: CardProps) => (
    <View style={[styles.cardContainer, !isDesktopLayout && styles.cardContainerMobile]}>
      <Image
        source={item.image}
        style={[styles.cardImage, !isDesktopLayout && styles.cardImageMobile]}
        resizeMode="cover"
      />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
        <Text style={styles.scaleText}>Scale</Text> your business without{'\n'} breaking a sweat</Text>
        {/* --- Cards using FlatList --- */}
        <FlatList
          key={numColumns}
          data={businessCardData}
          renderItem={({ item }) => <Card item={item} isDesktopLayout={isDesktop} />}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          style={styles.cardList}
          scrollEnabled={true}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : null}
        />
      </View>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 50,
    paddingHorizontal: 20,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 1500,
    alignSelf: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    maxWidth: '80%',
  },
  cardList: {
    width: '100%',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 20,
  },
  cardContainer: {
    flex: 1,
    marginBottom: 30,
  },
  cardContainerMobile: {
    maxWidth: '100%',
  },
  cardImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardImageMobile: {
    height: 200,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#2357FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scaleText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});