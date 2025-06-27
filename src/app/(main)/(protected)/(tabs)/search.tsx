// Example: app/screens/MapScreen.js
import React, { useRef, useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Text, TouchableOpacity, LayoutAnimation, UIManager, Platform } from 'react-native';
import type MapView from 'react-native-maps';
import type { Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

// Import your universal components
import CustomMapView, { Marker } from '../../../../components/Map/Map';
import CustomMarker from '../../../../components/Map/Marker/Markers';
import { venues } from '../venues';
import EstablishmentCard from '../(components)/EstablishmentCard';
import { EstablishmentData } from '../../../../../types';
import FilterModal from '../(components)/FilterModal';
import SearchModal from '../(components)/SearchModal';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const cardLayouts = useRef<{ [key: string]: number }>({});
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'sortBy' | 'maxPrice' | 'venueType'>('all');
  const [filters, setFilters] = useState({
    sortBy: 'Recommended',
    venueType: 'Everyone',
    maxPrice: 700,
  });
  const [bottomSheetHeight, setBottomSheetHeight] = useState(0);
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

  const renderCluster = (cluster: any) => {
    const { id, geometry, onPress, properties } = cluster;
    const points = properties.point_count;

    return (
      <Marker
        key={`cluster-${id}`}
        coordinate={{
          latitude: geometry.coordinates[1],
          longitude: geometry.coordinates[0],
        }}
        onPress={onPress}
      >
        <View style={styles.clusterContainer}>
          <Text style={styles.clusterText}>{points}</Text>
        </View>
      </Marker>
    );
  };

  const defaultFilters = {
    sortBy: 'Recommended',
    venueType: 'Everyone',
    maxPrice: 700,
  };

  const sortByAltered = filters.sortBy !== defaultFilters.sortBy;
  const venueTypeAltered = filters.venueType !== defaultFilters.venueType;
  const maxPriceAltered = filters.maxPrice !== defaultFilters.maxPrice;

  const anyFilterAltered = sortByAltered || venueTypeAltered || maxPriceAltered;

  const initialRegion: Region = {
    latitude: 35.5785, // Tetouan
    longitude: -5.3684,
    latitudeDelta: 0.2, // Zoom out to see more markers
    longitudeDelta: 0.1,
  };

  const moroccoBounds = {
    north: 36,
    south: 21,
    west: -17.5,
    east: -1,
  };

  const onRegionChangeComplete = (region: Region) => {
    const { latitude, longitude } = region;

    let newLatitude = latitude;
    let newLongitude = longitude;

    if (latitude > moroccoBounds.north) {
      newLatitude = moroccoBounds.north;
    } else if (latitude < moroccoBounds.south) {
      newLatitude = moroccoBounds.south;
    }

    if (longitude > moroccoBounds.east) {
      newLongitude = moroccoBounds.east;
    } else if (longitude < moroccoBounds.west) {
      newLongitude = moroccoBounds.west;
    }

    if (newLatitude !== latitude || newLongitude !== longitude) {
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          ...region,
          latitude: newLatitude,
          longitude: newLongitude,
        });
      }
    }
  };

  const handleFilterPress = (filterType: 'all' | 'sortBy' | 'maxPrice' | 'venueType') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveFilter(filterType);
    setFilterModalVisible(true);
  };

  const handleCloseFilter = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilterModalVisible(false);
  };

  const handleApplyFilter = (newFilters: { sortBy: string; venueType: string; maxPrice: number }) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilterModalVisible(false);
    setFilters(newFilters);
  };

  const handleMarkerPress = (venueId: string) => {
    const yPosition = cardLayouts.current[venueId];
    if (yPosition !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: yPosition, animated: true });
    }
    const venue = venues.find((v) => v.id === venueId);
    if (venue) {
      handleCardPress(venue);
    }
  };

  const handleCardPress = (item: EstablishmentData) => {
    if (mapRef.current && containerHeight > 0) {
      const region = {
        latitude: item.coordinate.latitude,
        longitude: item.coordinate.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      const sheetHeightRatio = bottomSheetHeight / containerHeight;
      
      // The offset needed to counteract the bottom sheet
      const latitudeOffset = (region.latitudeDelta * sheetHeightRatio) / 2;

      mapRef.current.animateToRegion({
        latitude: region.latitude - latitudeOffset,
        longitude: region.longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
      });
    }
  };

  const openSearchModal = () => setSearchModalVisible(true);
  const closeSearchModal = () => setSearchModalVisible(false);

  const handleSearch = (searchData: {
    activity: string;
    location: string;
    date: string;
    time: string;
  }) => {
    setSearchCriteria(searchData);
    const { activity, location, date, time } = searchData;

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

  const filteredVenues = venues
    .filter(venue => {
      const priceMatch = filters.maxPrice === 700 || venue.price <= filters.maxPrice;
      const venueTypeMatch =
        filters.venueType === 'Everyone' || venue.gender === filters.venueType;

      const activityMatch =
        !searchCriteria.activity ||
        (venue.name &&
          venue.name.toLowerCase().includes(searchCriteria.activity.toLowerCase()));

      const locationMatch =
        searchCriteria.location === 'Current location' ||
        (venue.address &&
          venue.address.toLowerCase().includes(searchCriteria.location.toLowerCase()));

      return priceMatch && venueTypeMatch && activityMatch && locationMatch;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'Top-rated':
          return b.rating - a.rating;
        case 'Nearest':
          // Add logic for nearest sorting if location is available
          return 0;
        case 'Recommended':
        default:
          return 0;
      }
    });

  const AnyMapView = CustomMapView as any;

  return (
    <View
      style={styles.container}
      id="map-screen"
      onLayout={(event) => setContainerHeight(event.nativeEvent.layout.height)}
    >
      {/* Ensure the map fills the screen */}
      <AnyMapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        onRegionChangeComplete={onRegionChangeComplete}
        renderCluster={renderCluster}
        radius={500} // Increase cluster radius
      >
        {filteredVenues.map((venue) => (
          <CustomMarker
            key={venue.id}
            coordinate={venue.coordinate}
            onPress={() => handleMarkerPress(venue.id)}
            type={venue.type}
          />
        ))}
      </AnyMapView>
      <TouchableOpacity style={styles.searchContainer} onPress={openSearchModal}>
        <Ionicons name="search" size={24} color="black" style={styles.searchIcon} />
        <View style={{ flex: 1, marginLeft: 10 }} pointerEvents="none">
          <TextInput
            placeholder="Any venue"
            style={styles.searchInput}
            placeholderTextColor="black"
            editable={false} // To prevent keyboard from showing up
            value={searchQuery}
          />
          <Text style={styles.locationText}>{searchLocation}</Text>
        </View>
        <View style={styles.listIconContainer}>
          <Ionicons name="map-outline" size={20} color="black" />
        </View>
      </TouchableOpacity>
      <View
        style={[styles.bottomSheet, isFilterModalVisible && { height: '75%' }]}
        onLayout={(event) => setBottomSheetHeight(event.nativeEvent.layout.height)}
      >
        <View style={styles.filterButtonsContainer}>
            <TouchableOpacity style={[styles.filterChip, anyFilterAltered && styles.activeFilterChip]} onPress={() => handleFilterPress('all')}>
            <Ionicons name="options-outline" size={18} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterChip, sortByAltered && styles.activeFilterChip]} onPress={() => handleFilterPress('sortBy')}>
            <Text style={styles.filterText}>Sort by</Text>
            <Ionicons name="chevron-down-outline" size={18} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterChip, maxPriceAltered && styles.activeFilterChip]} onPress={() => handleFilterPress('maxPrice')}>
            <Text style={styles.filterText}>Max price</Text>
            <Ionicons name="chevron-down-outline" size={18} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterChip, venueTypeAltered && styles.activeFilterChip]} onPress={() => handleFilterPress('venueType')}>
            <Text style={styles.filterText}>Venue type</Text>
            <Ionicons name="chevron-down-outline" size={18} />
            </TouchableOpacity>
        </View>
        <Text style={styles.bottomSheetTitle}>{filteredVenues.length} venues nearby</Text>
        <ScrollView ref={scrollViewRef}>
          {filteredVenues.map((venue) => (
            <View
              key={venue.id}
              onLayout={(event) => {
                cardLayouts.current[venue.id] = event.nativeEvent.layout.y;
              }}
            >
              <EstablishmentCard
                item={venue as EstablishmentData}
                layout="vertical"
                onPress={() => handleCardPress(venue)}
              />
            </View>
          ))}
        </ScrollView>
      </View>
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    fontSize: 16,
    fontWeight: '500',
  },
  locationText: {
    color: 'gray',
    fontSize: 14,
  },
  listIconContainer: {
    marginLeft: 10,
    height: 36,
    width: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  filterChip: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeFilterChip: {
    borderColor: '#3674B5',
  },
  filterText: {
    marginRight: 5,
    fontSize: 14,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '50%',
  },
  bottomSheetTitle: {
    fontSize: 13,
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  clusterContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3674B5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  clusterText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
