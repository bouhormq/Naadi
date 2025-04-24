import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  // @ts-ignore
  CheckBox,
  Platform,
  useWindowDimensions,
  Linking,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { PartnerSignupRequest, PhoneInfo } from '@naadi/types'; // Assuming these types exist
// Import PhoneInput and its exported countriesData
import PhoneInput, { countriesData } from './PhoneInput'; // Adjust path if needed
import CustomText from 'components/CustomText';

export default function PartnerSignupFormContent() {
  const defaultCountryData = countriesData.find(country => country.code === 'MA') || countriesData[0];

  const [formData, setFormData] = useState<PartnerSignupRequest>({
    email: '',
    firstName: '',
    lastName: '',
    businessName: '',
    website: '',
    businessType: '',
    location: '',
    phone: {
      code: defaultCountryData.code,
      name: defaultCountryData.name,
      number: '', // Raw number
      dialCode: defaultCountryData.dialCode,
    },
    consent: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [phoneValid, setPhoneValid] = useState(true); // Validity determined on submit
  const [successfullySubmitted, setSuccessfullySubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});

  const { width } = useWindowDimensions();
  const isSmallScreen = width <= 800;

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
    if (successMessage) setSuccessMessage(null);
    if (validationErrors[field]) {
        setValidationErrors(prev => {
            const newState = {...prev};
            delete newState[field];
            return newState;
        });
    }
     // Clear generic error message if user types in a field that wasn't the one causing the error
     if (error && !validationErrors[field]) {
         setError(null);
     }
    if (successfullySubmitted) setSuccessfullySubmitted(false);
  };

   const handlePhoneInputChange = (
       formattedText: string, // Received from PhoneInput
       country: typeof countriesData[0],
       rawNumber: string
   ) => {
      // console.log('Parent handlePhoneInputChange: Received', { formattedText, countryCode: country.code, rawNumber });
      const phoneInfo: PhoneInfo = {
          code: country.code,
          name: country.name,
          number: rawNumber, // Store the raw number
          dialCode: country.dialCode,
      };

      setFormData(prev => ({
         ...prev,
         phone: phoneInfo,
      }));

      // Clear validation errors for the phone field specifically when user types
      if (error && (validationErrors.phone || error === 'Please enter a valid phone number.' || error === 'Please fill out all required fields (*).')) {
         setError(null); // Clear general error message if it was related to phone
      }
      if (validationErrors.phone) {
         setValidationErrors(prev => {
            const newState = {...prev};
            delete newState.phone;
            return newState;
         });
         // Reset visual validity state when user starts correcting
         setPhoneValid(true);
      }

      if (successfullySubmitted) {
         setSuccessfullySubmitted(false);
      }
   };


  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    // console.log('handleSubmit triggered');
    setError(null);
    setSuccessMessage(null);
    setValidationErrors({});
    setSuccessfullySubmitted(false);
    // Assume valid initially for this submission attempt
    let isSubmissionValid = true;
    // Reset phoneValid state before new validation
    setPhoneValid(true);


    let currentValidationErrors: Record<string, boolean> = {};
    let firstErrorMessage: string | null = null;

    // --- Validation ---
    // 1. Required Fields
    if (!formData.email.trim()) currentValidationErrors.email = true;
    if (!formData.firstName.trim()) currentValidationErrors.firstName = true;
    if (!formData.lastName.trim()) currentValidationErrors.lastName = true;
    if (!formData.businessName.trim()) currentValidationErrors.businessName = true;
    if (!formData.location) currentValidationErrors.location = true;
    if (!formData.businessType) currentValidationErrors.businessType = true;
    if (!formData.phone.number.trim()) currentValidationErrors.phone = true;

    if (Object.keys(currentValidationErrors).length > 0) {
        firstErrorMessage = 'Please fill out all required fields (*).';
        isSubmissionValid = false;
        // Explicitly set phoneValid to false ONLY if phone itself was empty
        if (currentValidationErrors.phone) {
            setPhoneValid(false);
        }
    } else {
        // 2. Email Format
        if (!validateEmail(formData.email)) {
            currentValidationErrors.email = true;
            firstErrorMessage = 'Please enter a valid email address.';
            isSubmissionValid = false;
        } else {
            // 3. Phone Number Validity (e.g., length)
            const rawPhoneNumber = formData.phone.number;
            // Replace with your actual desired validation logic
            const isPhoneNumberValid = rawPhoneNumber.length >= 8 && rawPhoneNumber.length <= 15;

            if (!isPhoneNumberValid) {
                // console.log('Phone validation failed:', rawPhoneNumber);
                setPhoneValid(false); // Update state for styling prop
                currentValidationErrors.phone = true; // Mark field for border
                firstErrorMessage = 'Please enter a valid phone number.';
                isSubmissionValid = false;
            }
            // else {
            //     console.log('Phone validation passed:', rawPhoneNumber);
            // }
        }
    }

    // Update field errors for styling
    setValidationErrors(currentValidationErrors);

    // If any validation failed, set the error message and stop
    if (!isSubmissionValid) {
        setError(firstErrorMessage);
        console.log('Validation failed:', firstErrorMessage, 'Fields with errors:', currentValidationErrors);
        return;
    }

    // --- Proceed with API Call ---
    // console.log('Validation passed. Submitting:', formData);
    setLoading(true);
    try {
      const response = await fetch('https://api-3k2a2q5awq-no.a.run.app/partner-register-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        let errorDetail = `HTTP error! status: ${response.status}`;
         try {
             const errorBody = await response.text(); // Try reading text body
             if (errorBody) errorDetail += ` - ${errorBody}`;
             console.error('API error response body:', errorBody);
         } catch (parseError) { console.error('Failed to parse API error body:', parseError); }
        throw new Error(errorDetail);
      }

      // const result = await response.json(); // Assuming JSON response on success
      // console.log('Signup successful:', result);

      setSuccessMessage('Thank you for signing up! We will be in touch shortly.');
      setSuccessfullySubmitted(true);
      // Reset form
      setFormData({
        email: '', firstName: '', lastName: '', businessName: '', website: '',
        businessType: '', location: '',
        phone: { code: defaultCountryData.code, name: defaultCountryData.name, number: '', dialCode: defaultCountryData.dialCode },
        consent: false,
      });
      setValidationErrors({});
      setPhoneValid(true); // Reset validity state

    } catch (err) {
      console.error('Signup error:', err);
      // Don't show HTTP errors directly to the user generally
      setError(err instanceof Error && err.message.startsWith('HTTP error!') ? 'Failed to sign up. Please try again later.' : (err instanceof Error ? err.message : 'An unexpected error occurred.'));
      setSuccessMessage(null);
      setSuccessfullySubmitted(false);
      // Decide whether to keep validation errors shown or clear them on API error
      // Clearing them might be less confusing if it's a server issue
       setValidationErrors({});
       setPhoneValid(true);
    } finally {
      setLoading(false);
    }
  };

  // Moroccan cities data
  const moroccanCities = [
    { label: 'Please select', value: '', enabled: false },
    { label: 'Tetouan', value: 'Tetouan' }, { label: 'Tangier', value: 'Tangier' },
    { label: 'Casablanca', value: 'Casablanca' }, { label: 'Rabat', value: 'Rabat' },
    { label: 'Fes', value: 'Fes' }, { label: 'Marrakech', value: 'Marrakech' },
    { label: 'Agadir', value: 'Agadir' }, { label: 'Meknes', value: 'Meknes' },
    { label: 'Oujda', value: 'Oujda' }, { label: 'Kenitra', value: 'Kenitra' },
  ];

  const formRowStyle = [styles.formRow, isSmallScreen && styles.formRowMobile];
  const formGroupHalfStyle = [styles.formGroupHalf, isSmallScreen && styles.formGroupFullMobile];

  return (
    <View style={styles.formWrapper}>
      <View style={styles.formContainer}>
        <View style={styles.formHeader}>
          <CustomText style={styles.formTitle}>Ready to grow your business?</CustomText>
          <CustomText style={styles.formSubtitle}>Fill out the form below to see what Naadi can do for your company.</CustomText>
        </View>

        <View style={styles.form}>
          {/* Email Field */}
          <View style={styles.formGroup}>
            <CustomText style={styles.label}>Email <CustomText style={styles.required}>*</CustomText></CustomText>
            <TextInput
              style={[styles.input, validationErrors.email ? styles.inputError : null]}
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Name Row */}
          <View style={formRowStyle}>
            {/* First Name Group */}
            <View style={[
                formGroupHalfStyle,
                isSmallScreen && styles.formGroupFullMobile,
                isSmallScreen && { marginBottom: 18 } // Apply margin below First Name in mobile
            ]}>
              <CustomText style={styles.label}>First name <CustomText style={styles.required}>*</CustomText></CustomText>
              <TextInput
                style={[styles.input, validationErrors.firstName ? styles.inputError : null]}
                value={formData.firstName}
                onChangeText={(text) => handleChange('firstName', text)}
                placeholder="First name"
                placeholderTextColor="#9ca3af"
              />
            </View>
            {/* Last Name Group */}
            <View style={[formGroupHalfStyle, isSmallScreen && styles.formGroupFullMobile, { marginRight: 0 }]}>
              <CustomText style={styles.label}>Last name <CustomText style={styles.required}>*</CustomText></CustomText>
              <TextInput
                style={[styles.input, validationErrors.lastName ? styles.inputError : null]}
                value={formData.lastName}
                onChangeText={(text) => handleChange('lastName', text)}
                placeholder="Last name"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          {/* Business Name */}
          <View style={styles.formGroup}>
            <CustomText style={styles.label}>Business name <CustomText style={styles.required}>*</CustomText></CustomText>
            <TextInput
              style={[styles.input, validationErrors.businessName ? styles.inputError : null]}
              value={formData.businessName}
              onChangeText={(text) => handleChange('businessName', text)}
              placeholder="Your business name"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Business Type */}
          <View style={styles.formGroup}>
            <CustomText style={styles.label}>Business type <CustomText style={styles.required}>*</CustomText></CustomText>
            <View style={[styles.pickerWrapper, validationErrors.businessType ? styles.inputError : null]}>
              <Picker
                selectedValue={formData.businessType}
                onValueChange={(itemValue) => handleChange('businessType', itemValue as string)}
                style={[styles.picker, !formData.businessType && { color: '#9ca3af' }]}
                dropdownIconColor="#9ca3af" >
                <Picker.Item label="Please select" value="" enabled={false} style={{ color: '#9ca3af' }} />
                <Picker.Item label="Fitness (studios, gyms, etc.)" value="Studio" />
                <Picker.Item label="Wellness (salons, spas, etc.)" value="Wellness" />
                <Picker.Item label="Food & beverage (restaurants, coffee shops, etc.)" value="Food and Beverage" />
              </Picker>
            </View>
          </View>

          {/* Website */}
          <View style={styles.formGroup}>
            <CustomText style={styles.label}>Website <CustomText style={styles.optional}>(Optional)</CustomText></CustomText>
            <TextInput
              style={styles.input}
              value={formData.website}
              onChangeText={(text) => handleChange('website', text)}
              placeholder="Your website URL"
              placeholderTextColor="#9ca3af"
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          {/* Location */}
          <View style={styles.formGroup}>
            <CustomText style={styles.label}>Location <CustomText style={styles.required}>*</CustomText></CustomText>
            <View style={[styles.pickerWrapper, validationErrors.location ? styles.inputError : null]}>
              <Picker
                selectedValue={formData.location}
                onValueChange={(itemValue) => handleChange('location', itemValue as string)}
                style={[styles.picker, !formData.location && { color: '#9ca3af' }]}
                dropdownIconColor="#9ca3af" >
                {moroccanCities.map((city) => (
                  <Picker.Item
                    key={city.value || 'placeholder'}
                    label={city.label}
                    value={city.value}
                    enabled={city.enabled !== false}
                    style={city.enabled === false ? { color: '#9ca3af' } : {}}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Phone Field */}
          <View style={styles.phoneContainer}>
            <CustomText style={styles.label}>Phone <CustomText style={styles.required}>*</CustomText></CustomText>
            {/* Wrapper gets border based on validationErrors */}
            <View style={[styles.phoneInputWrapper, validationErrors.phone ? styles.inputError : null]}>
                <PhoneInput
                  // Value is the formatted string from parent state
                  value={`${formData.phone.dialCode}${formData.phone.number}`}
                  // Reports changes via this callback
                  onChangeFormattedText={handlePhoneInputChange}
                  // Internal TextInput uses this basic handler
                  onChangeText={() => {}} // Basic handler needed for TextInput binding
                  placeholder="Your phone number"
                  // Receives validity based on parent's submit check
                  isValid={phoneValid}
                  defaultCountry="MA"
                />
            </View>
          </View>

          {/* Consent Checkbox */}
          <View style={styles.checkboxContainer}>
             {/* ... checkbox logic ... */}
             {Platform.OS === 'web' ? (
              <input
                type="checkbox"
                checked={formData.consent}
                onChange={(e) => handleChange('consent', e.target.checked)}
                style={{ marginRight: 10, marginTop: 2 }} />
            ) : (
              <CheckBox
                value={formData.consent}
                onValueChange={(value: boolean) => handleChange('consent', value)}
                tintColors={{ true: '#007bff', false: '#adb5bd' }}
                style={styles.checkbox} />
            )}
            <View style={styles.checkboxTextContainer}>
              <CustomText style={styles.checkboxText}>
                I agree to receive marketing and other communications from Naadi PR Group, and/or its affiliates.{' '}
              </CustomText>
              <CustomText style={styles.checkboxSubtext}>
                You can unsubscribe from these communications at any time. For more information, please review our{' '}
                <CustomText style={styles.link}>Terms of Use</CustomText> and{' '}
                <CustomText style={styles.link}>Privacy Policy</CustomText>.
              </CustomText>
            </View>
          </View>

          {/* Error & Success Messages */}
          {error && <CustomText style={styles.errorText}>{error}</CustomText>}
          {successMessage && <CustomText style={styles.successText}>{successMessage}</CustomText>}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading} >
            {loading ? <ActivityIndicator color="#fff" size="small" /> : <CustomText style={styles.submitButtonText}>Get started</CustomText>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Styles (Updated formGroupFullMobile and formRowMobile)
const styles = StyleSheet.create({
  formWrapper: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
    zIndex: 0, // Ensure form container doesn't obscure the PhoneInput dropdown
  },
  formHeader: {
    marginBottom: 25,
    alignItems: 'flex-start',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  form: {
       zIndex: 1, // Keep form elements above container background
  },
  formGroup: {
    marginBottom: 18,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18, // Keep margin for horizontal layout (after the row)
  },
  formRowMobile: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    // REMOVED marginBottom here
    // marginBottom: 18,
  },
  formGroupHalf: {
    width: '48%',
    // REMOVED general marginBottom here
    // marginBottom: 18,
  },
  formGroupFullMobile: {
    width: '100%',
    // REMOVED marginBottom from here
    // marginBottom: 18,
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
    borderColor: '#d1d5db', // Default border color
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 14,
    color: '#1f2937',
    backgroundColor: '#fff',
    minHeight: 40,
  },
  inputError: {
    borderColor: '#ef4444', // Red border for error state
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#d1d5db', // Default border color
    borderRadius: 8,
    backgroundColor: '#fff',
    minHeight: 40,
    justifyContent: 'center',
    overflow: 'hidden',
     zIndex: 1,
  },
  // pickerWrapperError is handled by applying inputError style directly
  picker: {
    height: Platform.OS === 'ios' ? undefined : 40,
    width: '100%',
    color: '#1f2937',
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: Platform.OS === 'ios' ? 10 : 6,
    paddingVertical: 0,
  },
  phoneContainer: {
     marginBottom: 18,
     zIndex: 10, // Keep high for dropdown visibility
  },
  phoneInputWrapper: { // Added wrapper for PhoneInput border control
      borderWidth: 1,
      borderColor: '#d1d5db', // Default border
      borderRadius: 8,
  },
  // phoneInputWrapperError is handled by applying inputError style directly
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    marginTop: 10,
     zIndex: 0,
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
  errorText: { // Style for the single error message below
    color: '#ef4444',
    // No background/border needed here, just text color
    // backgroundColor: '#fef2f2', // Optional light red background
    // borderColor: '#fecaca', // Optional light red border
    // borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    textAlign: 'left',
    fontWeight: '500',
    overflow: 'hidden',
    marginTop: 10, // Space above the message
    zIndex: 0,
  },
  successText: {
    color: '#28a745', // Green success color
    // backgroundColor: '#f0fdf4', // Optional light green background
    // borderColor: '#bbf7d0', // Optional light green border
    // borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    textAlign: 'left',
    fontWeight: '500',
    overflow: 'hidden',
    marginTop: 10, // Space above the message
     zIndex: 0,
  },
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
     zIndex: 0,
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