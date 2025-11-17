import React, { createContext, useState, useCallback, useEffect } from 'react';
import { saveDraftToFirestore, loadDraftFromFirestore } from './onboardingService';

export interface OnboardingData {
  // Step 1: How did you hear about us
  hearAboutUs?: string;
  
  // Step 2: Current software
  currentSoftware?: string;
  
  // Step 3: Location
  businessLocation?: {
    address: string;
    lat: number;
    lng: number;
  };
  noPhysicalLocation?: boolean;
  
  // Step 4: Team size
  teamSize?: string;
  
  // Step 5: Services offered
  services?: string | {
    primary: string;
    related: string[];
  };
  
  // Step 6: Business name
  businessName?: string;
  website?: string;
  
  // Step 7: Business description
  businessDescription?: string;
  amenities?: string[];
  
  // Step 8: Working hours
  workingHours?: {
    [day: string]: {
      open: string;
      close: string;
      closed?: boolean;
    };
  };
  
  // Step 9: Photos
  photos?: string[];
  
  // Step 10: Staff setup
  staff?: Array<{
    name: string;
    email: string;
    role: string;
  }>;
  
  // Step 11: Pricing
  packages?: Array<{
    name: string;
    price: number;
    duration: number;
  }>;
  
  // Step 12: Payment methods
  paymentMethods?: string[];
  
  // Additional data
  [key: string]: any;
}

export interface OnboardingContextType {
  data: OnboardingData;
  currentStep: number;
  totalSteps: number;
  updateData: (key: string, value: any) => void;
  saveToFirebase: () => Promise<void>;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetOnboarding: () => void;
  isLoading: boolean;
  isSaving: boolean;
}

export const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ 
  children,
  userId,
}: { 
  children: React.ReactNode;
  userId?: string;
}) {
  const [data, setData] = useState<OnboardingData>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const totalSteps = 8; // 6 action steps + 1 complete screen + 1 dashboard

  // Load draft data on mount
  useEffect(() => {
    const loadDraft = async () => {
      if (!userId) return;

      setIsLoading(true);
      try {
        const draft = await loadDraftFromFirestore(userId);
        if (draft) {
          setData(draft);
          console.log('Draft loaded from Firestore:', draft);
        }
      } catch (error) {
        console.error('Error loading draft on mount:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDraft();
  }, [userId]);

  // Auto-save draft whenever data changes
  useEffect(() => {
    const autoSaveDraft = async () => {
      if (!userId || Object.keys(data).length === 0) return;

      try {
        await saveDraftToFirestore(userId, data);
      } catch (error) {
        console.error('Error auto-saving draft:', error);
      }
    };

    // Debounce auto-save to avoid too many writes
    const timeout = setTimeout(autoSaveDraft, 1000);
    return () => clearTimeout(timeout);
  }, [data, userId]);

  const updateData = useCallback((key: string, value: any) => {
    setData(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const saveToFirebase = useCallback(async () => {
    if (!userId) {
      console.warn('No userId provided, skipping Firebase save');
      return;
    }

    setIsSaving(true);
    try {
      await saveDraftToFirestore(userId, data);
      console.log('Onboarding data saved to Firebase');
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [data, userId]);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  const resetOnboarding = useCallback(() => {
    setData({});
    setCurrentStep(1);
  }, []);

  return (
    <OnboardingContext.Provider
      value={{
        data,
        currentStep,
        totalSteps,
        updateData,
        saveToFirebase,
        nextStep,
        prevStep,
        goToStep,
        resetOnboarding,
        isLoading,
        isSaving,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = React.useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}
