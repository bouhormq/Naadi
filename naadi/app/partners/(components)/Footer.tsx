import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

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
    { code: 'ar', name: 'العربية' },
    { code: 'es', name: 'Español' }
  ];

  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const changeLanguage = (language: { code: string; name: string }) => {
    setSelectedLanguage(language);
    setIsLanguageDropdownVisible(false);
    console.log('language', language);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownVisible(!isLanguageDropdownVisible);
  };

  return (
    <View style={styles.container}>
      {/* Company Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Company</Text>
        <TouchableOpacity style={styles.linkItem}>
          <Text onPress={() => router.push('/partners')} style={styles.linkText}>About us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkItem}>
          <Text onPress={() => router.push('/partners/how-it-works')} style={styles.linkText}>How it works</Text>
        </TouchableOpacity>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity style={styles.linkItem}>
          <Text onPress={() => router.push('/partners/contact')} style={styles.linkText}>Contact Us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkItem}>
          <Text onPress={() => router.push('/partners/faq')} style={styles.linkText}>FAQ</Text>
        </TouchableOpacity>
      </View>

      {/* Partners Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Partners</Text>
        <TouchableOpacity style={styles.linkItem}>
          <Text onPress={() => router.push('/partners/signup')} style={styles.linkText}>Become a Partner</Text>
        </TouchableOpacity>
      </View>

      {/* Language Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Language</Text>
        <View>
          <TouchableOpacity
            style={styles.languageSelector}
            onPress={toggleLanguageDropdown}
          >
            <Text style={styles.linkText}>{selectedLanguage.name}</Text>
            <Ionicons name="chevron-down" size={16} color="#fff" style={styles.chevron} />
          </TouchableOpacity>

          {isLanguageDropdownVisible && (
            <View style={styles.dropdownContainer}>
              {languages.map((language, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.languageOption,
                    selectedLanguage.code === language.code && styles.selectedLanguage
                  ]}
                  onPress={() => changeLanguage(language)}
                >
                  <Text style={styles.languageOptionText}>{language.name}</Text>
                  {selectedLanguage.code === language.code && (
                    <Ionicons name="checkmark" size={18} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Mobile App Section */}
      <View style={styles.mobileSection}>
        <Text style={styles.mobileSectionTitle}>Enjoy fitness on the go</Text>
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
    justifyContent: 'space-between'
  },
  section: {
    width: '23%',
    marginBottom: 30,
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
  },
  chevron: {
    marginLeft: 5,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 40, // Adjust based on the height of the language selector
    left: 0,
    right: 0,
    backgroundColor: '#222',
    borderRadius: 5,
    overflow: 'hidden',
    zIndex: 10,
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  mobileSection: {
    width: '100%',
    marginTop: 30,
    marginBottom: 30,
  },
  mobileSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
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
  bottomSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  socialIcons: {
    flexDirection: 'row',
  },
  socialIcon: {
    marginRight: 20,
  },
  legalLinks: {
    flexDirection: 'row',
  },
  legalItem: {
    marginLeft: 20,
  },
  legalText: {
    fontSize: 14,
    color: '#fff',
  },
});