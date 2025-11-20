import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import CustomText from '@/components/CustomText';
import { styles as sharedStyles } from '../../styles';
import { Ionicons } from '@expo/vector-icons';
import { getPlacesSuggestions, getPlaceDetails } from '@naadi/api';
import MapViewComponent from '../../../../../(main)/(protected)/(components)/(search)/MapViewComponent';

interface Step3LocationProps {
  locationQuery: string;
  setLocationQuery: (text: string) => void;
  selectedPlace: { address: string | null; location: { lat: number; lng: number } | null } | null;
  setSelectedPlace: (place: { address: string | null; location: { lat: number; lng: number } | null } | null) => void;
  noPhysicalLocation: boolean;
  setNoPhysicalLocation: (value: boolean) => void;
}

export default function Step3Location({
  locationQuery,
  setLocationQuery,
  selectedPlace,
  setSelectedPlace,
  noPhysicalLocation,
  setNoPhysicalLocation
}: Step3LocationProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const debounceTimer = useRef<number | null>(null);
  const mapRef = useRef(null);

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

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current as any);
    }
    if (locationQuery && locationQuery.length > 2 && !noPhysicalLocation && !selectedPlace) {
      debounceTimer.current = window.setTimeout(() => {
        fetchPlaceSuggestions(locationQuery);
      }, 400) as unknown as number;
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current as any);
    };
  }, [locationQuery, noPhysicalLocation, selectedPlace]);

  const handleSuggestionSelect = async (suggestion: any) => {
    const placeName = suggestion.description;
    try {
      const placeId = suggestion.place_id || suggestion._raw_placePrediction?.placeId || null;
      const data = await getPlaceDetails(placeId, placeName);
      if (data && data.success) {
        const addr = data.address || placeName;
        const loc = data.location || null;
        setLocationQuery(addr);
        setSelectedPlace({ address: addr, location: loc });
      } else {
        setLocationQuery(placeName);
        setSelectedPlace({ address: placeName, location: null });
      }
    } catch (err) {
      console.error('Error fetching place details:', err);
      setLocationQuery(placeName);
      setSelectedPlace({ address: placeName, location: null });
    } finally {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <View>
      <CustomText style={styles.stepTitle}>Add your location</CustomText>
      
      <View style={styles.sectionBox}>
        <CustomText style={styles.sectionHeader}>Business location</CustomText>
        
        <CustomText style={sharedStyles.label}>Where's your business located?</CustomText>
        <View style={{ zIndex: 100 }}>
          {selectedPlace ? (
            <View>
               <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <CustomText style={{ fontWeight: '600' }}>{selectedPlace.address}</CustomText>
                  <TouchableOpacity onPress={() => { setSelectedPlace(null); setLocationQuery(''); }}>
                     <CustomText style={{ color: '#4f46e5', fontWeight: '600' }}>Edit</CustomText>
                  </TouchableOpacity>
               </View>
               {selectedPlace.location && (
                  <View style={{ height: 200, borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
                     <MapViewComponent
                        mapRef={mapRef}
                        filteredVenues={[{
                          id: 'selected',
                          coordinate: { latitude: selectedPlace.location.lat, longitude: selectedPlace.location.lng },
                          type: 'business', services: [], activities: []
                        }]}
                        region={{
                          latitude: selectedPlace.location.lat,
                          longitude: selectedPlace.location.lng,
                          latitudeDelta: 0.001, // Zoomed in to street level
                          longitudeDelta: 0.001,
                        }}
                        singleVenueMode={true}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        animatedY={{ setValue: () => {} } as any}
                        handleCardPress={() => {}}
                        options={{ disableDefaultUI: true }} // Hide map buttons
                     />
                  </View>
               )}
            </View>
          ) : (
            <View style={{ zIndex: 200 }}>
              <View style={[sharedStyles.inputWrapper, { zIndex: 200 }]}>
                <Ionicons name="location-outline" size={20} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 12, zIndex: 1 }} />
                <TextInput 
                  style={[sharedStyles.input, { paddingLeft: 40 }]}
                  value={locationQuery} 
                  onChangeText={setLocationQuery} 
                  placeholder="" 
                />
              </View>
              {showSuggestions && suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  {suggestions.map((item, idx) => (
                    <TouchableOpacity key={idx} style={styles.suggestionItem} onPress={() => handleSuggestionSelect(item)}>
                      <CustomText>{item.description}</CustomText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
          
          {!selectedPlace && (
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, zIndex: 1 }} onPress={() => setNoPhysicalLocation(!noPhysicalLocation)}>
              <View style={[styles.checkbox, noPhysicalLocation && styles.checkboxChecked]}>
                {noPhysicalLocation && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <CustomText style={{ marginLeft: 8, color: '#475569' }}>I don't have a business address (mobile and online services only)</CustomText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 24,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    zIndex: 1000,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
});
