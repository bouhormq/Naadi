import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ensure this import works in your setup
import CustomText from '@/components/CustomText';

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

export type Country = typeof countriesData[0]; // Export Country type

// Export PhoneInfo type for parent components
export interface PhoneInfo {
  code: string;
  name: string;
  number: string;
  dialCode: string;
}

interface PhoneInputProps {
  value: PhoneInfo | null | undefined; // Expects the PhoneInfo object or null/undefined
  onChangeInfo: (info: PhoneInfo | null) => void; // Reports changes to parent with PhoneInfo object
  placeholder?: string;
  containerStyle?: any;
  textInputStyle?: any;
  isValid?: boolean; // Receives validation state from parent for styling
  defaultCountryCode?: string; // Use code instead of name for default
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeInfo,
  placeholder = "Phone number",
  containerStyle,
  textInputStyle,
  isValid, // Use this prop from parent to style the border
  defaultCountryCode = "MA", // Default to Morocco code
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Internal state now holds the selected Country object and the raw number string
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countriesData.find(country => country.code === defaultCountryCode) || countriesData[0]
  );
  const [phoneNumber, setPhoneNumber] = useState<string>(''); // Just the number part

  const dropdownHeight = useRef(new Animated.Value(0)).current;
  const dropdownRef = useRef<View>(null);

  // Revised Effect to synchronize internal state with `value` prop
  useEffect(() => {
    if (value) { // Check if value prop is provided
      const countryMatch = countriesData.find(c => c.dialCode === value.dialCode);
      
      // Update country if it has changed or doesn't match the value prop
      if (countryMatch && countryMatch.code !== selectedCountry.code) {
         setSelectedCountry(countryMatch);
      }

      // Update internal phone number based on value.number
      if (value.number !== phoneNumber) { 
          setPhoneNumber(value.number || ''); // Set to value.number or empty string if null/undefined/empty
      }

    } else {
        // If value prop is null or undefined, reset to default
        const defaultCountry = countriesData.find(c => c.code === defaultCountryCode) || countriesData[0];
        // Check if reset is actually needed to prevent potential loops
        if (selectedCountry.code !== defaultCountry.code || phoneNumber !== '') {
        setSelectedCountry(defaultCountry);
        setPhoneNumber('');
    }
    }
    // Dependency array: Rerun effect if `value` prop changes. `defaultCountryCode` is also needed.
    // Avoid including internal state `selectedCountry` or `phoneNumber` if possible to prevent loops,
    // unless complex logic absolutely requires comparing previous internal state.
  }, [value, defaultCountryCode]);

  // Function to report changes (PhoneInfo object) to the parent
  const reportChange = (number: string, country: Country) => {
      const cleanedNumber = number.replace(/\D/g, '');
      if (cleanedNumber) {
           onChangeInfo({
               code: country.code,
               name: country.name,
               number: cleanedNumber,
               dialCode: country.dialCode,
           });
      } else {
          // When the number is cleared internally, report null to the parent
          // BUT include the currently selected country context potentially?
          // Let's stick to reporting null as per previous logic, parent handles it.
           onChangeInfo(null); 
      }
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
    setSelectedCountry(country); // Update internal state
    toggleDropdown();
    // Report the change using the *current* internal phoneNumber and the *newly selected* country
    reportChange(phoneNumber, country);
  };

  // Handle phone number input
  const handlePhoneNumberChange = (text: string) => {
    const cleanedText = text.replace(/\D/g, '');
    setPhoneNumber(cleanedText); // Update internal state FIRST
    // Report the change to the parent using the new text and current country
    reportChange(cleanedText, selectedCountry);
  };


  // Close dropdown when clicking outside (web only)
  useEffect(() => {
    if (Platform.OS === 'web') {
       const handleClickOutside = (event: MouseEvent) => {
           const currentRef = dropdownRef.current as unknown as HTMLElement;
           if (currentRef && !currentRef.contains(event.target as Node) && isDropdownOpen) {
              toggleDropdown();
           }
       };
       document.addEventListener('mousedown', handleClickOutside);
       return () => document.removeEventListener('mousedown', handleClickOutside);
    }
 }, [isDropdownOpen]);

  return (
    <View style={[styles.container, containerStyle, { zIndex: isDropdownOpen ? 99 : 1 }]}>
      <View style={[
        styles.inputContainer,
        // Apply error styling based on the isValid prop passed from the parent
        isValid === false && styles.inputContainerError,
      ]}>
        {/* Country Selector Button */}
        <TouchableOpacity style={styles.countryButton} onPress={toggleDropdown} activeOpacity={0.7}>
          <CustomText style={styles.flagText}>{selectedCountry.flag}</CustomText>
          <CustomText style={styles.dialCodeText}>{selectedCountry.dialCode}</CustomText>
          <Ionicons name={isDropdownOpen ? "chevron-up" : "chevron-down"} size={16} color="#6b7280" />
        </TouchableOpacity>

        {/* Phone Number Input */}
        <TextInput
          style={[styles.phoneInput, textInputStyle]}
          // Value is bound to the internal phoneNumber state (just the number part)
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange} // Triggers internal state update and reporting
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
              {filteredCountries.map((country) => (
                <TouchableOpacity
                  key={country.code}
                  style={[styles.countryItem, selectedCountry.code === country.code && styles.selectedCountryItem]}
                  onPress={() => selectCountry(country)}
                >
                  <CustomText style={styles.countryFlag}>{country.flag}</CustomText>
                  <CustomText style={styles.countryName} numberOfLines={1}>{country.name}</CustomText>
                  <CustomText style={styles.countryDialCode}>{country.dialCode}</CustomText>
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
    minHeight: 48, // Increased min height slightly
    borderWidth: 1, // Add default border
    borderColor: '#d1d5db', // Default border color
  },
  inputContainerError: {
    borderColor: '#ef4444', // Red border for error
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
    fontSize: 20, // Slightly larger flag
    marginRight: 4,
  },
  dialCodeText: {
    fontSize: 16, // Slightly larger dial code
    color: '#374151',
    marginRight: 4,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 15, // More horizontal padding
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16, // Larger font size
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
    flex: 1,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  selectedCountryItem: {
    backgroundColor: '#eef2ff',
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 10,
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