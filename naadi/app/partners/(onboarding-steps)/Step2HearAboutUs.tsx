import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import CustomText from '@/components/CustomText';
import { Ionicons } from '@expo/vector-icons';
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

interface Step6Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Step2HearAboutUs({ onNext, onBack }: Step6Props) {
  const { data, updateData, saveToFirebase, isSaving } = useOnboarding();
  const [selected, setSelected] = useState<string | undefined>(data.hearAboutUs);
  const [localSaving, setLocalSaving] = useState(false);

  const handleSelect = (optionId: string) => {
    // Toggle: if already selected, deselect; otherwise select
    if (selected === optionId) {
      setSelected(undefined);
      updateData('hearAboutUs', undefined);
    } else {
      setSelected(optionId);
      updateData('hearAboutUs', optionId);
    }
  };

  const handleContinue = async () => {
    if (!selected) return;

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
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <CustomText style={styles.backText}>←</CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.continueButton, (!selected || isLoading) && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!selected || isLoading}
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
          <CustomText style={styles.accountSetupLabel}>Final step</CustomText>

          {/* Title */}
          <CustomText style={styles.title}>How did you hear about us?</CustomText>

          {/* Subtitle */}
          <CustomText style={styles.subtitle}>
            This helps us understand where to find more partners like you
          </CustomText>

          {/* Options */}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 20,
    color: '#64748b',
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
    paddingBottom: 40,
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
