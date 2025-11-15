import React from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import CustomText from '@/components/CustomText';
import { Ionicons } from '@expo/vector-icons';

interface Step13Props {
  onComplete: () => void;
  loading?: boolean;
}

export default function Step13Complete({ onComplete, loading = false }: Step13Props) {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.checkmarkCircle}>
            <Ionicons name="checkmark" size={60} color="#fff" />
          </View>
        </View>

        {/* Title */}
        <CustomText style={styles.title}>Onboarding Complete!</CustomText>

        {/* Subtitle */}
        <CustomText style={styles.subtitle}>
          Your business profile is all set up. You're ready to start managing your bookings and growing your business on Naadi.
        </CustomText>

        {/* Key Points */}
        <View style={styles.pointsContainer}>
          <View style={styles.point}>
            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            <CustomText style={styles.pointText}>Business information saved</CustomText>
          </View>
          <View style={styles.point}>
            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            <CustomText style={styles.pointText}>Booking system activated</CustomText>
          </View>
          <View style={styles.point}>
            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            <CustomText style={styles.pointText}>You're live on Naadi!</CustomText>
          </View>
        </View>

        {/* Next Steps */}
        <View style={styles.nextStepsContainer}>
          <CustomText style={styles.nextStepsTitle}>Next Steps:</CustomText>
          <CustomText style={styles.nextStepsText}>
            • Start accepting bookings from customers
          </CustomText>
          <CustomText style={styles.nextStepsText}>
            • Customize your team members and services
          </CustomText>
          <CustomText style={styles.nextStepsText}>
            • Monitor your calendar and payments
          </CustomText>
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={onComplete}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <CustomText style={styles.buttonText}>Go to Dashboard</CustomText>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  contentContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 30,
  },
  checkmarkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 30,
  },
  pointsContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    gap: 12,
  },
  point: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pointText: {
    fontSize: 14,
    color: '#1a202c',
    fontWeight: '500',
    flex: 1,
  },
  nextStepsContainer: {
    width: '100%',
    backgroundColor: '#e0f2ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  nextStepsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0369a1',
    marginBottom: 8,
  },
  nextStepsText: {
    fontSize: 13,
    color: '#0c4a6e',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#cbd5e1',
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
