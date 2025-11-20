import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import CustomText from '@/components/CustomText';
import { useOnboarding } from '@naadi/utils/onboarding/OnboardingContext';

const serviceCategories = [
  { id: 'hair', label: 'Hair', icon: '💇' },
  { id: 'nails', label: 'Nails', icon: '💅' },
  { id: 'massage', label: 'Massage & Spa', icon: '💆' },
  { id: 'fitness', label: 'Fitness & Training', icon: '💪' },
  { id: 'beauty', label: 'Beauty & Makeup', icon: '💄' },
  { id: 'dental', label: 'Dental', icon: '🦷' },
  { id: 'wellness', label: 'Wellness & Health', icon: '🧘' },
  { id: 'consulting', label: 'Consulting', icon: '🤝' },
  { id: 'photography', label: 'Photography', icon: '📸' },
  { id: 'tuition', label: 'Tuition & Classes', icon: '📚' },
  { id: 'other', label: 'Other', icon: '❓' },
];

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Step5Services({ onNext, onBack }: Step2Props) {
  const { data, updateData, saveToFirebase, isSaving } = useOnboarding();
  const [primaryService, setPrimaryService] = useState<string | undefined>(
    typeof data.services === 'string' ? data.services : data.services?.primary
  );
  const [relatedServices, setRelatedServices] = useState<string[]>(
    typeof data.services === 'object' && data.services?.related
      ? data.services.related
      : []
  );
  const [localSaving, setLocalSaving] = useState(false);

  const handleSelect = (serviceId: string) => {
    if (!primaryService) {
      // First selection becomes primary
      setPrimaryService(serviceId);
      updateData('services', {
        primary: serviceId,
        related: [],
      });
    } else if (primaryService === serviceId) {
      // Deselect primary
      setPrimaryService(undefined);
      setRelatedServices([]);
      updateData('services', undefined);
    } else if (relatedServices.includes(serviceId)) {
      // Remove from related
      const updated = relatedServices.filter((id) => id !== serviceId);
      setRelatedServices(updated);
      updateData('services', {
        primary: primaryService,
        related: updated,
      });
    } else if (relatedServices.length < 3) {
      // Add to related (max 3)
      const updated = [...relatedServices, serviceId];
      setRelatedServices(updated);
      updateData('services', {
        primary: primaryService,
        related: updated,
      });
    }
  };

  const handleContinue = async () => {
    if (!primaryService) return;

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
          style={[
            styles.continueButton,
            (!primaryService || isLoading) && styles.buttonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!primaryService || isLoading}
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
          <CustomText style={styles.title}>What services do you offer?</CustomText>

          {/* Subtitle */}
          <CustomText style={styles.subtitle}>
            Choose your primary and up to 3 related service types.
          </CustomText>          {/* Options */}
          <View style={styles.optionsContainer}>
            {serviceCategories.map((service) => {
              const isPrimary = primaryService === service.id;
              const isRelated = relatedServices.includes(service.id);
              const isSelected = isPrimary || isRelated;

              return (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.option,
                    isSelected && styles.optionSelected,
                    isPrimary && styles.optionPrimary,
                  ]}
                  onPress={() => handleSelect(service.id)}
                >
                  <CustomText style={styles.optionIcon}>{service.icon}</CustomText>
                  <CustomText
                    style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelSelected,
                    ]}
                  >
                    {service.label}
                  </CustomText>
                  {isPrimary && (
                    <View style={styles.badgeContainer}>
                      <CustomText style={styles.badge}>Primary</CustomText>
                    </View>
                  )}
                  {isRelated && (
                    <View style={styles.numberBadge}>
                      <CustomText style={styles.numberBadgeText}>
                        {relatedServices.indexOf(service.id) + 2}
                      </CustomText>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  option: {
    width: '31%',
    aspectRatio: 1.2,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  optionSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  optionPrimary: {
    borderColor: '#1e40af',
    borderWidth: 2,
    backgroundColor: '#dbeafe',
  },
  optionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1f2937',
    textAlign: 'center',
  },
  optionLabelSelected: {
    color: '#2563eb',
    fontWeight: '600',
  },
  badgeContainer: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#1e40af',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badge: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
  },
  numberBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  checkmark: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
});
