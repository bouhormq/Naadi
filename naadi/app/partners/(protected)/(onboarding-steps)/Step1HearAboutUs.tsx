import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import CustomText from '@/components/CustomText';
import { useOnboarding } from '@naadi/utils/onboarding/OnboardingContext';

interface Step1Props {
  onNext: () => void;
}

export default function Step1BusinessName({ onNext }: Step1Props) {
  const { data, updateData, saveToFirebase, isSaving } = useOnboarding();
  const [businessName, setBusinessName] = useState<string>(data.businessName || '');
  const [website, setWebsite] = useState<string>(data.website || '');
  const [localSaving, setLocalSaving] = useState(false);

  const handleBusinessNameChange = (text: string) => {
    setBusinessName(text);
    updateData('businessName', text);
  };

  const handleWebsiteChange = (text: string) => {
    setWebsite(text);
    updateData('website', text);
  };

  const handleContinue = async () => {
    if (!businessName.trim()) return;

    setLocalSaving(true);
    try {
      await saveToFirebase();
      onNext();
    } catch (error) {
      console.error('Error saving and continuing:', error);
      // TODO: Show error toast/alert
    } finally {
      setLocalSaving(false);
    }
  };

  const isLoading = isSaving || localSaving;

  return (
    <ScrollView style={styles.container}>
      {/* Header with Continue button in top right */}
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!businessName.trim() || isLoading) && styles.buttonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!businessName.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <CustomText style={styles.continueButtonText}>Continue</CustomText>
          )}
        </TouchableOpacity>
      </View>

      {/* Main content with centered layout */}
      <View style={styles.contentWrapper}>
          {/* Account setup label */}
          <CustomText style={styles.accountSetupLabel}>Account setup</CustomText>

          {/* Title */}
          <CustomText style={styles.title}>What's your business name?</CustomText>

          {/* Subtitle */}
          <CustomText style={styles.subtitle}>
            This is the brand name your clients will see. Your billing and legal name can be added later.
          </CustomText>

          {/* Form fields */}
          <View style={styles.formContainer}>
            {/* Business Name Input */}
            <View style={styles.formGroup}>
              <CustomText style={styles.label}>Business name</CustomText>
              <TextInput
                style={styles.input}
                placeholder="Enter your business name"
                placeholderTextColor="#cbd5e1"
                value={businessName}
                onChangeText={handleBusinessNameChange}
                editable={true}
              />
            </View>

            {/* Website Input */}
            <View style={styles.formGroup}>
              <CustomText style={styles.label}>
                Website{' '}
                <CustomText style={styles.optional}>(Optional)</CustomText>
              </CustomText>
              <TextInput
                style={styles.input}
                placeholder="www.yoursite.com"
                placeholderTextColor="#cbd5e1"
                value={website}
                onChangeText={handleWebsiteChange}
                keyboardType="url"
                editable={true}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  continueButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  buttonDisabled: {
    backgroundColor: '#cbd5e1',
    opacity: 0.6,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  contentWrapper: {
    marginLeft: '35%',
    marginRight: '35%',
    flex: 1,
  },
  accountSetupLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 16,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 21,
    marginBottom: 32,
  },
  formContainer: {
    gap: 24,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
  },
  optional: {
    fontSize: 13,
    fontWeight: '400',
    color: '#64748b',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1a202c',
    backgroundColor: '#fff',
    minHeight: 48,
  },
});
