import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Animated, // Import the hook
} from 'react-native';

// Import the new component
import PartnerSignupFormContent from './PartnerSignupFormContent';

export default function PartnerSignupForm() {

  // Rotating business words
  const businessWords = ['gym', 'studio', 'spa', 'hammam', 'restaurant', 'salon', 'yatch', 'jetski'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity 1


  // Set up the word rotation effect
  useEffect(() => {
    const wordChangeInterval = setInterval(() => {
      // Start fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500, // Fade out over 0.5 seconds
        useNativeDriver: true,
      }).start(() => {
        // Change word when fully faded out
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % businessWords.length);
        
        // Start fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500, // Fade in over 0.5 seconds
          useNativeDriver: true,
        }).start();
      });
    }, 3000); // Total 2.5 seconds per word

    // Clean up interval on unmount
    return () => clearInterval(wordChangeInterval);
  }, [fadeAnim, businessWords.length]);

  // Get window dimensions to apply responsive styles
  const { width } = useWindowDimensions();
  const isWideScreen = width > 800;

  // Define dynamic styles based on screen size - KEEP THESE HERE
  // These styles are calculated here and passed down
  const headerSectionStyle = [
    styles.header,
    {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: isWideScreen ? '5%' : 20,
      paddingVertical: isWideScreen ? 40 : 30,
      marginBottom: isWideScreen ? 0 : 20,
    },
  ];


  return (
    <View style={styles.container}>
      <View style={headerSectionStyle}>
        <Text style={styles.title}>
          List your{' '}
          <Animated.View style={{ opacity: fadeAnim, display: 'inline' }}>
            <Text style={styles.highlight}>{businessWords[currentWordIndex]}</Text>
          </Animated.View>
          {' '}on Naadi for <Text style={styles.highlight}>free</Text> to start earning more today.
        </Text>
        <Text style={styles.subtitle}>
          List your business on Naadi to reach thousands of new customers, fill unbooked spots, and maximize your revenue.
        </Text>
      </View>

      {/* Use the new component here - formWrapper with margins is inside it */}
      <PartnerSignupFormContent/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f7ff',
    paddingVertical: 40,
    // --- ADDED FOR HORIZONTAL MARGINS ---
    paddingHorizontal: 20, // Add padding to the main container
    alignItems: 'center'
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    // If you want the header text/content to also respect the padding,
    // ensure it doesn't have conflicting styles or add padding/margin
    // to an inner View within the header if needed.
    // With paddingHorizontal on the container, the header content
    // is already implicitly constrained by the padding.
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
    // Ensure max width doesn't make it too wide inside padding
    maxWidth: 620, // Or a specific value if needed
  },
  highlight: {
    color: '#0077ff',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    // Ensure max width doesn't make it too wide inside padding
    maxWidth: 500, // Or a specific value if needed
  },
  // Removed form-specific styles from here
  // formWrapper, formContainer, formHeader, formTitle, etc.
  // are now in BusinessSignupFormContent.tsx
});