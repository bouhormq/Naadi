import { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView, // Import ScrollView
  Platform // Import Platform for potential platform-specific styles
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import CustomText from '@/components/CustomText';
import i18n from '../../../utils/languageDetector/i18n'; // Correct the relative path to i18n.js

// Replace with your actual PNG paths
const appleStorePng = require('../(assets)/appleStore.png');
const googlePlayPng = require('../(assets)/googlePlay.png');

export default function Footer() {
  const [isLanguageDropdownVisible, setIsLanguageDropdownVisible] = useState(false);
  const navigation = useNavigation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'ma', name: 'Darija' },
    { code: 'es', name: 'Español' },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    // Initialize selected language based on current i18n language
    const currentLangCode = i18n.language;
    return languages.find(lang => lang.code === currentLangCode) || languages[0];
  });

  const changeLanguage = (language: { code: string; name: string }) => {
    setSelectedLanguage(language);
    setIsLanguageDropdownVisible(false);
    i18n.changeLanguage(language.code); // Change the language globally
    console.log('Language changed to:', language.code);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownVisible(!isLanguageDropdownVisible);
  };

  return (
    <View style={styles.container}>
      {/* Company Section */}
      <View style={styles.section}>
        <CustomText style={styles.sectionTitle}>Company</CustomText>
        <TouchableOpacity style={styles.linkItem}>
          <CustomText onPress={() => router.push('/partners')} style={styles.linkText}>About us</CustomText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkItem}>
          <CustomText onPress={() => router.push('/partners/how-it-works')} style={styles.linkText}>How it works</CustomText>
        </TouchableOpacity>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <CustomText style={styles.sectionTitle}>Support</CustomText>
        <TouchableOpacity style={styles.linkItem}>
          <CustomText onPress={() => router.push('/partners/contact')} style={styles.linkText}>Contact Us</CustomText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkItem}>
          <CustomText onPress={() => router.push('/partners/faq')} style={styles.linkText}>FAQ</CustomText>
        </TouchableOpacity>
      </View>

      {/* Partners Section */}
      <View style={styles.section}>
        <CustomText style={styles.sectionTitle}>Partners</CustomText>
        <TouchableOpacity style={styles.linkItem}>
          <CustomText onPress={() => router.push('/partners/signup')} style={styles.linkText}>Become a Partner</CustomText>
        </TouchableOpacity>
      </View>

      {/* Language Section */}
      <View style={[styles.section, styles.languageSection]}> {/* Added languageSection style */}
        <CustomText style={styles.sectionTitle}>Language</CustomText>
        {/* Language Selector */}
        <TouchableOpacity
          style={styles.languageSelector}
          onPress={toggleLanguageDropdown}
        >
          <CustomText style={styles.linkText}>{selectedLanguage.name}</CustomText>
          <Ionicons name={isLanguageDropdownVisible ? "chevron-up" : "chevron-down"} size={16} color="#fff" style={styles.chevron} />
        </TouchableOpacity>

        {/* Language Dropdown */}
        {isLanguageDropdownVisible && (
           <View style={styles.dropdownContainer}>
            <ScrollView style={styles.dropdownScrollView}>
              {languages.map((language, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.languageOption,
                    selectedLanguage.code === language.code && styles.selectedLanguage
                  ]}
                  onPress={() => changeLanguage(language)}
                >
                  <CustomText style={styles.languageOptionText}>{language.name}</CustomText>
                  {selectedLanguage.code === language.code && (
                    <Ionicons name="checkmark" size={18} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Mobile App Section */}
      <View style={styles.mobileSection}>
        <CustomText style={styles.mobileSectionTitle}>Enjoy everything on the go</CustomText>
        <View style={styles.appButtons}>
          <TouchableOpacity style={styles.appButton}>
            <View style={styles.svgContainer}>
              <Image source={appleStorePng} style={{ width: 135, height: 40 }} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.appButton}>
            <View style={styles.svgContainer}>
              <Image source={googlePlayPng} style={{ width: 135, height: 40 }} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    paddingVertical: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    zIndex: 1, // Ensure footer has a zIndex if needed
  },
  section: {
    width: '23%',
    marginBottom: 30,
  },
  languageSection: {
    // Make the language section a positioning context for the absolute dropdown
    position: 'relative',
    zIndex: 10, // Ensure the language section has a good zIndex
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    marginTop: 20,
  },
  linkItem: {
    marginBottom: 10,
  },
  linkText: {
    fontSize: 14,
    color: '#fff',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#000',
    justifyContent: 'space-between',
    borderWidth: 1,
    zIndex: 1, // Ensure selector is above other elements in the section
  },
  chevron: {
    marginLeft: 5,
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%', // Position below the language selector
    left: 0,
    right: 0,
    backgroundColor: '#222',
    borderRadius: 5,
    zIndex: 999, // Use a very high zIndex for the dropdown
    maxHeight: 150, // Added a max height for scrollability
    ...Platform.select({ // Added platform-specific elevation for Android zIndex
      android: {
        elevation: 20,
      },
    }),
    // Ensure the dropdown container can receive touch events - box-none allows touches on children
     pointerEvents: 'box-none',
  },
   dropdownScrollView: {
    flexGrow: 1,
    // Added paddingBottom to ensure the last item is fully visible above the scrollbar
    paddingBottom: 5,
  },
  languageOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#fff',
  },
  selectedLanguage: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  mobileSection: {
    width: '100%',
    marginTop: 30,
    marginBottom: 30,
  },
  appButtons: {
    flexDirection: 'row',
  },
  appButton: {
    marginRight: 20,
  },
  svgContainer: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  mobileSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  }
});