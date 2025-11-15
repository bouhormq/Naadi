import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { completeOnboarding } from '@naadi/api';
import { useSession } from '@naadi/hooks/ctx';
import { OnboardingProvider, useOnboarding } from '@naadi/utils/onboarding/OnboardingContext';
import { finalizeOnboarding } from '@naadi/utils/onboarding/onboardingService';
import CustomText from '@/components/CustomText';

// Import step components
import Step1BusinessName from './(onboarding-steps)/Step1HearAboutUs';
import Step2HearAboutUs from './(onboarding-steps)/Step2HearAboutUs';
import Step3Location from './(onboarding-steps)/Step3Location';
import Step4TeamSize from './(onboarding-steps)/Step4TeamSize';
import Step5Services from './(onboarding-steps)/Step5Services';
import Step6BusinessName from './(onboarding-steps)/Step6BusinessName';
import Step7BusinessDescription from './(onboarding-steps)/Step7BusinessDescription';
import Step8WorkingHours from './(onboarding-steps)/Step8WorkingHours';
import Step9Photos from './(onboarding-steps)/Step9Photos';
import Step10StaffSetup from './(onboarding-steps)/Step10StaffSetup';
import Step11Pricing from './(onboarding-steps)/Step11Pricing';
import Step12PaymentMethods from './(onboarding-steps)/Step12PaymentMethods';
import Step13Complete from './(onboarding-steps)/Step13Complete';

function OnboardingContent() {
  const router = useRouter();
  const { session } = useSession();
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
        'hearAboutUs',            // Step 2
        'currentSoftware',        // Step 3 (was Step 2)
        'businessLocation',       // Step 4 (was Step 3)
        'teamSize',               // Step 5 (was Step 4)
        'services',               // Step 6 (was Step 5)
        'businessDescription',    // Step 7 (was Step 6)
        'workingHours',           // Step 8 (was Step 7)
        'photos',                 // Step 9 (was Step 8)
        'staff',                  // Step 10 (was Step 9)
        'packages',               // Step 11 (was Step 10)
        'paymentMethods',         // Step 12 (was Step 11)
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
      await finalizeOnboarding(session.uid, data);
      console.log('Onboarding finalized for partner');

      // Mark onboarding as completed in Users document
      await completeOnboarding(session.uid);
      console.log('Onboarding completed for partner');

      router.replace('/partners/(protected)');
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
        return <Step2HearAboutUs onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <Step3Location onNext={nextStep} onBack={prevStep} />;
      case 4:
        return <Step4TeamSize onNext={nextStep} onBack={prevStep} />;
      case 5:
        return <Step5Services onNext={nextStep} onBack={prevStep} />;
      case 6:
        return <Step6BusinessName onNext={nextStep} onBack={prevStep} />;
      case 7:
        return <Step7BusinessDescription onNext={nextStep} onBack={prevStep} />;
      case 8:
        return <Step8WorkingHours onNext={nextStep} onBack={prevStep} />;
      case 9:
        return <Step9Photos onNext={nextStep} onBack={prevStep} />;
      case 10:
        return <Step10StaffSetup onNext={nextStep} onBack={prevStep} />;
      case 11:
        return <Step11Pricing onNext={nextStep} onBack={prevStep} />;
      case 12:
        return <Step12PaymentMethods onNext={nextStep} onBack={prevStep} />;
      case 13:
        return (
          <Step13Complete 
            onComplete={handleComplete} 
            loading={loading}
          />
        );
      default:
        return <Step1BusinessName onNext={nextStep} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${(currentStep / totalSteps) * 100}%` },
          ]}
        />
      </View>

      {/* Step counter */}
      <View style={styles.stepCounterContainer}>
        <CustomText style={styles.stepCounter}>
          Step {currentStep} of {totalSteps}
        </CustomText>
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
    height: 4,
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2563eb',
  },
  stepCounterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  stepCounter: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
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
