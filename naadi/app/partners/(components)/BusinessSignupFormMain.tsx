import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  // @ts-ignore - Using built-in CheckBox for simplicity, consider community for consistency
  CheckBox,
  useWindowDimensions, // Import hook for responsiveness
  Platform, // Import Platform for potential style adjustments
  ImageBackground, // Import ImageBackground
  Animated, // Import Animated for fade transitions
} from 'react-native';
import { BusinessSignupRequest } from '@naadi/types';

// Import the Picker component
import { Picker } from '@react-native-picker/picker';

interface BusinessSignupFormProps {
  onSubmit: (data: BusinessSignupRequest) => Promise<void>;
}

// Define image source - ADJUST THE PATH AS NEEDED
const columnBackgroundImage = require('../(assets)/hero-background.webp'); // Renamed for clarity

export default function BusinessSignupFormMain({ onSubmit }: BusinessSignupFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    businessName: '',
    website: '',
    businessType: '', // Initial value empty string for the placeholder
    location: '',
    phone: '',
    consent: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rotating business words
  const businessWords = ['gym', 'studio', 'spa', 'hammam', 'restaurant'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity 1

  // Set up the word rotation effect
  useEffect(() => {
    const wordChangeInterval = setInterval(() => {
      // Start fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500, // Fade out over 0.5 seconds
        useNativeDriver: true,
      }).start(() => {
        // Change word when fully faded out
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % businessWords.length);
        
        // Start fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500, // Fade in over 0.5 seconds
          useNativeDriver: true,
        }).start();
      });
    }, 3250); // Total 2.5 seconds per word

    // Clean up interval on unmount
    return () => clearInterval(wordChangeInterval);
  }, [fadeAnim, businessWords.length]);

  const { width } = useWindowDimensions();
  const isWideScreen = width > 800;

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async () => {
    // Validation remains the same
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.businessName || !formData.location || !formData.phone || !formData.consent || !formData.businessType) {
      setError('Please fill out all required fields (*).');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Submission logic remains the same
      const submitData: BusinessSignupRequest = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        businessName: formData.businessName,
        website: formData.website,
        businessType: formData.businessType,
        location: formData.location,
        phone: formData.phone,
        consent: formData.consent,
      };
      await onSubmit(submitData);
      console.log('Signup successful');
      setFormData({
        email: '', firstName: '', lastName: '', businessName: '', website: '',
        businessType: '', location: '', phone: '', consent: false,
      });
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  // --- Dynamic Styles ---
   const pageContainerStyle = [
     styles.pageContainerBase,
     {
       flexDirection: isWideScreen ? 'row' : 'column',
       // Remove alignItems/justifyContent from page level if columns handle their own
       // Let child columns/sections handle alignment
     },
   ];

   const headerSectionStyle = [
     styles.headerSectionBase,
     {
       width: isWideScreen ? '50%' : '100%',
       // Centering content within the header section
       justifyContent: 'center',
       alignItems: isWideScreen ? 'flex-start' : 'center', // Align text left (wide) or center (narrow)
       paddingHorizontal: isWideScreen ? '5%' : 20, // Use percentage padding? Or fixed.
       paddingVertical: 40, // Add vertical padding
       marginBottom: isWideScreen ? 0 : 30, // Space below header on narrow screens
     },
   ];

   // Style for the Right Column / Form Section wrapper (ImageBackground)
   const formSectionStyle = [
     styles.formSectionBase, // Base styles for this section
     {
       width: isWideScreen ? '50%' : '100%',
       // On wide screens, center the formContainer inside this ImageBackground column
       justifyContent: isWideScreen ? 'center' : 'flex-start', // Center vertically (wide) or start from top (narrow)
       alignItems: 'center', // Center horizontally always
       padding: isWideScreen ? 40 : 20, // Padding around the form card within the image column/section
     },
   ];
   
   // Create a dynamic style for the form header
   const formHeaderStyle = [
     styles.formHeaderBase,
     {
       alignItems: isWideScreen ? 'flex-start' : 'center',
     },
   ];

  // --- Component Return ---
  return (
    <View style={pageContainerStyle}>
      {/* Left Column / Header Section */}
      <View style={headerSectionStyle}>
         <Text style={[styles.mainTitle, {textAlign: isWideScreen ? 'left' : 'center',}]}>
          Increase the revenue of your{' '}
          <Animated.View style={{ opacity: fadeAnim, display: 'inline' }}>
            <Text style={styles.freeText}>{businessWords[currentWordIndex]}</Text>
          </Animated.View>
          {' '}for <Text style={styles.freeText}>free</Text> with <Text style={styles.brandText}>Naadi</Text>
        </Text>
        <Text style={[styles.mainSubtitle, {textAlign: isWideScreen ? 'left' : 'center'}]}>
          List your business on Naadi to reach thousands of new customers, fill unbooked spots, and maximize your revenue.
        </Text>
      </View>

      {/* Right Column / Form Section (ImageBackground) */}
      <ImageBackground
        source={columnBackgroundImage}
        resizeMode="cover" // Cover the entire column/section
        style={formSectionStyle} // Apply dynamic styles
        imageStyle={styles.formSectionBackgroundImage} // Optional: style image itself (opacity, etc)
      >
        {/* Form Card - Placed inside the ImageBackground */}
        <View style={styles.formContainer}>
          {/* Form Header with updated styling */}
          <View style={formHeaderStyle}>
            <Text style={[styles.formTitle, {textAlign: isWideScreen ? 'left' : 'center'}]}>Ready to grow your business?</Text>
            <Text style={[styles.formSubtitle, {textAlign: isWideScreen ? 'left' : 'center'}]}>
              Fill out the form below to see what Naadi can do for your company.
            </Text>
          </View>

          <View style={styles.form}>
            {/* Email Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* First Name and Last Name Row */}
            <View style={styles.formRow}>
              <View style={styles.formGroupHalf}>
                <Text style={styles.label}>First name <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  value={formData.firstName}
                  onChangeText={(text) => handleChange('firstName', text)}
                  placeholder="First name"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={styles.formGroupHalf}>
                <Text style={styles.label}>Last name <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  value={formData.lastName}
                  onChangeText={(text) => handleChange('lastName', text)}
                  placeholder="Last name"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Business Name Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Business name <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={formData.businessName}
                onChangeText={(text) => handleChange('businessName', text)}
                placeholder="Your business name"
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Business Type Field (Picker/Select) */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Business type <Text style={styles.required}>*</Text></Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.businessType}
                  onValueChange={(itemValue) => handleChange('businessType', itemValue as string)}
                  style={styles.picker}
                  dropdownIconColor="#9ca3af"
                >
                  <Picker.Item label="Please select" value="" style={styles.pickerPlaceholderItem} enabled={formData.businessType !== ""} />
                  <Picker.Item label="Fitness (studios, gyms, etc.)" value="Studio" style={styles.pickerItem} />
                  <Picker.Item label="Wellness (salons, spas, etc.)" value="Wellness" style={styles.pickerItem} />
                  <Picker.Item label="Food & beverage (restaurants, coffee shops, etc.)" value="Food and Beverage" style={styles.pickerItem} />
                </Picker>
              </View>
            </View>

             {/* Website Field (Optional) */}
             <View style={styles.formGroup}>
               <Text style={styles.label}>Website <Text style={styles.optional}>(Optional)</Text></Text>
               <TextInput
                 style={styles.input}
                 value={formData.website}
                 onChangeText={(text) => handleChange('website', text)}
                 placeholder="Your website URL"
                 placeholderTextColor="#9ca3af"
                 keyboardType="url"
               />
             </View>

            {/* Location Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Location <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={(text) => handleChange('location', text)}
                placeholder="City, State or Zip Code"
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Phone Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => handleChange('phone', text)}
                keyboardType="phone-pad"
                placeholder="Your contact phone number"
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Checkbox Section */}
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={formData.consent}
                onValueChange={(value: boolean) => handleChange('consent', value)}
                tintColors={{ true: '#007bff', false: '#adb5bd' }}
                style={styles.checkbox}
              />
              <View style={styles.checkboxTextContainer}>
                <Text style={styles.checkboxText}>
                  I agree to receive marketing and other communications from Naadi PR Group, and/or its affiliates.{' '}
                  <Text style={styles.required}>*</Text>
                </Text>
                <Text style={styles.checkboxSubtext}>
                  You can unsubscribe from these communications at any time. For more information, please review our{' '}
                  <Text style={styles.link}>Terms of Use</Text> and{' '}
                  <Text style={styles.link}>Privacy Policy</Text>.
                </Text>
              </View>
            </View>

            {/* Error Message */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Get started</Text>
              )}
            </TouchableOpacity>
          </View> {/* End form */}
        </View> {/* End formContainer */}
      </ImageBackground> {/* End Right Column / Form Section */}
    </View> /* End pageContainer */
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  pageContainerBase: {
    backgroundColor: '#eef2f7', // Fallback background
    flex: 1, // Make sure container tries to fill space
    minHeight: Platform.OS === 'web' ? '100vh' : undefined,
  },
  // Base styles for the Header Section (Left Column on Wide)
  headerSectionBase: {
    // Removed alignment/justification - handled dynamically
  },
  mainTitle: {
    fontSize: Platform.OS === 'web' ? '7.5vh' : 48, // Responsive font size
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    lineHeight: Platform.OS === 'web' ? '7.5vh' : 54, // Responsive line height
    maxWidth: 650, // Prevent text getting too wide
  },
  freeText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  brandText: {
    fontWeight: 'bold',
    // Consider adding specific brand color if available
  },
  mainSubtitle: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    maxWidth: 650, // Prevent text getting too wide
  },
  // Base styles for the Form Section (Right Column on Wide)
  formSectionBase: {
    // This is applied to the ImageBackground
    // Ensures the image covers the area, content is aligned
    overflow: 'hidden', // Hide overflow if image is larger than container
  },
  // Base styles for formHeader - dynamic properties applied separately
  formHeaderBase: {
    marginBottom: 25,
    // alignItems is now handled dynamically
  },
  /* Optional: Style for the image itself inside ImageBackground */
  // formSectionBackgroundImage: {
  //   opacity: 0.9, // Example: Make image slightly transparent
  // },

  // Styles for the Form Card (sits inside ImageBackground)
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, // Slightly less intense shadow
    shadowRadius: 15,
    elevation: 10,
    width: '100%', // Takes width allowed by parent padding
    maxWidth: 500, // Max width for the form card itself
    // marginBottom: 20, // Add margin if needed on narrow screens at the bottom
  },
  formSectionBackgroundImage:{
    width: '100%'
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    // textAlign applied dynamically
  },
  formSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    // textAlign applied dynamically
    lineHeight: 20,
  },
  form: {},
  formGroup: {
    marginBottom: 18,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  formGroupHalf: {
    width: '48%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  required: {
    color: '#ef4444',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  optional: {
    color: '#6b7280',
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '400',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1f2937',
    backgroundColor: '#fff',
    minHeight: 40,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#fff',
    minHeight: 40,
    justifyContent: 'center',
  },
  picker: {
    height: Platform.OS === 'ios' ? undefined : 40,
    width: '100%',
    color: '#1f2937',
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 0,
    marginVertical: Platform.OS === 'ios' ? 10 : 0,
  },
  pickerPlaceholderItem: {
      color: '#9ca3af',
      fontSize: 14,
  },
  pickerItem: {
      color: '#1f2937',
      fontSize: 14,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 25,
    marginTop: 10,
  },
  checkbox: {
    marginRight: 10,
    marginTop: 2,
    height: 18,
    width: 18,
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 5,
  },
  checkboxSubtext: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#fff',
    backgroundColor: '#ef4444',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    overflow: 'hidden',
  },
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#adb5bd',
    opacity: 0.7,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});