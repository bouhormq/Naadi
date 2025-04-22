import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Platform,
  ImageBackground,
  Animated,
} from 'react-native';
// Removed PartnerSignupRequest import as it's not used here anymore
import PartnerSignupFormContent from './PartnerSignupFormContent'; // Ensure the import path is correct

// Define image source - ADJUST THE PATH AS NEEDED
const columnBackgroundImage = require('../(assets)/hero-background.webp');

// Removed BusinessSignupFormProps interface

// Component signature changed to accept no props
export default function PartnerSignupFormMain() {
  // Removed formData, loading, error state - managed by child now
  // Removed onSubmit prop from signature

  // Rotating business words (still relevant to the header)
  const businessWords = ['gym', 'studio', 'spa', 'hammam', 'restaurant', 'salon', 'yatch', 'jetski'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Set up the word rotation effect
  useEffect(() => {
    const wordChangeInterval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % businessWords.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 3000);

    return () => clearInterval(wordChangeInterval);
  }, [fadeAnim, businessWords.length]);

  // Dimension calculation (still needed for parent's layout)
  const { width } = useWindowDimensions();
  const isWideScreen = width > 800;

  // Removed handleChange and handleSubmit

  // --- Dynamic Styles calculated in Parent (only for overall layout) ---
  const pageContainerStyle = [
    styles.pageContainerBase,
    {
      flexDirection: isWideScreen ? 'row' : 'column',
      minHeight: isWideScreen && Platform.OS === 'web' ? '100vh' : undefined,
    },
  ];

  const headerSectionStyle = [
    styles.headerSectionBase,
    {
      width: isWideScreen ? '50%' : '100%',
      justifyContent: 'center',
      alignItems: isWideScreen ? 'flex-start' : 'center',
      paddingHorizontal: isWideScreen ? '5%' : 20,
      paddingVertical: isWideScreen ? 40 : 30,
      marginBottom: isWideScreen ? 0 : 20,
    },
  ];

  const formSectionStyle = [
    styles.formSectionBase,
    {
      width: isWideScreen ? '50%' : '100%',
      justifyContent: isWideScreen ? 'center' : 'flex-start',
      alignItems: 'center',
      padding: isWideScreen ? 40 : 20,
      minHeight: isWideScreen ? '100%' : 'auto',
      flexGrow: isWideScreen ? 0 : 1,
    },
  ];

  // --- Component Return ---
  return (
    <View style={pageContainerStyle}>
      {/* Left Column / Header Section */}
      <View style={headerSectionStyle}>
         <Text style={[styles.mainTitle, { textAlign: isWideScreen ? 'left' : 'center' }]}>
          Increase the revenue of your{' '}
          <Animated.Text style={[styles.freeText, { opacity: fadeAnim }]}>
            {businessWords[currentWordIndex]}
          </Animated.Text>
          {' '}for <Text style={styles.freeText}>free</Text> with <Text style={styles.brandText}>Naadi</Text>
        </Text>
        <Text style={[styles.mainSubtitle, { textAlign: isWideScreen ? 'left' : 'center' }]}>
          List your business on Naadi to reach thousands of new customers, fill unbooked spots, and maximize your revenue.
        </Text>
      </View>

      {/* Right Column / Form Section (ImageBackground) */}
      <ImageBackground
        source={columnBackgroundImage}
        resizeMode="cover"
        style={formSectionStyle}
        imageStyle={styles.formSectionBackgroundImage}
      >
        {/* Render the child component with NO props */}
        <PartnerSignupFormContent />
      </ImageBackground>
    </View>
  );
}

// --- Styles (Parent Specific - Layout and Header) ---
const styles = StyleSheet.create({
  pageContainerBase: {
    backgroundColor: '#eef2f7',
    width: '100%',
  },
  headerSectionBase: {}, // Base styles
  mainTitle: {
    fontSize: Platform.OS === 'web' ? '7.5vh' : 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    lineHeight: Platform.OS === 'web' ? '7.5vh' : 38,
    maxWidth: 650,
  },
  freeText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  brandText: {
    fontWeight: 'bold',
  },
  mainSubtitle: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    maxWidth: 650,
  },
  formSectionBase: {
    overflow: 'hidden',
  },
  formSectionBackgroundImage: {
    width: '100%',
    height: '100%',
  },
});