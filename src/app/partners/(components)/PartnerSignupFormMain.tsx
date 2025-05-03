import { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Platform,
  ImageBackground,
  Animated,
  // Import specific style types
  FlexAlignType,
  FlexStyle,
  TextStyle,
  ViewStyle,
  ImageStyle,
} from 'react-native';
// Removed PartnerSignupRequest import as it's not used here anymore
import PartnerSignupFormContent from './PartnerSignupFormContent'; // Ensure the import path is correct
import CustomText from '@/components/CustomText';

// Define image source - ADJUST THE PATH AS NEEDED
const columnBackgroundImage = require('../(assets)/hero-background.webp');

// Define a type for the dynamic styles object if needed for clarity
type DynamicStyles = {
  pageContainer: ViewStyle;
  headerSection: ViewStyle;
  formSection: ViewStyle;
  mainTitle: TextStyle;
  mainSubtitle: TextStyle;
};

// Removed BusinessSignupFormProps interface

// Component signature changed to accept no props
export default function PartnerSignupFormMain() {
  // Remove t function call
  // const { t } = useTranslation();

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

  // Calculate dynamic styles with correct types
  const dynamicStyles: DynamicStyles = {
    pageContainer: {
      flexDirection: isWideScreen ? 'row' : 'column',
      minHeight: isWideScreen && Platform.OS === 'web' ? '100%' : undefined,
    },
    headerSection: {
      width: isWideScreen ? '50%' : '100%',
      justifyContent: 'center',
      alignItems: isWideScreen ? 'flex-start' : 'center',
      paddingHorizontal: isWideScreen ? '5%' : 20,
      paddingVertical: isWideScreen ? 40 : 30,
      marginBottom: isWideScreen ? 0 : 20,
    },
    formSection: {
      width: isWideScreen ? '50%' : '100%',
      justifyContent: isWideScreen ? 'center' : 'flex-start',
      alignItems: 'center',
      padding: isWideScreen ? 40 : 20,
      minHeight: isWideScreen ? '100%' : 'auto',
      flexGrow: isWideScreen ? 0 : 1,
    },
    mainTitle: {
      // Use a large numeric value for web font size, keep 32 for native
      fontSize: Platform.OS === 'web' ? 60 : 32,
      // Use a corresponding numeric value for web line height
      lineHeight: Platform.OS === 'web' ? 68 : 38,
      textAlign: isWideScreen ? 'left' : 'center',
    },
    mainSubtitle: {
       textAlign: isWideScreen ? 'left' : 'center',
    },
  };

  // --- Component Return --- Revert to original structure without direct t() calls
  return (
    <View style={[styles.pageContainerBase, dynamicStyles.pageContainer]}>
      {/* Left Column / Header Section */}
      <View style={[styles.headerSectionBase, dynamicStyles.headerSection]}>
         {/* Revert title structure */}
         <CustomText style={[styles.mainTitleBase, dynamicStyles.mainTitle]}>
           Increase the revenue of your {' '}
           <Animated.Text style={[styles.freeText, { opacity: fadeAnim }]}>
             {businessWords[currentWordIndex]}
           </Animated.Text>
           {' '}for <CustomText style={styles.freeText}>free</CustomText> with <CustomText style={styles.brandText}>Naadi</CustomText>
         </CustomText>

        {/* Subtitle is a single string, so CustomText handles its translation */}
        <CustomText style={[styles.mainSubtitleBase, dynamicStyles.mainSubtitle]}>
          List your business on Naadi to reach thousands of new customers, fill unbooked spots, and maximize your revenue.
        </CustomText>
      </View>

      {/* Right Column / Form Section (ImageBackground) */}
      <ImageBackground
        source={columnBackgroundImage}
        resizeMode="cover"
        style={[styles.formSectionBase, dynamicStyles.formSection]}
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
  headerSectionBase: {
    // Add any base styles for header section if needed
  },
  mainTitleBase: {
    //fontSize: Platform.OS === 'web' ? '7.5vh' : 32, // Base size moved to dynamic
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    //lineHeight: Platform.OS === 'web' ? '7.5vh' : 38, // Base lineHeight moved to dynamic
    maxWidth: 650,
  },
  freeText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  brandText: {
    fontWeight: 'bold',
  },
  mainSubtitleBase: {
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