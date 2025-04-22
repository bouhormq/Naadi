import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ensure this import works in your setup

export const countriesData = [
    { "code": "MA", "name": "Morocco", "flag": "🇲🇦", "dialCode": "+212" },
    { "code": "FR", "name": "France", "flag": "🇫🇷", "dialCode": "+33" },
    { "code": "ES", "name": "Spain", "flag": "🇪🇸", "dialCode": "+34" },
    { "code": "IT", "name": "Italy", "flag": "🇮🇹", "dialCode": "+39" },
    { "code": "BE", "name": "Belgium", "flag": "🇧🇪", "dialCode": "+32" },
    { "code": "NL", "name": "Netherlands", "flag": "🇳🇱", "dialCode": "+31" },
    { "code": "US", "name": "United States", "flag": "🇺🇸", "dialCode": "+1" },
    { "code": "GB", "name": "United Kingdom", "flag": "🇬🇧", "dialCode": "+44" },
    { "code": "DE", "name": "Germany", "flag": "🇩🇪", "dialCode": "+49" },
    { "code": "CA", "name": "Canada", "flag": "🇨🇦", "dialCode": "+1" },
    { "code": "AE", "name": "United Arab Emirates", "flag": "🇦🇪", "dialCode": "+971" },
    { "code": "SA", "name": "Saudi Arabia", "flag": "🇸🇦", "dialCode": "+966" },
    { "code": "DZ", "name": "Algeria", "flag": "🇩🇿", "dialCode": "+213" },
    { "code": "TN", "name": "Tunisia", "flag": "🇹🇳", "dialCode": "+216" },
    { "code": "MX", "name": "Mexico", "flag": "🇲🇽", "dialCode": "+52" },
    { "code": "BR", "name": "Brazil", "flag": "🇧🇷", "dialCode": "+55" },
    { "code": "IN", "name": "India", "flag": "🇮🇳", "dialCode": "+91" },
    { "code": "CN", "name": "China", "flag": "🇨🇳", "dialCode": "+86" },
    { "code": "JP", "name": "Japan", "flag": "🇯🇵", "dialCode": "+81" },
    { "code": "AU", "name": "Australia", "flag": "🇦🇺", "dialCode": "+61" },
    { "code": "ZA", "name": "South Africa", "flag": "🇿🇦", "dialCode": "+27" }
];

type Country = typeof countriesData[0];

interface PhoneInputProps {
  value: string; // Expects formatted value like +212... from parent
  onChangeText: (text: string) => void; // Still needed for TextInput internal handling
  onChangeFormattedText: (formattedText: string, country: Country, rawNumber: string) => void; // Reports changes to parent
  placeholder?: string;
  containerStyle?: any;
  textInputStyle?: any;
  isValid?: boolean; // Receives validation state from parent for styling
  defaultCountry?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeText, // Needed for TextInput binding
  onChangeFormattedText,
  placeholder = "Phone number",
  containerStyle,
  textInputStyle,
  isValid, // Use this prop from parent to style the border
  defaultCountry = "MA",
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countriesData.find(country => country.code === defaultCountry) || countriesData[0]
  );
  // Internal state for the raw phone number part ONLY
  const [phoneNumber, setPhoneNumber] = useState('');

  const dropdownHeight = useRef(new Animated.Value(0)).current;
  const dropdownRef = useRef<View>(null);

  // *** CORRECTED useEffect ***
  // This effect synchronizes the internal state (selectedCountry, phoneNumber)
  // ONLY when the `value` prop changes externally (e.g., form reset, initial load).
  // It avoids interfering with updates triggered by user typing directly into this component.
  useEffect(() => {
    // console.log('PhoneInput useEffect - value prop changed:', value);

    const parseValue = (formattedValue: string): { country: Country; rawNumber: string } => {
        let bestMatchCountry = countriesData.find(c => c.code === defaultCountry) || countriesData[0];
        let rawNumberPart = '';
        let longestMatchDialCode = '';

        if (formattedValue) {
            // Find best matching country based on dial code prefix
            for (const country of countriesData) {
                if (formattedValue.startsWith(country.dialCode) && country.dialCode.length > longestMatchDialCode.length) {
                    longestMatchDialCode = country.dialCode;
                    bestMatchCountry = country;
                }
            }
            // Extract raw number part
            if (longestMatchDialCode) {
                 rawNumberPart = formattedValue.substring(longestMatchDialCode.length).replace(/\D/g, '');
            } else {
                 // If no dial code matched, assume the whole numeric part is the number
                 // (This might happen if parent sends just numbers initially)
                 rawNumberPart = formattedValue.replace(/\D/g, '');
            }
        }
        return { country: bestMatchCountry, rawNumber: rawNumberPart };
    };

    const { country: parsedCountry, rawNumber: parsedRawNumber } = parseValue(value);

    // Update internal state ONLY if the parsed value from the prop
    // is different from the current internal state. This is crucial
    // to prevent the effect from overwriting the state being updated
    // directly by the user's input via handlePhoneNumberChange.
    if (parsedCountry.code !== selectedCountry.code || parsedRawNumber !== phoneNumber) {
        // console.log(`PhoneInput useEffect: Prop value ('${value}') differs from internal state ('${selectedCountry.dialCode}${phoneNumber}'). Updating internal state.`);
        setSelectedCountry(parsedCountry);
        setPhoneNumber(parsedRawNumber);
        // DO NOT call onChangeFormattedText here - causes loops/conflicts.
        // Reporting is handled by user interaction handlers (handlePhoneNumberChange, selectCountry).
    }
    // else {
    //     console.log(`PhoneInput useEffect: Prop value ('${value}') matches internal state ('${selectedCountry.dialCode}${phoneNumber}'). No update needed.`);
    // }

  // This effect should primarily react to the 'value' prop changing externally,
  // and potentially the defaultCountry changing.
  // Avoid depending on internal state (`phoneNumber`, `selectedCountry`) that the effect itself modifies.
  }, [value, defaultCountry]);


  // Function to report changes (data only) to the parent
  const reportChange = (number: string, country: Country) => {
      const cleanedNumber = number.replace(/\D/g, '');
      const formattedText = country.dialCode + cleanedNumber;
      // console.log('PhoneInput reportChange: Reporting to parent:', formattedText, country.code, cleanedNumber);
      onChangeFormattedText(formattedText, country, cleanedNumber);
  };

  // Filter countries based on search query
  const filteredCountries = searchQuery
    ? countriesData.filter(
        country =>
          country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          country.dialCode.includes(searchQuery) ||
          country.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : countriesData;

  // Handle dropdown toggle with animation
  const toggleDropdown = () => {
    if (isDropdownOpen) {
      Animated.timing(dropdownHeight, { toValue: 0, duration: 200, useNativeDriver: false }).start(() => {
        setIsDropdownOpen(false);
        setSearchQuery('');
      });
    } else {
      setIsDropdownOpen(true);
      Animated.timing(dropdownHeight, { toValue: 250, duration: 200, useNativeDriver: false }).start();
    }
  };

  // Handle country selection
  const selectCountry = (country: Country) => {
    // console.log('PhoneInput selectCountry:', country.code);
    setSelectedCountry(country); // Update internal state
    toggleDropdown();
    // Report the change using the *current* internal phoneNumber and the *newly selected* country
    reportChange(phoneNumber, country);
  };

  // Handle phone number input
  const handlePhoneNumberChange = (text: string) => {
    const cleanedText = text.replace(/\D/g, '');
    // console.log('PhoneInput handlePhoneNumberChange - Cleaned text:', cleanedText);
    // **1. Update internal state FIRST**
    setPhoneNumber(cleanedText);
    // Call the original onChangeText prop (which might be used by TextInput internally)
    onChangeText(cleanedText);
    // **2. Report the change to the parent** using the new text and current country
    reportChange(cleanedText, selectedCountry);
  };


  // Close dropdown when clicking outside (web only)
  useEffect(() => {
     if (Platform.OS === 'web') {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && isDropdownOpen) {
               toggleDropdown();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
     }
  }, [isDropdownOpen]); // Dependency only on isDropdownOpen

  // console.log(`PhoneInput Rendering - Internal number: '${phoneNumber}', Country: ${selectedCountry.code}, Received isValid prop: ${isValid}`);

  return (
    <View style={[styles.container, containerStyle, { zIndex: isDropdownOpen ? 99 : 1 }]}>
      <View style={[
        styles.inputContainer,
        isValid === false && styles.inputContainerError, // Style based on parent validation
      ]}>
        {/* Country Selector Button */}
        <TouchableOpacity style={styles.countryButton} onPress={toggleDropdown} activeOpacity={0.7}>
          <Text style={styles.flagText}>{selectedCountry.flag}</Text>
          <Text style={styles.dialCodeText}>{selectedCountry.dialCode}</Text>
          <Ionicons name={isDropdownOpen ? "chevron-up" : "chevron-down"} size={16} color="#6b7280" />
        </TouchableOpacity>

        {/* Phone Number Input */}
        <TextInput
          style={[styles.phoneInput, textInputStyle]}
          // ** Crucial: Value must be bound to the internal phoneNumber state **
          value={phoneNumber}
          // ** Crucial: onChangeText triggers the internal handler **
          onChangeText={handlePhoneNumberChange}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          keyboardType="phone-pad"
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      {/* Dropdown */}
      {isDropdownOpen && (
        <Animated.View style={[styles.dropdown, { height: dropdownHeight }]} ref={dropdownRef}>
          {/* Search Input */}
          <View style={styles.searchContainer}>
             {/* ... search input ... */}
              <Ionicons name="search" size={16} color="#6b7280" style={styles.searchIcon} />
              <TextInput
                 style={styles.searchInput}
                 placeholder="Search..."
                 placeholderTextColor="#9ca3af"
                 value={searchQuery}
                 onChangeText={setSearchQuery}
                 autoCapitalize="none"
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchButton}>
                  <Ionicons name="close-circle" size={16} color="#6b7280" />
                </TouchableOpacity>
              ) : null}
          </View>
          {/* Countries List */}
          <ScrollView style={styles.countryList} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
             {/* ... country list mapping ... */}
              {filteredCountries.map((country) => (
                <TouchableOpacity
                  key={country.code}
                  style={[styles.countryItem, selectedCountry.code === country.code && styles.selectedCountryItem]}
                  onPress={() => selectCountry(country)}
                >
                  <Text style={styles.countryFlag}>{country.flag}</Text>
                  <Text style={styles.countryName} numberOfLines={1}>{country.name}</Text>
                  <Text style={styles.countryDialCode}>{country.dialCode}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    zIndex: 2,
     minHeight: 40,
  },
  inputContainerError: {
    borderColor: '#ef4444',
  },
  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    borderRightWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
    height: '100%',
  },
  flagText: {
    fontSize: 16, // Adjusted for visibility
    marginRight: 4,
  },
  dialCodeText: {
    fontSize: 14,
    color: '#374151',
    marginRight: 4,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 14,
    color: '#1f2937',
    backgroundColor: 'transparent',
    ...Platform.select({
      web: {
        outlineWidth: 0,
      },
    }),
  },
  dropdown: {
    position: 'absolute',
    top: '100%', // Position directly below the input container
    marginTop: 2, // Optional small gap
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 99,
    overflow: 'hidden',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 32,
    fontSize: 14,
    color: '#1f2937',
    paddingVertical: 0,
    paddingHorizontal: 0,
    ...Platform.select({
      web: {
        outlineWidth: 0,
      },
    }),
  },
  clearSearchButton: {
      paddingLeft: 8,
  },
  countryList: {
    flex: 1, // Ensure it takes available space within Animated.View
    // Max height is controlled by Animated.View's height animation
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10, // Slightly more padding
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6', // Lighter border
  },
  selectedCountryItem: {
    backgroundColor: '#eef2ff', // Slightly different selection color
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 10, // More space
  },
  countryName: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
    marginRight: 8,
  },
  countryDialCode: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default PhoneInput;