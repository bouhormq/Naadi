import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, View, Text, Platform } from 'react-native';


const App = () => {
  // Rotating business words
  const businessWords = ['fitness', 'wellness', 'beauty'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity 1

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
       <View style={styles.textContainer}> {/* Added a container for centering */}
         <Text style={[styles.mainTitle]}>
         🛠️ Coming soon... One app for all things{' '}
          <Animated.View style={{ opacity: fadeAnim, display: 'inline' }}>
            <Text style={styles.freeText}>{businessWords[currentWordIndex]}</Text>
          </Animated.View>
          ✨
        </Text>
        <Text style={[styles.mainSubtitle]}>
          Naadi gives you access to hundreds of top-rated gyms, fitness studios, salons and spas in Morocco.
        </Text>
      </View>
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
  headerSection:{
    width: '100%',
    // Centering content within the header section
    justifyContent: 'center',
    alignItems: 'center', // Align text left (wide) or center (narrow)
    paddingHorizontal: 20, // Use percentage padding? Or fixed.
    paddingVertical: 40, // Add vertical padding
    marginBottom:  30, // Space below header on narrow screens
  },
  mainTitle: {
    fontSize: Platform.OS === 'web' ? 57.6 : 48, // Responsive font size
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    lineHeight: Platform.OS === 'web' ? 57.6 : 54, // Responsive line height
    textAlign: 'center', // Center the text horizontally
    // maxWidth: 650, // Moved maxWidth to textContainer
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
    // maxWidth: 650, // Moved maxWidth to textContainer
  },
});

export default App;