import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  useWindowDimensions,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';


// --- Card Data ---
const businessCardData = [
  {
    id: 'b1',
    // NOTE: Ensure these paths are correct relative to your component file
    image: require('../(assets)/step-1.png'),
    title: 'STEP 1',
    text: 'Sync your schedule or add classes and appointments for users to book',
  },
  {
    id: 'b2',
    image: require('../(assets)/step-2.png'),
    title: 'STEP 2',
    text: 'Use SmartTools to fill spots that would typically go unbooked',
  },
  {
    id: 'b3',
    image: require('../(assets)/step-3.png'),
    title: 'STEP 3',
    text: 'Track your reservations and revenue on your personalized dashboard',
  },
];

// Define a threshold for switching layouts
const DESKTOP_BREAKPOINT = 768;

export default function Steps() {
  const { width } = useWindowDimensions();
  const router = useRouter();

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
        How it works 
        </Text>
        <Text style={styles.subtitle}>
        Naadi uses SmartTools, an intelligent spot management system, to dynamically price classes and appointments and maximize your revenue.
        </Text>
        {/* --- Cards using FlatList --- */}
        <FlatList
          key={numColumns}
          data={businessCardData}
          renderItem={({ item }) => <Card item={item} isDesktopLayout={isDesktop} />}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          style={styles.cardList}
          scrollEnabled={true}
          ListFooterComponent={() => (
            <TouchableOpacity onPress={() => router.push('/partners/how-it-works')} style={styles.button}>
                <Text style={styles.buttonText}>Learn More</Text>
            </TouchableOpacity>
        )}
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
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
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
    color: '#007bff',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#0077ff',
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
  freeText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});