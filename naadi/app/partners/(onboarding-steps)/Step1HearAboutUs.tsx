import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import CustomText from '@/components/CustomText';
import StepTemplate from './_StepTemplate';
import { useOnboarding } from '@naadi/utils/onboarding/OnboardingContext';

interface Step1Props {
  onNext: () => void;
}

export default function Step1HearAboutUs({ onNext }: Step1Props) {
  const { data, updateData } = useOnboarding();
  const [businessName, setBusinessName] = useState<string>(data.businessName || '');
  const [website, setWebsite] = useState<string>(data.website || '');

  const handleBusinessNameChange = (text: string) => {
    setBusinessName(text);
    updateData('businessName', text);
  };

  const handleWebsiteChange = (text: string) => {
    setWebsite(text);
    updateData('website', text);
  };

  const handleContinue = () => {
    if (businessName.trim()) {
      onNext();
    }
  };

  return (
    <StepTemplate
      title="What's your business name?"
      subtitle="This is the brand name your clients will see. Your billing and legal name can be added later."
      onNext={handleContinue}
      nextButtonText="Continue"
      isNextDisabled={!businessName.trim()}
    >
      <View style={styles.container}>
        {/* Business Name Input */}
        <View style={styles.formGroup}>
          <CustomText style={styles.label}>Business name</CustomText>
          <TextInput
            style={styles.input}
            placeholder="e.g., Your Studio Name"
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
    </StepTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
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
    paddingVertical: 10,
    fontSize: 14,
    color: '#1a202c',
    backgroundColor: '#fff',
    minHeight: 48,
  },
});
