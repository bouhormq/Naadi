// Main search/map screen for venues, with filter and search modals
import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, LayoutAnimation, UIManager, Platform, Animated } from 'react-native';
import type MapView from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import { Ionicons, Octicons } from '@expo/vector-icons';

import MapViewComponent from '../(components)/(search)/MapViewComponent'; // Map display
import SearchBar from '../(components)/(search)/SearchBar'; // Top search bar
import BottomSheet from '../(components)/(search)/BottomSheet'; // Venue cards bottom sheet
import FilterModal from '../(components)/(search)/FilterModal'; // Modal for filters
import SearchModal from '../(components)/(search)/SearchModal'; // Modal for advanced search
import { venues } from '@naadi/assets/data/venues'; // Venue data
import { EstablishmentData } from '@naadi/types'; // Type definitions

// Enable layout animation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Venue type for filtering, extends base data with price
interface VenueForFilter extends EstablishmentData {
  price: number;
}

export default function MapScreen() {
  // Refs and state for map, modals, filters, search, and animation
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<any>(null); // Ref for BottomSheet
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'sortBy' | 'maxPrice' | 'venueType'>('all');
  const [filters, setFilters] = useState({
    sortBy: 'Recommended',
    venueType: 'Everyone',
    maxPrice: 700,
  });
  const [containerHeight, setContainerHeight] = useState(0);
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('Current location');
  const [searchCriteria, setSearchCriteria] = useState({
    activity: '',
    location: 'Current location',
    date: 'Any date',
    time: 'Any time',
  });
  const [isSheetExpanded, setSheetExpanded] = useState(false);
  const [sheetHeightAnim] = useState(new Animated.Value(0)); // 0 for collapsed, 1 for expanded

  // Animate sheet height when isSheetExpanded changes
  React.useEffect(() => {
    Animated.timing(sheetHeightAnim, {
      toValue: isSheetExpanded ? 1 : 0,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [isSheetExpanded]);

  const animatedY = useRef(new Animated.Value(0)).current;

  // Handle filter modal open
  const handleFilterPress = (filterType: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveFilter(filterType as 'all' | 'sortBy' | 'maxPrice' | 'venueType');
    setFilterModalVisible(true);
  };

  // Handle filter modal close
  const handleCloseFilter = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilterModalVisible(false);
  };

  // Apply new filters
  const handleApplyFilter = (newFilters: { sortBy: string; venueType: string; maxPrice: number }) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilterModalVisible(false);
    setFilters(newFilters);
  };

  // Open/close search modal
  const openSearchModal = () => setSearchModalVisible(true);
  const closeSearchModal = () => setSearchModalVisible(false);

  // Handle search submission from modal
  const handleSearch = (searchData: {
    activity: string;
    location: string;
    date: string;
    time: string;
  }) => {
    setSearchCriteria(searchData);
    const { activity, location, date, time } = searchData;

    // Helper to format date as dd-mm-yyyy
    const getFormattedDate = (d: Date) => {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const todayStr = getFormattedDate(today);
    const tomorrowStr = getFormattedDate(tomorrow);

    // Build search query string for display
    const searchItems = [];
    if (activity) {
      searchItems.push(activity);
    }

    const otherSearchItems = [];
    if (date !== 'Any date') {
      if (date === todayStr) {
        otherSearchItems.push('Today');
      } else if (date === tomorrowStr) {
        otherSearchItems.push('Tomorrow');
      } else {
        otherSearchItems.push(date);
      }
    }
    if (time !== 'Any time') otherSearchItems.push(time);

    if (!activity && otherSearchItems.length > 0) {
      searchItems.push('Any venue');
    }

    const allItems = [...searchItems, ...otherSearchItems];

    setSearchQuery(allItems.join(' ⋅ '));
    setSearchLocation(location);
    closeSearchModal();
  };

  // Main categories for activity filter
  const mainCategories = ['Beauty', 'Motors & Watercraft', 'Wellness', 'Fitness'];

  // Map venues to filterable format
  const mappedVenues: VenueForFilter[] = venues.map((v) => ({
    ...v,
    activities: v.activities ? v.activities.map((a: any) => a.name) : [],
    price: v.price,
    gender: v.gender,
    location: v.location,
  }));

  // Filter and sort venues based on filters and search criteria
  const filteredVenues = mappedVenues
    .filter(venue => {
      // Price filter
      const priceMatch = filters.maxPrice === 700 || venue.price <= filters.maxPrice;
      // Gender/venue type filter
      const venueTypeMatch =
        filters.venueType === 'Everyone' || venue.gender === filters.venueType;

      // Activity/category filter
      let activityMatch = true;
      if (searchCriteria.activity) {
        if (mainCategories.includes(searchCriteria.activity)) {
          activityMatch = venue.type === searchCriteria.activity;
        } else {
          activityMatch =
            Array.isArray(venue.activities) &&
            venue.activities.some((a: string) =>
              a.toLowerCase().includes(searchCriteria.activity.toLowerCase())
            );
        }
      }

      // Location filter
      const locationMatch =
        searchCriteria.location === 'Current location' ||
        (venue.location &&
          venue.location.toLowerCase().includes(searchCriteria.location.toLowerCase()));

      return priceMatch && venueTypeMatch && activityMatch && locationMatch;
    })
    .sort((a, b) => {
      // Sorting logic placeholder (can be expanded)
      switch (filters.sortBy) {
        case 'Top-rated':
        case 'Nearest':
        case 'Recommended':
        default:
          return 0;
      }
    }) as EstablishmentData[];

  // When a card is pressed, animate map to that venue, offset for bottom sheet
  const handleCardPress = useCallback((item: EstablishmentData, bottomSheetHeight: number) => {
    if (mapRef.current && containerHeight > 0) {
      const region = {
        latitude: item.coordinate.latitude,
        longitude: item.coordinate.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      const sheetHeightRatio = bottomSheetHeight / containerHeight;
      const latitudeOffset = (region.latitudeDelta * sheetHeightRatio) / 2;

      mapRef.current.animateToRegion({
        latitude: region.latitude - latitudeOffset,
        longitude: region.longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
      });
    }
    // Scroll to the card in BottomSheet
    if (bottomSheetRef.current && item.id) {
      bottomSheetRef.current.scrollToVenue(item.id);
    }
  }, [containerHeight]);

  // Handler for marker press from MapViewComponent
  const handleMarkerPress = (venueId: string) => {
    const venue = filteredVenues.find((v) => v.id === venueId);
    if (venue) {
      handleCardPress(venue, 300); // Approximate bottom sheet height
    }
  };

  const route = useRoute();

  // If coming from another screen with initial search params, trigger search
  React.useEffect(() => {
    // @ts-ignore
    const { initialActivity, triggerSearch } = route.params || {};
    if (triggerSearch && initialActivity) {
      handleSearch({
        activity: initialActivity,
        location: 'Current location',
        date: 'Any date',
        time: 'Any time',
      });
    }
  }, [route.params]);

  // Handler for list/search icon press
  const handleListIconPress = () => {
    if (!isSheetExpanded) {
      // Animate the bottom sheet to the top (translateY = 0)
      Animated.timing(animatedY, {
        toValue: 0,
        duration: 350,
        useNativeDriver: false,
      }).start();
    }
    setSheetExpanded((prev) => !prev);
  };

  // Render map, search bar, bottom sheet, and modals
  return (
    <View
      style={styles.container}
      onLayout={(event) => setContainerHeight(event.nativeEvent.layout.height)}
    >
      <MapViewComponent
        mapRef={mapRef}
        filteredVenues={filteredVenues}
        animatedY={animatedY}
        handleCardPress={handleCardPress}
        onMarkerPress={handleMarkerPress} // Pass handler
      />
      <SearchBar
        onPress={openSearchModal}
        searchQuery={searchQuery}
        searchLocation={searchLocation}
        icon={isSheetExpanded ? (
          <Ionicons name="map-outline" size={20} color="black" />
        ) : (
          <Octicons name="list-unordered" size={20} color="black" />
        )}
        onListIconPress={handleListIconPress}
      />
      <BottomSheet
        ref={bottomSheetRef}
        animatedY={animatedY}
        isFilterModalVisible={isFilterModalVisible}
        handleFilterPress={handleFilterPress}
        filters={filters}
        filteredVenues={filteredVenues}
        onCardPress={handleCardPress}
        isSheetExpanded={isSheetExpanded}
        sheetHeightAnim={sheetHeightAnim}
      />
      <FilterModal
        visible={isFilterModalVisible}
        onClose={handleCloseFilter}
        onApply={handleApplyFilter}
        activeFilter={activeFilter}
        initialFilters={filters}
      />
      <SearchModal
        visible={isSearchModalVisible}
        onClose={closeSearchModal}
        onSearch={handleSearch}
        searchCriteria={searchCriteria}
      />
    </View>
  );
}

// Styles for the main container
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});