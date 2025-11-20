import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import CustomText from '@/components/CustomText';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '@naadi/utils/onboarding/OnboardingContext';
import { useRouter } from 'expo-router';

const teamSizeOptions = [
  { id: 'solo', label: 'Just me', icon: '👤' },
  { id: '2-5', label: '2-5 people', icon: '👥' },
  { id: '6-10', label: '6-10 people', icon: '👫' },
  { id: '11-20', label: '11-20 people', icon: '🏢' },
  { id: '20+', label: '20+ people', icon: '🏭' },
];

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Step4TeamSize({ onNext, onBack }: Step3Props) {
  const router = useRouter();
  const { data, updateData, saveToFirebase, isSaving } = useOnboarding();
  const [selected, setSelected] = useState<string | undefined>(data.teamSize);
  const [localSaving, setLocalSaving] = useState(false);

  const handleSelect = (sizeId: string) => {
    // Toggle: if already selected, deselect; otherwise select
    if (selected === sizeId) {
      setSelected(undefined);
      updateData('teamSize', undefined);
    } else {
      setSelected(sizeId);
      updateData('teamSize', sizeId);
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

  const handleClose = async () => {
    setLocalSaving(true);
    try {
      await saveToFirebase();
      router.replace('/partners');
    } catch (error) {
      console.error('Error saving before close:', error);
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
        <View style={styles.buttonGroup}>
          {selected && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#64748b" />
              ) : (
                <CustomText style={styles.closeButtonText}>Close</CustomText>
              )}
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!selected || isLoading) && styles.buttonDisabled,
            ]}
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
      </View>

      {/* Main content with centered layout */}
      <View style={styles.contentWrapper}>
          {/* Account setup label */}
          <CustomText style={styles.accountSetupLabel}>Account setup</CustomText>

          {/* Title */}
          <CustomText style={styles.title}>What's your team size?</CustomText>

          {/* Subtitle */}
          <CustomText style={styles.subtitle}>
            This will help us set up your calendar correctly. Don't worry, this doesn't change the price - you can have unlimited team members for free on Fresha!
          </CustomText>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {teamSizeOptions.map((option) => (
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

          {/* Info Box */}
          {selected && (
            <View style={styles.infoBox}>
              <CustomText style={styles.infoIcon}>💡</CustomText>
              <CustomText style={styles.infoText}>
                We'll add 'Mohamed' as an example employee so you can see how the system works. You can manage employees later once you're in!
              </CustomText>
            </View>
          )}
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
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  closeButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 24,
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
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    padding: 14,
    alignItems: 'flex-start',
    gap: 12,
  },
  infoIcon: {
    fontSize: 18,
    marginTop: 2,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1e40af',
    lineHeight: 19,
    flex: 1,
  },
});
