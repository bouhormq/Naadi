import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  // @ts-ignore
  CheckBox,
  useWindowDimensions, // Import the hook
  Platform
} from 'react-native';
import { BusinessSignupRequest } from '@naadi/types';
import { Picker } from '@react-native-picker/picker';


interface BusinessSignupFormProps {
  onSubmit: (data: BusinessSignupRequest) => Promise<void>;
}

// Consider using a community checkbox like @react-native-community/checkbox
// import CheckBox from '@react-native-community/checkbox';


export default function BusinessSignupForm({ onSubmit }: BusinessSignupFormProps) {
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

  // Get window dimensions to apply responsive styles
  const { width } = useWindowDimensions();
  // Define a breakpoint for what you consider a small screen
  const isSmallScreen = width < 400;

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
    // Business Type is now required as per the select example
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.businessName || !formData.location || !formData.phone || !formData.consent || !formData.businessType) {
      setError('Please fill out all required fields (*).');
      return;
    }

    try {
      setLoading(true);
      setError(null);

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
        businessType: '', location: '', phone: '', consent: false, // Reset businessType to ''
      });
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  // Define dynamic styles based on screen size
  const inputStyle = {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 5,
    // Reduce padding and font size on small screens
    padding: isSmallScreen ? 8 : 10,
    fontSize: isSmallScreen ? 12 : 14,
    color: '#333',
  };

  const formRowStyle = {
    // Change direction to column on small screens
    flexDirection: isSmallScreen ? 'column' : 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  };

  const formGroupHalfStyle = {
    // Take full width when stacked vertically
    width: isSmallScreen ? '100%' : '48%',
    // Add bottom margin when stacked
    marginBottom: isSmallScreen ? 15 : 0,
    // Add back right margin to the first item in a row on larger screens
    marginRight: isSmallScreen ? 0 : 15, // Add right margin to the first item in the row
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Learn more about how Naadi can <Text style={styles.highlight}>grow</Text> your business
        </Text>
        <Text style={styles.subtitle}>
          List your fitness studio, gym, salon or spa on Naadi for free to start earning more today.
        </Text>
      </View>

      <View style={styles.formWrapper}>
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Ready to grow your business?</Text>
            <Text style={styles.formSubtitle}>Fill out the form below to see what Naadi can do for your company.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
              {/* Apply dynamic input style */}
              <TextInput
                style={inputStyle}
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Apply dynamic form row style */}
            <View style={formRowStyle}>
              {/* Apply dynamic form group half style */}
              <View style={formGroupHalfStyle}> {/* Apply marginRight here conditionally */}
                <Text style={styles.label}>First name <Text style={styles.required}>*</Text></Text>
                 {/* Apply dynamic input style */}
                <TextInput
                  style={inputStyle}
                  value={formData.firstName}
                  onChangeText={(text) => handleChange('firstName', text)}
                  placeholder="First name"
                  placeholderTextColor="#9ca3af"
                />
              </View>
               {/* Apply dynamic form group half style - no right margin needed for the second item */}
              <View style={[formGroupHalfStyle, { marginRight: 0, marginBottom: isSmallScreen ? 15 : 0 }]}> {/* Override margin for the second item */}
                <Text style={styles.label}>Last name <Text style={styles.required}>*</Text></Text>
                 {/* Apply dynamic input style */}
                <TextInput
                  style={inputStyle}
                  value={formData.lastName}
                  onChangeText={(text) => handleChange('lastName', text)}
                  placeholder="Last name"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Partner name <Text style={styles.required}>*</Text></Text>
               {/* Apply dynamic input style */}
              <TextInput
                style={inputStyle}
                value={formData.businessName}
                onChangeText={(text) => handleChange('businessName', text)}
                placeholder="Your business name"
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* === Business Type Field (Picker/Select) === */}
            <View style={styles.formGroup}>
              {/* Changed label from Optional to Required */}
              <Text style={styles.label}>Business type <Text style={styles.required}>*</Text></Text>
              {/* Wrap Picker in a View to apply border/input styles */}
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.businessType}
                  onValueChange={(itemValue) => handleChange('businessType', itemValue as string)}
                  style={styles.picker} // Style the picker itself
                  dropdownIconColor="#9ca3af" // Optional: Style the dropdown arrow
                >
                  {/* Placeholder Item */}
                  <Picker.Item label="Please select" value="" style={styles.pickerPlaceholderItem} enabled={formData.businessType !== ""} />

                  {/* Options based on the HTML select */}
                  <Picker.Item label="Fitness (studios, gyms, etc.)" value="Studio" style={styles.pickerItem} />
                  <Picker.Item label="Wellness (salons, spas, etc.)" value="Wellness" style={styles.pickerItem} />
                  <Picker.Item label="Food & beverage (restaurants, coffee shops, etc.)" value="Food and Beverage" style={styles.pickerItem} />
                </Picker>
              </View>
            </View>
            {/* === End of Business Type Field === */}

             {/* Website Field (Optional) */}
             <View style={styles.formGroup}>
               <Text style={styles.label}>Website <Text style={styles.optional}>(Optional)</Text></Text>
               <TextInput
                 style={inputStyle}
                 value={formData.website}
                 onChangeText={(text) => handleChange('website', text)}
                 placeholder="Your website URL"
                 placeholderTextColor="#9ca3af"
                 keyboardType="url"
               />
             </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone <Text style={styles.required}>*</Text></Text>
               {/* Apply dynamic input style */}
              <TextInput
                style={inputStyle}
                value={formData.phone}
                onChangeText={(text) => handleChange('phone', text)}
                keyboardType="phone-pad"
                placeholder="Your contact phone number"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location <Text style={styles.required}>*</Text></Text>
               {/* Apply dynamic input style */}
              <TextInput
                style={inputStyle}
                value={formData.location}
                onChangeText={(text) => handleChange('location', text)}
                placeholder="City, State or Zip Code"
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Checkbox - Note: react-native CheckBox is deprecated */}
            {/* Consider replacing with @react-native-community/checkbox for better cross-platform support and features */}
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={formData.consent}
                onValueChange={(value: boolean) => handleChange('consent', value)}
                tintColors={{ true: '#0077ff', false: '#d1d5db' }}
                style={{ marginRight: 10 }}
              />
              <View style={styles.checkboxTextContainer}>
                <Text style={styles.checkboxText}>
                  I agree to receive marketing and other communications from Naadi.{' '}
                  <Text style={styles.required}>*</Text>
                </Text>
                <Text style={styles.checkboxSubtext}>
                  You can unsubscribe from these communications at any time. For more information, please review our{' '}
                  <Text style={styles.link}>Terms of Use</Text> and{' '}
                  <Text style={styles.link}>Privacy Policy</Text>.
                </Text>
              </View>
            </View>

            {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Get started</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f7ff',
    paddingVertical: 40,
    // paddingHorizontal: 20, // Keep or remove based on your overall layout structure
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  highlight: {
    color: '#0077ff',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formWrapper: {
    maxWidth: 500,
    alignSelf: 'center',
    marginHorizontal: 20, // Margin to keep space from edges
    width: '100%', // Take full width up to maxWidth
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20, // Internal padding within the form box
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formHeader: {
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    flexGrow: 1,
  },
  formGroup: {
    marginBottom: 15,
  },
  // formRow and formGroupHalf styles are now dynamic and defined within the component
  // formRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, },
  // formGroupHalf: { width: '48%', },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  required: {
    color: '#ff4d4f',
  },
  // input style is now dynamic and defined within the component
  // input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 5, padding: 10, fontSize: 14, color: '#333', },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  checkboxTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  checkboxText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  checkboxSubtext: {
    fontSize: 12,
    color: '#666',
  },
  link: {
    color: '#0077ff',
  },
  submitButton: {
    backgroundColor: '#0077ff',
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optional: {
    color: '#6b7280',
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '400',
  },
  // --- Styles for Picker ---
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#fff',
    minHeight: 40, // Match input height
    justifyContent: 'center', // Center picker text vertically
  },
  picker: {
    height: Platform.OS === 'ios' ? undefined : 40, // iOS needs dynamic height, Android needs fixed
    width: '100%',
    color: '#1f2937', // Text color inside picker
    // Remove default browser/native styling if possible (might need platform specifics)
    backgroundColor: 'transparent', // Ensure wrapper bg shows
    borderWidth: 0, // Hide Picker's own border
    paddingHorizontal: 10, // Internal padding like input
    paddingVertical: 0, // Reset padding
    marginVertical: Platform.OS === 'ios' ? 10 : 0, // Adjust vertical alignment on iOS
  },
  pickerPlaceholderItem: {
      color: '#9ca3af', // Style for the placeholder text
      fontSize: 14, // Match input text size
  },
  pickerItem: {
      color: '#1f2937', // Style for the regular option text
      fontSize: 14, // Match input text size
      // Add backgroundColor for web dropdown items if needed
      // backgroundColor: Platform.OS === 'web' ? '#fff' : undefined,
  },
});