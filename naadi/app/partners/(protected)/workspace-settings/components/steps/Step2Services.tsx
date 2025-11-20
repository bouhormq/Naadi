import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import CustomText from '@/components/CustomText';

interface Step2ServicesProps {
  primaryService: string | undefined;
  setPrimaryService: (id: string | undefined) => void;
  relatedServices: string[];
  setRelatedServices: (ids: string[]) => void;
}

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

export default function Step2Services({
  primaryService,
  setPrimaryService,
  relatedServices,
  setRelatedServices
}: Step2ServicesProps) {

  const handleServiceSelect = (serviceId: string) => {
    if (!primaryService) {
      setPrimaryService(serviceId);
    } else if (primaryService === serviceId) {
      setPrimaryService(undefined);
      setRelatedServices([]);
    } else if (relatedServices.includes(serviceId)) {
      setRelatedServices(relatedServices.filter(id => id !== serviceId));
    } else if (relatedServices.length < 3) {
      setRelatedServices([...relatedServices, serviceId]);
    }
  };

  return (
    <View>
      <CustomText style={styles.stepTitle}>Choose your main business type</CustomText>
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
            onPress={() => handleServiceSelect(service.id)}
          >
            <CustomText style={styles.optionIcon}>{service.icon}</CustomText>
            <CustomText style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
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
  );
}

const styles = StyleSheet.create({
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  option: {
    width: '15%',
    aspectRatio: 1,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  optionSelected: {
    borderColor: '#4f46e5',
    backgroundColor: '#eef2ff',
  },
  optionPrimary: {
    borderColor: '#4338ca',
    borderWidth: 2,
    backgroundColor: '#e0e7ff',
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#1f2937',
    textAlign: 'center',
  },
  optionLabelSelected: {
    color: '#4f46e5',
    fontWeight: '600',
  },
  badgeContainer: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#4338ca',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badge: {
    fontSize: 8,
    fontWeight: '700',
    color: '#ffffff',
  },
  numberBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
});
