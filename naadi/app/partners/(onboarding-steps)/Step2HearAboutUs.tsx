import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import CustomText from '@/components/CustomText';
import { Ionicons } from '@expo/vector-icons';
import StepTemplate from './_StepTemplate';
import { useOnboarding } from '@naadi/utils/onboarding/OnboardingContext';

const options = [
  { id: 'friend', label: 'Recommended by a friend', icon: '👥' },
  { id: 'search', label: 'Search engine (e.g. Google, Bing)', icon: '🔍' },
  { id: 'social', label: 'Social media', icon: '📱' },
  { id: 'email', label: 'Advert in the mail', icon: '📧' },
  { id: 'magazine', label: 'Magazine ad', icon: '📰' },
  { id: 'website', label: 'Ratings website (e.g. Capterra, Trustpilot)', icon: '⭐' },
  { id: 'other', label: 'Other', icon: '❓' },
];

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Step2HearAboutUs({ onNext, onBack }: Step2Props) {
  const { data, updateData } = useOnboarding();
  const [selected, setSelected] = useState<string | undefined>(data.hearAboutUs);

  const handleSelect = (optionId: string) => {
    setSelected(optionId);
    updateData('hearAboutUs', optionId);
  };

  const handleContinue = () => {
    if (selected) {
      onNext();
    }
  };

  return (
    <StepTemplate
      title="How did you hear about Naadi?"
      subtitle="This helps us understand where to find more partners like you"
      onNext={handleContinue}
      onBack={onBack}
      nextButtonText="Continue"
      isNextDisabled={!selected}
    >
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.option,
              selected === option.id && styles.optionSelected,
            ]}
            onPress={() => handleSelect(option.id)}
          >
            <View style={styles.optionContent}>
              <CustomText style={styles.optionIcon}>{option.icon}</CustomText>
              <View style={styles.optionTextContainer}>
                <CustomText
                  style={[
                    styles.optionLabel,
                    selected === option.id && styles.optionLabelSelected,
                  ]}
                >
                  {option.label}
                </CustomText>
              </View>
            </View>
            {selected === option.id && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark-circle" size={24} color="#2563eb" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </StepTemplate>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  optionSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#f0f4ff',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  optionIcon: {
    fontSize: 24,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    lineHeight: 20,
  },
  optionLabelSelected: {
    color: '#2563eb',
    fontWeight: '600',
  },
  checkmark: {
    marginLeft: 8,
  },
});
