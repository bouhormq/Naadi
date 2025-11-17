import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, FlatList } from 'react-native';
import CustomText from '@/components/CustomText';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@naadi/utils/onboarding/OnboardingContext';
import { functions } from '@naadi/config/firebase';
import { httpsCallable } from 'firebase/functions';

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Step3Location({ onNext, onBack }: Step4Props) {
  const router = useRouter();
  const { data, updateData, saveToFirebase, isSaving } = useOnboarding();
  const [location, setLocation] = useState<string>(data.businessLocation || '');
  const [noPhysicalLocation, setNoPhysicalLocation] = useState<boolean>(data.noPhysicalLocation || false);
  const [localSaving, setLocalSaving] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleLocationChange = (text: string) => {
    setLocation(text);
    updateData('businessLocation', text);
    
    // Fetch suggestions from Google Places API
    if (text.length > 2) {
      fetchPlaceSuggestions(text);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const fetchPlaceSuggestions = async (input: string) => {
    try {
      const getPlacesSuggestions = httpsCallable(functions, 'getPlacesSuggestions');
      const result = await getPlacesSuggestions({ input });
      
      if (result.data && result.data.predictions) {
        setSuggestions(result.data.predictions);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSuggestionSelect = (suggestion: any) => {
    const placeName = suggestion.description;
    setLocation(placeName);
    updateData('businessLocation', placeName);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleNoPhysicalLocation = () => {
    const newValue = !noPhysicalLocation;
    setNoPhysicalLocation(newValue);
    updateData('noPhysicalLocation', newValue);
    
    // If checking "no location", clear the location field
    if (newValue) {
      setLocation('');
      updateData('businessLocation', '');
    }
  };

  const handleContinue = async () => {
    // Can continue if either has location OR has no physical location checked
    if (!location.trim() && !noPhysicalLocation) return;

    setLocalSaving(true);
    try {
      await saveToFirebase();
      onNext();
    } catch (error) {
      console.error('Error saving and continuing:', error);
      // TODO: Show error toast/alert
    } finally {
      setLocalSaving(false);
    }
  };

  const isLoading = isSaving || localSaving;
  const canContinue = (location.trim() || noPhysicalLocation) && !isLoading;

  return (
    <ScrollView style={styles.container}>
      {/* Header with Continue button in top right */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <CustomText style={styles.backText}>←</CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.continueButton, !canContinue && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <CustomText style={styles.continueButtonText}>Continue</CustomText>
          )}
        </TouchableOpacity>
      </View>

      {/* Main content with centered layout */}
      <View style={styles.contentWrapper}>
        {/* Account setup label */}
        <CustomText style={styles.accountSetupLabel}>Account setup</CustomText>

        {/* Title */}
        <CustomText style={styles.title}>Set your location</CustomText>

        {/* Subtitle */}
        <CustomText style={styles.subtitle}>
          Add your business location so your clients can easily find you.
        </CustomText>

        {/* Location Input */}
        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <CustomText style={styles.label}>Where's your business located?</CustomText>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, noPhysicalLocation && styles.inputDisabled]}
                placeholder="Enter your business location"
                placeholderTextColor="#94a3b8"
                value={location}
                onChangeText={handleLocationChange}
                editable={!noPhysicalLocation}
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  <FlatList
                    data={suggestions}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.suggestionItem}
                        onPress={() => handleSuggestionSelect(item)}
                      >
                        <CustomText style={styles.suggestionText}>
                          {item.description}
                        </CustomText>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </View>
          </View>

          {/* No Physical Location Checkbox */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={handleNoPhysicalLocation}
          >
            <View style={[styles.checkbox, noPhysicalLocation && styles.checkboxChecked]}>
              {noPhysicalLocation && (
                <CustomText style={styles.checkmark}>✓</CustomText>
              )}
            </View>
            <CustomText style={styles.checkboxLabel}>
              I don't have a business address (mobile and online services only)
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 20,
    color: '#64748b',
  },
  continueButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#cbd5e1',
    opacity: 0.6,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  contentWrapper: {
    marginLeft: '25%',
    marginRight: '25%',
    flex: 1,
    paddingBottom: 40,
  },
  accountSetupLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 16,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 21,
    marginBottom: 32,
  },
  formContainer: {
    gap: 24,
  },
  formGroup: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
  },
  inputWrapper: {
    position: 'relative',
    zIndex: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1a202c',
    backgroundColor: '#fff',
    outlineWidth: 0,
  },
  inputDisabled: {
    backgroundColor: '#f3f4f6',
    opacity: 0.6,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    maxHeight: 200,
    marginTop: -1,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  suggestionText: {
    fontSize: 13,
    color: '#1a202c',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a202c',
    flex: 1,
  },
});
