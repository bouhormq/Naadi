import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import CustomText from '@/components/CustomText';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '@naadi/utils/onboarding/OnboardingContext';

const softwareOptions = [
  { id: 'fresha', label: 'Fresha', icon: '🎯' },
  { id: 'acuityScheduling', label: 'Acuity Scheduling', icon: '📅' },
  { id: 'mindbody', label: 'Mindbody', icon: '💪' },
  { id: 'booksy', label: 'Booksy', icon: '📱' },
  { id: 'vagaro', label: 'Vagaro', icon: '✂️' },
  { id: 'simplybook', label: 'SimplyBook.me', icon: '📖' },
  { id: 'square', label: 'Square', icon: '◻️' },
  { id: 'other', label: 'Other', icon: '❓' },
  { id: 'none', label: 'No software yet', icon: '📝' },
];

interface Step5Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Step2CurrentSoftware({ onNext, onBack }: Step5Props) {
  const { data, updateData, saveToFirebase, isSaving } = useOnboarding();
  const [selected, setSelected] = useState<string | undefined>(data.currentSoftware);
  const [localSaving, setLocalSaving] = useState(false);

  const handleSelect = (optionId: string) => {
    // Toggle: if already selected, deselect; otherwise select
    if (selected === optionId) {
      setSelected(undefined);
      updateData('currentSoftware', undefined);
    } else {
      setSelected(optionId);
      updateData('currentSoftware', optionId);
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
        <CustomText style={styles.accountSetupLabel}>Account setup</CustomText>

        {/* Title */}
        <CustomText style={styles.title}>Which software are you currently using?</CustomText>

        {/* Subtitle */}
        <CustomText style={styles.subtitle}>
          If you're looking to switch, we can help speed up your business setup and import your data into your new Naadi account.
        </CustomText>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {softwareOptions.map((option) => (
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
