import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Platform, View, Text } from 'react-native';
import CustomText from '@/components/CustomText';
import { useFonts } from 'expo-font'; // Import useFonts
import { useTranslation } from 'react-i18next'; // Import useTranslation here
import { Redirect } from 'expo-router';

const App = () => {
  const { t } = useTranslation(); // Get the translation function

  // Load the specific emoji font here
  const [emojiFontLoaded, emojiFontError] = useFonts({
    'AppleColorEmoji': require('../../assets/fonts/AppleColorEmoji.ttf'), // Adjust path relative to this file
  });

  // Overall container fade-in
  const containerFadeAnim = useRef(new Animated.Value(0)).current; // Start fully transparent

  // Rotating business words
  const businessWords = ['fitness', 'wellness', 'beauty']; // Use keys
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const wordFadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity 1 for word

  const appVariant = process.env.EXPO_PUBLIC_APP_VARIANT || 'main';
  const isPartner = appVariant === 'partner';

  useEffect(() => {
    console.log(`[MainIndex] Loaded with app variant: ${appVariant}`);

    // Animate the container fade-in on mount
    Animated.timing(containerFadeAnim, {
      toValue: 1,
      duration: 900, // Adjust duration as needed
      useNativeDriver: true,
    }).start();

    // Existing word rotation logic
    const wordChangeInterval = setInterval(() => {
      Animated.timing(wordFadeAnim, { // Use wordFadeAnim here
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % businessWords.length);
        Animated.timing(wordFadeAnim, { // Use wordFadeAnim here
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 2750);

    return () => {
      clearInterval(wordChangeInterval);
    };
  }, [containerFadeAnim, wordFadeAnim, businessWords.length]); // Add dependencies

  // Add a safety check - if somehow we end up here in partner mode, redirect
  if (isPartner) {
    console.log('[MainIndex] ERROR: Partner variant reached main index - redirecting to partners');
    return <Redirect href="/partners" />;
  }

  // Render null or loading indicator until the emoji font is ready
  if (!emojiFontLoaded && !emojiFontError) {
    return (
      <View style={styles.container}> 
        {/* Optionally add a loading indicator */}
      </View>
    );
  }

  // Translate the current word before rendering
  const currentWordKey = businessWords[currentWordIndex];
  const translatedWord = t(currentWordKey);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Wrap content in Animated.View for fade-in */}
      <Animated.View style={[styles.textContainer, { opacity: containerFadeAnim }]}>
        {/* Construct the title manually, translating static parts */}
        <CustomText style={styles.mainTitle}>
          {/* Emoji with specific font */}
             <CustomText style={emojiFontLoaded ? { fontFamily: 'AppleColorEmoji' } : {}}>🛠️</CustomText>
          {' '}
          {/* Translate the static part - requires a matching key in JSON */}
          <CustomText>
             Coming soon... One app for all things
          </CustomText>
          {' '}
          {/* Render the translated dynamic word */}
          <Animated.Text style={[styles.freeText, { opacity: wordFadeAnim }]}>
            {translatedWord}
          </Animated.Text>
          {' '}
           {/* Emoji with specific font */}
             <CustomText style={emojiFontLoaded ? { fontFamily: 'AppleColorEmoji' } : {}}>✨</CustomText>
        </CustomText>
        
        {/* Pass the subtitle string directly as children */}
        <CustomText style={styles.mainSubtitle}>
          Naadi gives you access to hundreds of top-rated gyms, fitness studios, salons and spas in Morocco.
        </CustomText>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    justifyContent: 'center', // Vertically center content in the scroll view
    alignItems: 'center', // Horizontally center the content block
    paddingHorizontal: 20, // Add some horizontal padding
  },
  textContainer: {
    // This view acts as a container for the text elements
    // Its width will be determined by its content or maxWidth
    // We already centered its parent in the container style
    maxWidth: 750, // Limit the width of the text block
    width: '100%', // Allow the container to take full width up to maxWidth
  },
  headerSection: {
    width: '100%',
    // Centering content within the header section
    justifyContent: 'center',
    alignItems: 'center', // Align text left (wide) or center (narrow)
    paddingHorizontal: 20, // Use percentage padding? Or fixed.
    paddingVertical: 40, // Add vertical padding
    marginBottom: 30, // Space below header on narrow screens
  },
  mainTitle: {
    fontSize: Platform.OS === 'web' ? 57.6 : 48, // Responsive font size
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    lineHeight: Platform.OS === 'web' ? 57.6 : 54, // Responsive line height
    textAlign: 'center', // Center the text horizontally
  },
  freeText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  brandText: {
    fontWeight: 'bold',
    // Consider adding specific brand color if available
  },
  mainSubtitle: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    textAlign: 'center', // Center the text horizontally
  },
});

export default App;