import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

// A simple radio button component for the sort options
const SortByOption = ({ label, selected, onSelect }: { label: string, selected: boolean, onSelect: () => void }) => (
    <TouchableOpacity style={styles.radioButtonContainer} onPress={onSelect} activeOpacity={1}>
        <Text style={styles.radioLabel}>{label}</Text>
        <View style={[styles.radioButton, selected && styles.radioButtonSelected]} />
    </TouchableOpacity>
);

// A button for venue type selection
const VenueTypeButton = ({ label, selected, onPress }: { label: string, selected: boolean, onPress: () => void }) => (
  <TouchableOpacity
    style={[styles.venueTypeButton, selected && styles.venueTypeButtonSelected]}
    onPress={onPress}
  >
    <Text style={[styles.venueTypeButtonText, selected && styles.venueTypeButtonTextSelected]}>{label}</Text>
  </TouchableOpacity>
);

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: { sortBy: string; venueType: string; maxPrice: number }) => void;
  activeFilter: 'all' | 'sortBy' | 'maxPrice' | 'venueType';
  initialFilters: { sortBy: string; venueType: string; maxPrice: number };
}

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply, activeFilter, initialFilters }) => {
  const [sortBy, setSortBy] = useState(initialFilters.sortBy);
  const [venueType, setVenueType] = useState(initialFilters.venueType);
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice);

  React.useEffect(() => {
    if (visible) {
      setSortBy(initialFilters.sortBy);
      setVenueType(initialFilters.venueType);
      setMaxPrice(initialFilters.maxPrice);
    }
  }, [visible, initialFilters]);

  const handleClear = () => {
    switch (activeFilter) {
      case 'sortBy':
        setSortBy('Recommended');
        break;
      case 'maxPrice':
        setMaxPrice(700);
        break;
      case 'venueType':
        setVenueType('Everyone');
        break;
      default:
        setSortBy('Recommended');
        setVenueType('Everyone');
        setMaxPrice(700);
        break;
    }
  };

  const handleApply = () => {
    onApply({ sortBy, venueType, maxPrice });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={onClose}>
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="black" />
            </TouchableOpacity>
          </View>

          {(activeFilter === 'all' || activeFilter === 'sortBy') && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort by</Text>
              <SortByOption label="Recommended" selected={sortBy === 'Recommended'} onSelect={() => setSortBy('Recommended')} />
              <SortByOption label="Nearest" selected={sortBy === 'Nearest'} onSelect={() => setSortBy('Nearest')} />
              <SortByOption label="Top-rated" selected={sortBy === 'Top-rated'} onSelect={() => setSortBy('Top-rated')} />
            </View>
          )}

          {(activeFilter === 'all' || activeFilter === 'maxPrice') && (
            <View style={styles.section}>
              <View style={styles.priceHeader}>
                <Text style={styles.sectionTitle}>Maximum price</Text>
                <Text style={styles.priceValue}>{maxPrice} MAD{maxPrice === 700 ? '+' : ''}</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={700}
                step={50}
                value={maxPrice}
                onValueChange={setMaxPrice}
                minimumTrackTintColor="#3674B5"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#3674B5"
              />
            </View>
          )}

          {(activeFilter === 'all' || activeFilter === 'venueType') && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Venue type</Text>
              <View style={styles.venueTypeContainer}>
                  <VenueTypeButton label="Everyone" selected={venueType === 'Everyone'} onPress={() => setVenueType('Everyone')} />
                  <VenueTypeButton label="Female only" selected={venueType === 'Female only'} onPress={() => setVenueType('Female only')} />
                  <VenueTypeButton label="Male only" selected={venueType === 'Male only'} onPress={() => setVenueType('Male only')} />
              </View>
            </View>
          )}

          <View style={styles.footer}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>
                {activeFilter === 'all' ? 'Clear all' : 'Clear'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    height: 'auto',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioLabel: {
    fontSize: 16,
  },
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  radioButtonSelected: {
    borderColor: '#3674B5',
    borderWidth: 7,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  venueTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 5,
    gap: 5,
  },
  venueTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  venueTypeButtonSelected: {
    backgroundColor: '#3674B5',
    borderColor: '#3674B5'
  },
  venueTypeButtonText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 15,
  },
  venueTypeButtonTextSelected: {
    color: 'white',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  clearButton: {
    paddingVertical: 14,
    paddingHorizontal: 45,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  clearButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  applyButton: {
    paddingVertical: 14,
    paddingHorizontal: 45,
    borderRadius: 12,
    backgroundColor: 'black',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FilterModal;
