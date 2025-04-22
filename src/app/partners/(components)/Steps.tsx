import {
  View,
  Text,
  StyleSheet,
  Image,
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

  // Determine if desktop layout
  const isDesktop = width > DESKTOP_BREAKPOINT;

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
    <View style={[
      styles.cardContainer,
      isDesktopLayout ? styles.cardContainerDesktop : styles.cardContainerMobile
    ]}>
      <View style={styles.imageContainer}>
        <Image
          source={item.image}
          style={styles.cardImage}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={[
      styles.container,
      isDesktop ? styles.containerDesktop : styles.containerMobile
    ]}>
      <View style={[
        styles.content,
        isDesktop ? styles.contentDesktop : styles.contentMobile
      ]}>
        <Text style={styles.title}>
          How it works 
        </Text>
        <Text style={[
          styles.subtitle,
          isDesktop ? styles.subtitleDesktop : styles.subtitleMobile
        ]}>
          Naadi uses SmartTools, an intelligent spot management system, to dynamically price classes and appointments and maximize your revenue.
        </Text>
        
        {/* Cards container - explicitly set to wrap properly */}
        <View style={[
          styles.cardsContainer,
          isDesktop ? styles.cardsRow : styles.cardsColumn
        ]}>
          {businessCardData.map(item => (
            <Card 
              key={item.id} 
              item={item} 
              isDesktopLayout={isDesktop}
            />
          ))}
        </View>
        
        {/* Button below cards */}
        <TouchableOpacity 
          onPress={() => router.push('/partners/how-it-works')} 
          style={styles.button}
        >
          <Text style={styles.buttonText}>Learn More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 30,
    width: '100%',
  },
  containerDesktop: {
    paddingHorizontal: 20,
  },
  containerMobile: {
    paddingHorizontal: 10,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  contentDesktop: {
    maxWidth: 1500,
  },
  contentMobile: {
    maxWidth: '100%',
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
    marginBottom: 30,
  },
  subtitleDesktop: {
    maxWidth: '80%',
  },
  subtitleMobile: {
    maxWidth: '95%',
  },
  cardsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  cardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardsColumn: {
    flexDirection: 'column',
    paddingHorizontal: 0,
  },
  cardContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    // Removing internal padding to ensure image container fits perfectly
    padding: 0,
  },
  cardContainerDesktop: {
    width: '31%',
  },
  cardContainerMobile: {
    width: '100%',
  },
  imageContainer: {
    width: '100%', // Same width as the card
    aspectRatio: 16/9,
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
    paddingHorizontal: 5, // Moving padding to text elements
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    paddingHorizontal: 5, // Moving padding to text elements
  },
  button: {
    backgroundColor: '#0077ff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});