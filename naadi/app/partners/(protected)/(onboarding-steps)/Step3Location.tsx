import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, FlatList } from 'react-native';
import CustomText from '@/components/CustomText';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@naadi/utils/onboarding/OnboardingContext';
import { getPlacesSuggestions, getPlaceDetails } from '@naadi/api';
import MapViewComponent from '../../../(main)/(protected)/(components)/(search)/MapViewComponent';

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Step3Location({ onNext, onBack }: Step4Props) {
  const router = useRouter();
  const { data, updateData, saveToFirebase, isSaving } = useOnboarding();
  const [location, setLocation] = useState<string>((data.businessLocation as unknown as string) || '');
  const [noPhysicalLocation, setNoPhysicalLocation] = useState<boolean>(data.noPhysicalLocation || false);
  const [localSaving, setLocalSaving] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const debounceTimer = useRef<number | null>(null);
  const mapRef = useRef(null);
  const inputWrapperRef = useRef<any>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (inputWrapperRef.current && !inputWrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showSuggestions]);

  const handleLocationChange = (text: string) => {
    setLocation(text);
    updateData('businessLocation', text);

    // Only show suggestions UI when there is enough input
    if (text.length > 2) {
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const fetchPlaceSuggestions = async (input: string) => {
    try {
      setSuggestionsLoading(true);
      const result = await getPlacesSuggestions(input);

      if (result && result.predictions) {
        setSuggestions(result.predictions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  // Debounce input changes to avoid firing on every keystroke
  useEffect(() => {
    // Clear any existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current as any);
      debounceTimer.current = null;
    }

    if (location && location.length > 2 && !noPhysicalLocation) {
      debounceTimer.current = window.setTimeout(() => {
        fetchPlaceSuggestions(location);
      }, 400) as unknown as number;
    } else {
      // not enough chars, clear suggestions
      setSuggestions([]);
      setSuggestionsLoading(false);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current as any);
        debounceTimer.current = null;
      }
    };
  }, [location, noPhysicalLocation]);

  const handleSuggestionSelect = (suggestion: any) => {
    const placeName = suggestion.description;
    // If suggestion contains a place_id or raw prediction, try to fetch coordinates and formatted address
    (async () => {
      try {
        const placeId = suggestion.place_id || suggestion._raw_placePrediction?.placeId || null;
        const data = await getPlaceDetails(placeId, placeName);

        if (data && data.success) {
          const addr = data.address || placeName;
          const loc = data.location || null;
          setLocation(addr);
          updateData('businessLocation', addr);
          setSelectedPlace({ address: addr, location: loc });
        } else {
          // fallback: set description only
          setLocation(placeName);
          updateData('businessLocation', placeName);
          setSelectedPlace({ address: placeName, location: null });
        }
      } catch (err) {
        console.error('Error fetching place details:', err);
        setLocation(placeName);
        updateData('businessLocation', placeName);
        setSelectedPlace({ address: placeName, location: null });
      } finally {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    })();
  };

  // Selected place details for rendering address + map
  const [selectedPlace, setSelectedPlace] = useState<{ address: string | null; location: { lat: number; lng: number } | null } | null>(null);

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
            <View style={styles.inputWrapper} ref={inputWrapperRef}>
              {/* If user selected a place, show the address + map block like the screenshot */}
              {selectedPlace ? (
                <View>
                  <View style={styles.addressHeaderRow}>
                    <CustomText style={styles.addressTitle}>Business address</CustomText>
                    <TouchableOpacity style={styles.editButton} onPress={() => { setSelectedPlace(null); setShowSuggestions(true); }}>
                      <CustomText style={styles.editButtonText}>Edit</CustomText>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.addressBlock}>
                    <CustomText style={styles.addressLine}>{selectedPlace.address}</CustomText>
                  </View>

                  {/* Map preview: use MapViewComponent like in appointments.tsx */}
                  {selectedPlace.location ? (
                    <View style={styles.mapWrapper}>
                      <MapViewComponent
                        mapRef={mapRef}
                        filteredVenues={[{
                          id: 'selected-location',
                          coordinate: {
                            latitude: selectedPlace.location.lat,
                            longitude: selectedPlace.location.lng,
                          },
                          type: 'business',
                          services: [],
                          activities: [],
                        }]}
                        animatedY={{ setValue: () => { } }}
                        handleCardPress={() => { }}
                        region={{
                          latitude: selectedPlace.location.lat,
                          longitude: selectedPlace.location.lng,
                          latitudeDelta: 0.001, // Street level detail - zoomed in more
                          longitudeDelta: 0.001,
                        }}
                        singleVenueMode={true}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        onMarkerPress={() => { }}
                        options={{ disableDefaultUI: true }}
                      />
                    </View>
                  ) : null}
                </View>
              ) : (
                <>
                  <TextInput
                    style={[styles.input, noPhysicalLocation && styles.inputDisabled]}
                    placeholder="Enter your business location"
                    placeholderTextColor="#94a3b8"
                    value={location}
                    onChangeText={handleLocationChange}
                    editable={!noPhysicalLocation}
                  />

                  {/* Suggestions Dropdown (debounced) */}
                  {showSuggestions && (suggestions.length > 0 || suggestionsLoading) && (
                    <View style={styles.suggestionsContainer}>
                      {suggestionsLoading && (
                        <View style={styles.suggestionItem}>
                          <ActivityIndicator size="small" color="#6b7280" />
                        </View>
                      )}
                      {!suggestionsLoading && (
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
                      )}
                    </View>
                  )}
                </>
              )}
            </View>
          </View>

          {/* No Physical Location Checkbox - Hide if location is selected (map visible) */}
          {!selectedPlace && (
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
          )}
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
    zIndex: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
  },
  inputWrapper: {
    position: 'relative',
    zIndex: 9999,
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
    zIndex: 99999,
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
  addressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a202c',
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  editButtonText: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
  },
  addressBlock: {
    marginBottom: 16,
  },
  addressLine: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  mapWrapper: {
    width: '100%',
    height: 280,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    // ensure no stacking is applied to the checkbox container
    position: 'relative',
    zIndex: 0,
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
