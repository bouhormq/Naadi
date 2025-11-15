import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';
import CustomText from '@/components/CustomText';
import { completeOnboarding } from '@naadi/api';
import { useSession } from '@naadi/hooks/ctx';

export default function UserOnboardingScreen() {
  const router = useRouter();
  const { session } = useSession();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleCompleteOnboarding = async () => {
    if (!session?.uid) return;

    setLoading(true);
    try {
      await completeOnboarding(session.uid);
      console.log('Onboarding completed for user');
      // Redirect to user dashboard
      router.replace('/(main)/(protected)');
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Allow skipping to dashboard
    handleCompleteOnboarding();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerSection}>
        <CustomText style={styles.title}>Welcome to Naadi</CustomText>
        <CustomText style={styles.subtitle}>
          Discover amazing wellness experiences
        </CustomText>
      </View>

      {/* Main Onboarding Screen */}
      <View style={styles.onboardingCard}>
        <View style={styles.stepIndicator}>
          <CustomText style={styles.stepText}>Onboarding Screen</CustomText>
        </View>

        <View style={styles.contentBox}>
          <CustomText style={styles.contentTitle}>
            🎯 Get Started with Naadi
          </CustomText>
          <CustomText style={styles.contentDescription}>
            Browse and book wellness classes from top studios in your area. Create your profile, find your favorite
            studios, and manage your bookings all in one place.
          </CustomText>

          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <CustomText style={styles.featureIcon}>✨</CustomText>
              <CustomText style={styles.featureText}>Discover local studios</CustomText>
            </View>
            <View style={styles.featureItem}>
              <CustomText style={styles.featureIcon}>📅</CustomText>
              <CustomText style={styles.featureText}>Easy booking management</CustomText>
            </View>
            <View style={styles.featureItem}>
              <CustomText style={styles.featureIcon}>⭐</CustomText>
              <CustomText style={styles.featureText}>Save your favorites</CustomText>
            </View>
            <View style={styles.featureItem}>
              <CustomText style={styles.featureIcon}>💬</CustomText>
              <CustomText style={styles.featureText}>Leave reviews & feedback</CustomText>
            </View>
          </View>
        </View>

        <View style={styles.progressIndicator}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={handleCompleteOnboarding}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <CustomText style={styles.buttonText}>Continue to Dashboard</CustomText>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          disabled={loading}
        >
          <CustomText style={styles.skipButtonText}>Skip Tour</CustomText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 50,
  },
  headerSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  onboardingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  stepIndicator: {
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  stepText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4f46e5',
  },
  contentBox: {
    marginBottom: 24,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 12,
  },
  contentDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 21,
    marginBottom: 20,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
    flex: 1,
  },
  progressIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cbd5e1',
  },
  dotActive: {
    backgroundColor: '#4f46e5',
    width: 24,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  skipButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '500',
  },
});
