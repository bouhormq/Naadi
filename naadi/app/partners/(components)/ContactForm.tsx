import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  // @ts-ignore
  CheckBox, // Consider using a community checkbox like @react-native-community/checkbox
  useWindowDimensions,
  Platform
} from 'react-native';
// Assuming you might have a combined type or adjust this as needed
//import BusinessContactFormData, { BusinessContactRequest } from '@naadi/types';
import { BusinessContactFormData } from '@naadi/types';
import { Picker } from '@react-native-picker/picker';


interface BusinessContactFormProps {
  // Update the onSubmit prop to accept the new combined data structure
  onSubmit: (data: BusinessContactFormData) => Promise<void>;
}

// Consider using a community checkbox like @react-native-community/checkbox
// import CheckBox from '@react-native-community/checkbox';


export default function BusinessContactForm({ onSubmit }: BusinessContactFormProps) {
  // Initialize state with all original fields plus the message field
  const [formData, setFormData] = useState<BusinessContactFormData>({
    email: '',
    firstName: '',
    lastName: '',
    businessName: '',
    website: '',
    businessType: '',
    location: '',
    phone: '',
    message: '', // Initialize message
    consent: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get window dimensions for responsive styles
  const { width } = useWindowDimensions();
  const isWideScreen = width > 800;
  // Define a breakpoint for small screens
  const isSmallScreen = width < 400;

  // Updated handleChange to handle any key of the combined formData type
  const handleChange = (field: keyof BusinessContactFormData, value: string | boolean) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = async () => {
    // Update validation logic to include the new message field and keep existing required fields
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.businessName || !formData.location || !formData.phone || !formData.message) {
      setError('Email, first name, last name, partner name, location, phone, and message are required');
      return;
    }
    // You might want to add validation for the consent checkbox being checked too, depending on requirements
    // if (!formData.consent) {
    //   setError('You must agree to receive communications.');
    //   return;
    // }


    try {
      setLoading(true);
      setError(null);

      // Pass all fields, including the new message field, to onSubmit
      await onSubmit({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        businessName: formData.businessName,
        website: formData.website, // Kept website
        businessType: formData.businessType, // Kept businessType
        location: formData.location,
        phone: formData.phone,
        message: formData.message, // Include the message
        consent: formData.consent
      });

      // Optional: Clear the form after successful submission
      setFormData({
         email: '',
         firstName: '',
         lastName: '',
         businessName: '',
         website: '',
         businessType: '',
         location: '',
         phone: '',
         message: '',
         consent: false,
       });

    } catch (err) {
      console.error('Partner contact form submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  // Define dynamic styles based on screen size
  const inputStyle = {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 5,
    padding: isSmallScreen ? 8 : 10,
    fontSize: isSmallScreen ? 12 : 14,
    color: '#333',
  };

  const formWrapperStyle = [
    styles.formWrapperBase,
    {
      width: isWideScreen ? '50%' : '100%',
      alignSelf: isWideScreen ? 'center' : 'center',
    },
  ];


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Updated header text for a partner contact form */}
        <Text style={styles.title}>
          Contact Us for Business <Text style={styles.highlight}>Inquiries</Text>
        </Text>
        <Text style={styles.subtitle}>
          Have questions about listing your business or partnering with Naadi? Fill out the form below.
        </Text>
      </View>


        <View style={formWrapperStyle}>
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Get in touch with our partner team</Text>
            <Text style={styles.formSubtitle}>
              We look forward to hearing from you.
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

            {/* Added Message Input */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Message <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[inputStyle, styles.messageInput]} // Apply additional style for message
                value={formData.message}
                onChangeText={(text) => handleChange('message', text)}
                multiline
                numberOfLines={4} // Suggest number of lines for multiline input
                placeholder='Enter your message'
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
    marginHorizontal: 20,
    width: '100%',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
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
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  required: {
    color: '#ff4d4f',
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
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
  // Base container for the whole component/page area
  pageContainerBase: {
    backgroundColor: '#eef2f7',
    padding: 20,
    flex: 1,
    minHeight: '100vh', // Ensure it takes at least viewport height on web
  },
  // Base styles for the Header Section (Left)
  headerSectionBase: {
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    lineHeight: 60, // Adjust line height to match font size
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
    maxWidth: 650,
  },
  // Base styles for the Form Wrapper (Right)
  formWrapperBase: {
    maxWidth: 500,
  },
  // Styles for the Form Card and its contents
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  formGroupHalf: {
    width: '48%',
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
    paddingVertical: 10, // Adjusted for consistency
    fontSize: 14,
    color: '#1f2937',
    backgroundColor: '#fff',
    minHeight: 40, // Ensure minimum height like Picker
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
  // --- End of Picker Styles ---
  checkbox: {
    marginRight: 10,
    marginTop: 2, // Align checkbox better with the first line of text
    // Sizing might need platform-specific adjustments
    height: 18,
    width: 18,
  },
  errorText: {
    color: '#ef4444',
    marginBottom: 15,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  submitButtonDisabled: {
    backgroundColor: '#adb5bd', // Changed disabled color slightly
    opacity: 0.7,
  },
});