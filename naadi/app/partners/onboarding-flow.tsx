import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { completeOnboarding } from '@naadi/api';
import { useSession } from '@naadi/hooks/ctx';
import { OnboardingProvider, useOnboarding } from '@naadi/utils/onboarding/OnboardingContext';
import { finalizeOnboarding } from '@naadi/utils/api/partner';
import CustomText from '@/components/CustomText';

// Import step components
import Step1BusinessName from './(protected)/(onboarding-steps)/Step1HearAboutUs';
import Step2Services from './(protected)/(onboarding-steps)/Step5Services';
import Step3TeamSize from './(protected)/(onboarding-steps)/Step4TeamSize';
import Step4Location from './(protected)/(onboarding-steps)/Step3Location';
import Step5CurrentSoftware from './(protected)/(onboarding-steps)/Step2CurrentSoftware';
import Step6HearAboutUs from './(protected)/(onboarding-steps)/Step2HearAboutUs';
// Removed Step7Complete import
import SetupCompleteScreen from './(protected)/(onboarding-steps)/SetupCompleteScreen';

function OnboardingContent() {
  const router = useRouter();
  const { session, updateSession } = useSession();
  const { currentStep, totalSteps, nextStep, prevStep, data, isLoading } = useOnboarding();
  const [loading, setLoading] = useState(false);

  // Show loading while draft is being loaded
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <CustomText style={styles.loadingText}>Loading your progress...</CustomText>
      </View>
    );
  }

  const handleComplete = async () => {
    if (!session?.uid) return;

    setLoading(true);
    try {
      // Verify all required steps are completed
      const requiredFields = [
        'businessName',           // Step 1
        'services',               // Step 2
        'teamSize',               // Step 3
        'businessLocation',       // Step 4
        'currentSoftware',        // Step 5
        'hearAboutUs',            // Step 6
      ];

      const allStepsComplete = requiredFields.every(field => data[field] !== undefined && data[field] !== null);

      if (!allStepsComplete) {
        console.warn('Not all onboarding steps are completed');
        console.log('Missing fields:', requiredFields.filter(field => !data[field]));
        return;
      }

      // Log onboarding data for debugging
      console.log('All onboarding steps completed. Data:', data);

      // Save finalized data to Firestore
      await finalizeOnboarding(session.uid, data, session.email || undefined);
      console.log('Onboarding finalized for partner');

      // Refresh session to update onboardingCompleted status locally
      // This prevents redirection loop back to onboarding
      // We use updateSession for immediate optimistic update to ensure the router guard sees the change
      updateSession({ onboardingCompleted: true });


      // Mark onboarding as completed in Users document
      await completeOnboarding(session.uid);
      console.log('Onboarding completed for partner');

      // Small delay to ensure context propagates before navigation
      setTimeout(() => {
        router.replace('/partners/(protected)');
      }, 100);
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BusinessName onNext={nextStep} />;
      case 2:
        return <Step2Services onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <Step3TeamSize onNext={nextStep} onBack={prevStep} />;
      case 4:
        return <Step4Location onNext={nextStep} onBack={prevStep} />;
      case 5:
        return <Step5CurrentSoftware onNext={nextStep} onBack={prevStep} />;
      case 6:
        return <Step6HearAboutUs onNext={nextStep} onBack={prevStep} />;
      case 7:
        // Use SetupCompleteScreen instead of Step7Complete
        return <SetupCompleteScreen onNext={handleComplete} loading={loading} />;
      // Removed case 8 as SetupCompleteScreen now handles final step
      default:
        return <Step1BusinessName onNext={nextStep} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress bar - 5 separate chunks with spacing */}
      <View style={styles.progressContainer}>
        {[1, 2, 3, 4, 5].map((chunk) => (
          <View
            key={chunk}
            style={[
              styles.progressChunk,
              { backgroundColor: currentStep >= chunk ? '#2563eb' : '#e0e0e0' },
            ]}
          />
        ))}
      </View>

      {/* Step content */}
      <View style={styles.content}>
        {renderStep()}
      </View>
    </View>
  );
}

export default function OnboardingFlowScreen() {
  const { session } = useSession();

  return (
    <OnboardingProvider userId={session?.uid}>
      <OnboardingContent />
    </OnboardingProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  progressContainer: {
    flexDirection: 'row',
    height: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  progressChunk: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2563eb',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 12,
  },
});

