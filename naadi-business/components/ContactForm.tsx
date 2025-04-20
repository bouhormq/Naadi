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
} from 'react-native';
// Assuming you might have a combined type or adjust this as needed
//import BusinessContactFormData, { BusinessContactRequest } from '@naadi/types';
import { BusinessContactFormData } from '@naadi/types';

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
      setError('Email, first name, last name, business name, location, phone, and message are required');
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
      // setFormData({
      //   email: '',
      //   firstName: '',
      //   lastName: '',
      //   businessName: '',
      //   website: '',
      //   businessType: '',
      //   location: '',
      //   phone: '',
      //   message: '',
      //   consent: false,
      // });

    } catch (err) {
      console.error('Business contact form submission error:', err);
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

  const formRowStyle = {
    flexDirection: isSmallScreen ? 'column' : 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  };

  const formGroupHalfStyle = {
    width: isSmallScreen ? '100%' : '48%',
    marginBottom: isSmallScreen ? 15 : 0,
    marginRight: isSmallScreen ? 0 : 15,
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Updated header text for a business contact form */}
        <Text style={styles.title}>
          Contact Us for Business <Text style={styles.highlight}>Inquiries</Text>
        </Text>
        <Text style={styles.subtitle}>
          Have questions about listing your business or partnering with Naadi? Fill out the form below.
        </Text>
      </View>

      <View style={styles.formWrapper}>
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            {/* Updated form header text */}
            <Text style={styles.formTitle}>Get in touch with our business team</Text>
            <Text style={styles.formSubtitle}>We look forward to hearing from you.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={inputStyle}
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={formRowStyle}>
              <View style={formGroupHalfStyle}>
                <Text style={styles.label}>First name <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={inputStyle}
                  value={formData.firstName}
                  onChangeText={(text) => handleChange('firstName', text)}
                />
              </View>
              <View style={[formGroupHalfStyle, { marginRight: 0, marginBottom: isSmallScreen ? 15 : 0 }]}>
                <Text style={styles.label}>Last name <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={inputStyle}
                  value={formData.lastName}
                  onChangeText={(text) => handleChange('lastName', text)}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Business name <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={inputStyle}
                value={formData.businessName}
                onChangeText={(text) => handleChange('businessName', text)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={inputStyle}
                value={formData.location}
                onChangeText={(text) => handleChange('location', text)}
              />
            </View>

             <View style={styles.formGroup}>
              <Text style={styles.label}>Phone <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={inputStyle}
                value={formData.phone}
                onChangeText={(text) => handleChange('phone', text)}
                keyboardType="phone-pad"
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
              />
            </View>


            {/* Checkbox for consent */}
            {/* Note: react-native CheckBox is deprecated, consider @react-native-community/checkbox */}
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
                  {/* Kept required indicator if consent is mandatory */}
                  {/* <Text style={styles.required}>*</Text> */}
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
                <Text style={styles.submitButtonText}>Send Message</Text>
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
});