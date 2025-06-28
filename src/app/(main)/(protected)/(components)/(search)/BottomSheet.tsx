// BottomSheet component: displays a draggable, animated sheet with venue cards and filter controls
import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EstablishmentCard from '../EstablishmentCard';
import { EstablishmentData } from '@naadi/types';

// Get device screen height for sheet sizing
const { height: screenHeight } = Dimensions.get('window');

// Props for BottomSheet
// animatedY: shared animated value for vertical position
// isFilterModalVisible: disables drag/scroll when true
// handleFilterPress: opens filter modal for a filter type
// filters: current filter state
// filteredVenues: venues to display
// onCardPress: callback when a card is pressed
type BottomSheetProps = {
  animatedY: Animated.Value;
  isFilterModalVisible: boolean;
  handleFilterPress: (filterType: string) => void;
  filters: {
    sortBy: string;
    venueType: string;
    maxPrice: number;
  };
  filteredVenues: EstablishmentData[];
  onCardPress: (venue: EstablishmentData, bottomSheetHeight: number) => void;
};

export default function BottomSheet({
  animatedY,
  isFilterModalVisible,
  handleFilterPress,
  filters,
  filteredVenues,
  onCardPress,
}: BottomSheetProps) {
  // State for sheet and header heights
  const [bottomSheetHeight, setBottomSheetHeight] = useState(0);
  const [bottomSheetHeaderHeight, setBottomSheetHeaderHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const cardLayouts = useRef<{ [key: string]: number }>({});

  // Calculate default and snap positions for the sheet
  const sheetHeight = screenHeight * 0.5;
  const snapPositionTop = 0;
  const snapPositionBottom = bottomSheetHeaderHeight > 0 ? sheetHeight - bottomSheetHeaderHeight - 20 : 0;

  // Track current animatedY value
  const animatedYValue = useRef(snapPositionTop);
  animatedY.addListener(({ value }) => (animatedYValue.current = value));

  // PanResponder for drag-to-expand/collapse
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (isFilterModalVisible) return false;
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => animatedY.setOffset(animatedYValue.current),
      onPanResponderMove: Animated.event([null, { dy: animatedY }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gestureState) => {
        animatedY.flattenOffset();
        const { vy } = gestureState;
        const currentPosition = animatedYValue.current;

        // Snap to top or bottom based on velocity/position
        if (snapPositionBottom > 0) {
          if (vy > 0.5 || currentPosition > snapPositionBottom / 2) {
            Animated.spring(animatedY, { toValue: snapPositionBottom, useNativeDriver: false }).start();
          } else {
            Animated.spring(animatedY, { toValue: snapPositionTop, useNativeDriver: false }).start();
          }
        }
      },
    })
  ).current;

  // Interpolate animatedY for sheet translation
  const translateY = animatedY.interpolate({
    inputRange: [snapPositionTop, snapPositionBottom > 0 ? snapPositionBottom : 1],
    outputRange: [snapPositionTop, snapPositionBottom > 0 ? snapPositionBottom : 1],
    extrapolate: 'clamp',
  });

  // Default filter values for comparison
  const defaultFilters = {
    sortBy: 'Recommended',
    venueType: 'Everyone',
    maxPrice: 700,
  };

  // Track if any filter is altered from default
  const sortByAltered = filters.sortBy !== defaultFilters.sortBy;
  const venueTypeAltered = filters.venueType !== defaultFilters.venueType;
  const maxPriceAltered = filters.maxPrice !== defaultFilters.maxPrice;
  const anyFilterAltered = sortByAltered || venueTypeAltered || maxPriceAltered;

  // Render animated bottom sheet with filter chips and venue cards
  return (
    <Animated.View
      style={[
        styles.bottomSheet,
        isFilterModalVisible && { height: '75%' },
        { transform: [{ translateY }] },
      ]}
      onLayout={(event) => {
        if (bottomSheetHeight === 0) {
          setBottomSheetHeight(event.nativeEvent.layout.height);
        }
      }}
    >
      {/* Header: drag handle, filter chips, and title */}
      <View
        {...panResponder.panHandlers}
        onLayout={(event) => {
          if (bottomSheetHeaderHeight === 0) {
            setBottomSheetHeaderHeight(event.nativeEvent.layout.height);
          }
        }}
      >
        <View style={styles.grabber} />
        <View style={styles.filterButtonsContainer}>
          {/* All filters chip */}
          <TouchableOpacity style={[styles.filterChip, anyFilterAltered && styles.activeFilterChip]} onPress={() => handleFilterPress('all')}>
            <Ionicons name="options-outline" size={18} />
          </TouchableOpacity>
          {/* Sort by chip */}
          <TouchableOpacity style={[styles.filterChip, sortByAltered && styles.activeFilterChip]} onPress={() => handleFilterPress('sortBy')}>
            <Text style={styles.filterText}>Sort by</Text>
            <Ionicons name="chevron-down-outline" size={18} />
          </TouchableOpacity>
          {/* Max price chip */}
          <TouchableOpacity style={[styles.filterChip, maxPriceAltered && styles.activeFilterChip]} onPress={() => handleFilterPress('maxPrice')}>
            <Text style={styles.filterText}>Max price</Text>
            <Ionicons name="chevron-down-outline" size={18} />
          </TouchableOpacity>
          {/* Venue type chip */}
          <TouchableOpacity style={[styles.filterChip, venueTypeAltered && styles.activeFilterChip]} onPress={() => handleFilterPress('venueType')}>
            <Text style={styles.filterText}>Venue type</Text>
            <Ionicons name="chevron-down-outline" size={18} />
          </TouchableOpacity>
        </View>
        <Text style={styles.bottomSheetTitle}>{filteredVenues.length} venues nearby</Text>
      </View>
      {/* Venue cards list */}
      <ScrollView ref={scrollViewRef} scrollEnabled={!isFilterModalVisible}>
        {filteredVenues.map((venue) => (
          <View
            key={venue.id}
            onLayout={(event) => (cardLayouts.current[venue.id] = event.nativeEvent.layout.y)}
          >
            <EstablishmentCard
              item={venue as EstablishmentData}
              layout="vertical"
              onPress={() => onCardPress(venue, bottomSheetHeight)}
            />
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

// Styles for the bottom sheet and its elements
const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 8,
    height: '50%',
  },
  grabber: {
    width: 100,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 12,
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
  bottomSheetTitle: {
    fontSize: 13,
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
});